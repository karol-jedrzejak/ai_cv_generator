import type { Interactions } from '@google/genai';

const stringSchema = { type: 'string' };
const stringArraySchema = {
  type: 'array',
  items: stringSchema,
};
const yearSchema = {
  type: 'integer',
  nullable: true,
};
const technologyStackSchema = {
  type: 'object',
  additionalProperties: stringArraySchema,
};

export const COVER_LETTER_RESPONSE_FORMAT: Interactions.TextResponseFormat = {
  type: 'text',
  mime_type: 'application/json',
  schema: {
    type: 'object',
    properties: {
      paragraphs: stringArraySchema,
      name: stringSchema,
      surname: stringSchema,
      phone: stringSchema,
      hometown: stringSchema,
      email: stringSchema,
      role: stringSchema,
      roleStack: stringSchema,
      techstack: technologyStackSchema,
    },
    required: [
      'paragraphs',
      'name',
      'surname',
      'phone',
      'hometown',
      'email',
      'role',
      'roleStack',
      'techstack',
    ],
  },
};

export const CV_RESPONSE_FORMAT: Interactions.TextResponseFormat = {
  type: 'text',
  mime_type: 'application/json',
  schema: {
    type: 'object',
    properties: {
      summaryText: stringSchema,
      name: stringSchema,
      surname: stringSchema,
      phone: stringSchema,
      hometown: stringSchema,
      email: stringSchema,
      avatarUrl: { ...stringSchema, nullable: true },
      role: stringSchema,
      roleStack: stringSchema,
      techstack: technologyStackSchema,
      languages: {
        type: 'array',
        items: {
          type: 'object',
          properties: { name: stringSchema, level: stringSchema },
          required: ['name', 'level'],
        },
      },
      links: {
        type: 'array',
        items: {
          type: 'object',
          properties: { label: stringSchema, url: stringSchema },
          required: ['label', 'url'],
        },
      },
      WorkExperience: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            companyName: stringSchema,
            position: stringSchema,
            startYear: yearSchema,
            endYear: yearSchema,
            isCurrent: { type: 'boolean' },
            description: stringArraySchema,
          },
          required: [
            'companyName',
            'position',
            'startYear',
            'endYear',
            'isCurrent',
            'description',
          ],
        },
      },
      projects: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            projectName: stringSchema,
            role: stringSchema,
            techstack: stringArraySchema,
            description: stringArraySchema,
          },
          required: ['projectName', 'role', 'techstack', 'description'],
        },
      },
      education: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            institutionName: stringSchema,
            fieldOfStudy: stringSchema,
            academicTitle: stringSchema,
          },
          required: ['institutionName', 'fieldOfStudy', 'academicTitle'],
        },
      },
      courses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            courseName: stringSchema,
            organization: stringSchema,
            year: yearSchema,
            description: stringSchema,
          },
          required: ['courseName', 'organization', 'year', 'description'],
        },
      },
      certifications: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            certificationName: stringSchema,
            organization: stringSchema,
            issuedYear: yearSchema,
            description: stringSchema,
          },
          required: [
            'certificationName',
            'organization',
            'issuedYear',
            'description',
          ],
        },
      },
    },
    required: [
      'summaryText',
      'name',
      'surname',
      'phone',
      'hometown',
      'email',
      'avatarUrl',
      'role',
      'roleStack',
      'techstack',
      'languages',
      'links',
      'WorkExperience',
      'projects',
      'education',
      'courses',
      'certifications',
    ],
  },
};
