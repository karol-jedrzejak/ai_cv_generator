import {
  Injectable,
  GatewayTimeoutException,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);

  private readonly baseUrl = process.env.OLLAMA_URL ?? 'http://localhost:11434';

  private readonly model = process.env.OLLAMA_MODEL ?? 'qwen2.5:7b';

  private readonly timeoutMs = Number(process.env.OLLAMA_TIMEOUT_MS ?? 300_000);

  async chat(systemPrompt: string, userPrompt: string): Promise<string> {
    const requestId = randomUUID();
    const startedAt = Date.now();

    const log = (message: string) => {
      this.logger.log(`[${requestId}] ${message}`);
    };

    const elapsed = () => `${Date.now() - startedAt} ms`;

    log(`START | model=${this.model}`);
    log(`URL=${this.baseUrl}/api/chat`);
    log(`Timeout=${this.timeoutMs} ms`);
    log(
      `Prompty przygotowane | system=${systemPrompt.length} znaków, user=${userPrompt.length} znaków`,
    );

    const payload = {
      model: this.model,
      stream: false,
      format: 'json',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      options: {
        temperature: 0.25,
        top_p: 0.85,
        repeat_penalty: 1.05,
        num_ctx: 16_384,
        num_predict: 4_096,
      },
    };

    let response: Response;

    log('Wysyłam żądanie do Ollama; oczekiwanie na odpowiedź...');

    try {
      response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      log(`Ollama zwróciła nagłówki HTTP ${response.status} po ${elapsed()}`);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === 'TimeoutError' || error.name === 'AbortError')
      ) {
        this.logger.error(
          `[${requestId}] TIMEOUT po ${elapsed()} | model=${this.model}`,
        );

        throw new GatewayTimeoutException(
          `Ollama nie odpowiedziała w czasie ${this.timeoutMs} ms`,
        );
      }

      this.logger.error(
        `[${requestId}] Błąd połączenia po ${elapsed()}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw new ServiceUnavailableException('Nie można połączyć się z Ollamą');
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');

      this.logger.error(
        `[${requestId}] HTTP ${response.status} po ${elapsed()} | ${errorBody.slice(0, 1000)}`,
      );

      if (response.status === 404) {
        throw new ServiceUnavailableException(
          `Ollama could not find model "${this.model}". Pull it with: docker exec cv-ai-ollama ollama pull ${this.model}`,
        );
      }

      throw new ServiceUnavailableException(
        `Ollama zwróciła HTTP ${response.status}${errorBody ? `: ${errorBody.slice(0, 300)}` : ''}`,
      );
    }

    log('Odpowiedź HTTP poprawna; odczytuję treść JSON...');

    let result: unknown;

    try {
      result = await response.json();

      log(`Odczytano JSON po ${elapsed()}`);
    } catch (error) {
      this.logger.error(
        `[${requestId}] Nie udało się odczytać JSON po ${elapsed()}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw new ServiceUnavailableException(
        'Ollama zwróciła odpowiedź w nieprawidłowym formacie',
      );
    }

    if (
      !result ||
      typeof result !== 'object' ||
      !('message' in result) ||
      !result.message ||
      typeof result.message !== 'object' ||
      !('content' in result.message) ||
      typeof result.message.content !== 'string'
    ) {
      this.logger.error(
        `[${requestId}] Nieprawidłowa struktura odpowiedzi po ${elapsed()}`,
      );

      throw new ServiceUnavailableException(
        'Ollama zwróciła odpowiedź w nieprawidłowym formacie',
      );
    }

    const content = result.message.content;

    log(`SUKCES | odpowiedź=${content.length} znaków | łącznie ${elapsed()}`);

    return content;
  }
}
