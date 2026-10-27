export const LANGUAGE_LEVELS = [
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2',
  'NATIVE',
] as const;

export type LanguageLevel = (typeof LANGUAGE_LEVELS)[number];

export interface Language {
  id: string;
  name: string | null;
}

export interface LanguageSkill {
  id: string;
  userId: string;
  languageId: string;
  level: LanguageLevel;
  sortOrder: number;
  language: Language;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLanguageSkillDto {
  languageId: string;
  level: LanguageLevel;
  sortOrder?: number;
}

export type UpdateLanguageSkillDto = Partial<CreateLanguageSkillDto>;
