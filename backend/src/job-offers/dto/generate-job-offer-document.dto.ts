import { IsUUID } from 'class-validator';

export class GenerateJobOfferDocumentDto {
  @IsUUID('4')
  languageId!: string;
}
