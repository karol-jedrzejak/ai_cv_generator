export const TECHNOLOGY_CATEGORIES = [
  'FRONTEND',
  'BACKEND',
  'DATABASE',
  'DEVOPS',
  'CLOUD',
  'MOBILE',
  'TESTING',
  'DATA',
  'AI',
  'SECURITY',
  'DESIGN',
  'TOOLS',
  'OTHER',
  'EMBEDDED_SYSTEMS',
  'MANAGEMENT'
] as const;

export type TechnologyCategory = (typeof TECHNOLOGY_CATEGORIES)[number];

export interface Technology {
  id: string
  name: string
  category:TechnologyCategory 
  createdAt: Date
  updatedAt: Date
}