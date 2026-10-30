import {
  GatewayTimeoutException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

@Injectable()
export class GoogleAiStudioService {
  private readonly logger = new Logger(GoogleAiStudioService.name);
  private readonly model =
    process.env.GOOGLE_AI_STUDIO_MODEL ?? 'gemini-3.8-flash';
  private readonly timeoutMs = Number(
    process.env.GOOGLE_AI_STUDIO_TIMEOUT_MS ?? 300_000,
  );

  async generate(systemPrompt: string, userPrompt: string): Promise<string> {
    this.logger.log(
      `Generating with ${this.model} via Gemini Interactions API`,
    );
    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY?.trim();
    if (!apiKey || apiKey === 'your-google-ai-studio-api-key') {
      throw new ServiceUnavailableException(
        'Google AI Studio is selected, but GOOGLE_AI_STUDIO_API_KEY is not configured',
      );
    }

    let response: Response;
    try {
      response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/interactions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            model: this.model,
            input: userPrompt,
            system_instruction: systemPrompt,
            response_format: {
              type: 'text',
              mime_type: 'application/json',
            },
            store: false,
          }),
          signal: AbortSignal.timeout(this.timeoutMs),
        },
      );
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === 'TimeoutError' || error.name === 'AbortError')
      ) {
        throw new GatewayTimeoutException(
          `Google AI Studio did not respond within ${this.timeoutMs} ms`,
        );
      }
      this.logger.error(
        'Could not connect to Google AI Studio',
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException(
        'Could not connect to Google AI Studio',
      );
    }

    if (!response.ok) {
      const errorBody = await response.text();
      this.logger.error(
        `Google AI Studio model "${this.model}" returned HTTP ${response.status}: ${errorBody.slice(0, 1000)}`,
      );
      if (response.status === 404) {
        let detail = errorBody.slice(0, 300);
        try {
          const errorResult: unknown = JSON.parse(errorBody);
          if (
            this.isRecord(errorResult) &&
            this.isRecord(errorResult.error) &&
            typeof errorResult.error.message === 'string'
          ) {
            detail = errorResult.error.message;
          }
        } catch {
          // Use the response text when Google does not return a JSON error.
        }
        throw new ServiceUnavailableException(
          `Google AI Studio model "${this.model}" is unavailable. Check GOOGLE_AI_STUDIO_MODEL and restart the backend. ${detail}`,
        );
      }
      throw new ServiceUnavailableException(
        `Google AI Studio returned HTTP ${response.status}`,
      );
    }

    const result: unknown = await response.json();
    if (!this.isRecord(result)) {
      throw new ServiceUnavailableException(
        'Google AI Studio returned an invalid response',
      );
    }

    const outputs = result.outputs;

    console.log('Pełna odpowiedź z Google AI:', JSON.stringify(response, null, 2));
    
    if (!this.isUnknownArray(outputs) || outputs.length === 0) {
      throw new ServiceUnavailableException(
        'Google AI Studio returned no generated content',
      );
    }

    const generatedText = outputs
      .filter(
        (output): output is Record<string, unknown> & { text: string } =>
          this.isRecord(output) &&
          output.type === 'text' &&
          typeof output.text === 'string',
      )
      .map((output) => output.text)
      .join('');
    if (!generatedText.trim()) {
      throw new ServiceUnavailableException(
        'Google AI Studio returned empty generated text',
      );
    }
    return generatedText;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  private isUnknownArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
  }
}
