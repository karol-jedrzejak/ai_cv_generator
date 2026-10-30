import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeneratedCvsController } from './generated-cvs.controller';
import { GeneratedMotivationLettersController } from './generated-motivation-letters.controller';
import { JobOffersController } from './job-offers.controller';
import { JobOffersService } from './job-offers.service';
import { OllamaService } from '../ollama/ollama.service';
import { JobOfferTextService } from './job-offer-text.service';
import { AiProviderService } from '../ai-provider/ai-provider.service';
import { GoogleAiStudioService } from '../ai-provider/google-ai-studio.service';
import { GeneratedCvsService } from './generated-cvs.service';
import { GeneratedMotivationLettersService } from './generated-motivation-letters.service';

@Module({
  controllers: [
    JobOffersController,
    GeneratedCvsController,
    GeneratedMotivationLettersController,
  ],
  providers: [
    JobOffersService,
    GeneratedCvsService,
    GeneratedMotivationLettersService,
    PrismaService,
    OllamaService,
    JobOfferTextService,
    AiProviderService,
    GoogleAiStudioService,
  ],
})
export class JobOffersModule {}
