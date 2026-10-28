import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GenerateJobOfferDocumentDto } from './dto/generate-job-offer-document.dto';
import { JobOffersService } from './job-offers.service';

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

@UseGuards(JwtAuthGuard)
@Controller('job-offers/:jobOfferId/generated-motivation-letters')
export class GeneratedMotivationLettersController {
  constructor(private readonly jobOffersService: JobOffersService) {}

  @Get()
  getAll(
    @Req() req: AuthenticatedRequest,
    @Param('jobOfferId', ParseUUIDPipe) jobOfferId: string,
  ) {
    return this.jobOffersService.findGeneratedMotivationLetters(
      req.user.id,
      jobOfferId,
    );
  }

  @Post('generate')
  generate(
    @Req() req: AuthenticatedRequest,
    @Param('jobOfferId', ParseUUIDPipe) jobOfferId: string,
    @Body() dto: GenerateJobOfferDocumentDto,
  ) {
    return this.jobOffersService.generateMotivationLetter(
      req.user.id,
      jobOfferId,
      dto.languageId,
    );
  }

  @Get(':documentId')
  getOne(
    @Req() req: AuthenticatedRequest,
    @Param('jobOfferId', ParseUUIDPipe) jobOfferId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ) {
    return this.jobOffersService.findGeneratedMotivationLetter(
      req.user.id,
      jobOfferId,
      documentId,
    );
  }

  @Delete(':documentId')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('jobOfferId', ParseUUIDPipe) jobOfferId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ) {
    return this.jobOffersService.removeGeneratedMotivationLetter(
      req.user.id,
      jobOfferId,
      documentId,
    );
  }
}
