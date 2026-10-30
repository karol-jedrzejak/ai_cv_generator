import {
  GatewayTimeoutException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiError, GoogleGenAI, type Interactions } from '@google/genai';

@Injectable()
export class GoogleAiStudioService {
  private readonly logger = new Logger(GoogleAiStudioService.name);
  private readonly model =
    process.env.GOOGLE_AI_STUDIO_MODEL ?? 'gemini-3.8-flash';
  private readonly timeoutMs = Number(
    process.env.GOOGLE_AI_STUDIO_TIMEOUT_MS ?? 300_000,
  );

  async generate(
    systemPrompt: string,
    userPrompt: string,
    responseFormat: Interactions.TextResponseFormat,
  ): Promise<string> {
    this.logger.log(
      `Generating with ${this.model} via Gemini Interactions API`,
    );
    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY?.trim();
    if (!apiKey || apiKey === 'your-google-ai-studio-api-key') {
      throw new ServiceUnavailableException(
        'Google AI Studio is selected, but GOOGLE_AI_STUDIO_API_KEY is not configured',
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    let interaction: Interactions.Interaction;
    try {
      interaction = await ai.interactions.create(
        {
          model: this.model,
          input: userPrompt,
          system_instruction: systemPrompt,
          response_format: responseFormat,
          store: false,
        },
        { timeout_ms: this.timeoutMs },
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
      if (error instanceof ApiError) {
        this.logger.error(
          `Google AI Studio model "${this.model}" returned HTTP ${error.status}: ${error.message.slice(0, 1000)}`,
        );
        if (error.status === 404) {
          throw new ServiceUnavailableException(
            `Google AI Studio model "${this.model}" is unavailable. Check GOOGLE_AI_STUDIO_MODEL and restart the backend. ${error.message.slice(0, 300)}`,
          );
        }
        throw new ServiceUnavailableException(
          `Google AI Studio returned HTTP ${error.status}`,
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
    const generatedText = interaction.output_text;
    if (typeof generatedText !== 'string' || !generatedText.trim()) {
      throw new ServiceUnavailableException(
        'Google AI Studio returned empty generated text',
      );
    }
    return generatedText;
  }
}
