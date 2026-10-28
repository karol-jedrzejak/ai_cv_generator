import {
  Injectable,
  GatewayTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';

@Injectable()
export class OllamaService {
  private readonly baseUrl =
    process.env.OLLAMA_URL ?? 'http://localhost:11434';

  private readonly model =
    process.env.OLLAMA_MODEL ?? 'qwen2.5:7b';

  async chat(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<string> {
    let response: Response;

    try {
      response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          stream: false,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          options: {
            temperature: 0.4,
          },
        }),
        signal: AbortSignal.timeout(120_000),
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === 'TimeoutError'
      ) {
        throw new GatewayTimeoutException(
          'Generowanie przez AI trwało zbyt długo',
        );
      }

      throw new ServiceUnavailableException(
        'Nie można połączyć się z Ollamą',
      );
    }

    if (!response.ok) {
      throw new ServiceUnavailableException(
        `Ollama zwróciła HTTP ${response.status}`,
      );
    }

    const result = await response.json();

    return result.message.content;
  }
}
