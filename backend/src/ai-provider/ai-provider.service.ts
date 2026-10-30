import {
  GatewayTimeoutException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AiProvider } from '../../generated/prisma/client';
import { GoogleAiStudioService } from './google-ai-studio.service';
import { OllamaService } from '../ollama/ollama.service';

@Injectable()
export class AiProviderService {
  private readonly logger = new Logger(AiProviderService.name);

  constructor(
    private readonly ollama: OllamaService,
    private readonly googleAiStudio: GoogleAiStudioService,
  ) {}

  async generate(
    provider: AiProvider,
    systemPrompt: string,
    userPrompt: string,
  ): Promise<string> {
    try {
      switch (provider) {
        case AiProvider.OLLAMA:
          return await this.ollama.chat(systemPrompt, userPrompt);
        case AiProvider.GOOGLE_AI_STUDIO:
          return await this.googleAiStudio.generate(systemPrompt, userPrompt);
        default:
          throw new ServiceUnavailableException(
            'The selected AI provider is not supported',
          );
      }
    } catch (error) {
      if (
        error instanceof GatewayTimeoutException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }
      this.logger.error(
        `AI generation failed using ${provider}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException(
        `AI generation failed using ${provider}`,
      );
    }
  }
}
