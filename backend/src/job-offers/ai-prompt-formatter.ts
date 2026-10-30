interface Technology {
  technology: { name: string };
}

interface CandidatePromptProfile {
  name: string;
  surname: string;
  email: string;
  mobilePhone: string;
  hometown: string;
  avatarUrl?: string | null;
  socialLinks: Array<{ type: string; label: string | null; url: string }>;
  technologySkills: Technology[];
  languageSkills: Array<{
    level: string;
    language: { name: string | null };
  }>;
  workExperiences: Array<{
    companyName: string;
    position: string;
    location: string | null;
    startYear: number;
    startMonth: number | null;
    endYear: number | null;
    endMonth: number | null;
    isCurrent: boolean;
    description: string | null;
    responsibilities: string | null;
    achievements: string | null;
    technologies: Technology[];
  }>;
  projects: Array<{
    name: string;
    startYear: number | null;
    startMonth: number | null;
    endYear: number | null;
    endMonth: number | null;
    description: string | null;
    responsibilities: string | null;
    achievements: string | null;
    projectUrl: string | null;
    repositoryUrl: string | null;
    technologies: Technology[];
  }>;
  education: Array<{
    institutionName: string;
    fieldOfStudy: string | null;
    startYear: number | null;
    startMonth: number | null;
    endYear: number | null;
    endMonth: number | null;
    description: string | null;
    achievements: string | null;
    educationalTechnologies: Technology[];
  }>;
  courses: Array<{
    name: string;
    organization: string | null;
    startYear: number | null;
    startMonth: number | null;
    endYear: number | null;
    endMonth: number | null;
    description: string | null;
    learnedSkills: string | null;
    technologies: Technology[];
  }>;
  certifications: Array<{
    name: string;
    organization: string;
    issuedYear: number | null;
    issuedMonth: number | null;
    expirationYear: number | null;
    expirationMonth: number | null;
    description: string | null;
    certificationTechnologies: Technology[];
  }>;
}

interface JobOfferPromptData {
  title: string;
  companyName: string | null;
  url: string | null;
  description: string;
  pageText: string;
}

interface PromptData {
  language: string;
  candidate: CandidatePromptProfile;
  jobOffer: JobOfferPromptData;
}

const value = (text: string | null | undefined) => text?.trim() ?? '';

const details = (...items: Array<string | null | undefined>) =>
  items.map(value).filter(Boolean).join('; ');

const date = (year: number | null, month: number | null) =>
  year === null
    ? ''
    : month === null
      ? String(year)
      : `${year}-${String(month).padStart(2, '0')}`;

const dateRange = (
  startYear: number | null,
  startMonth: number | null,
  endYear: number | null,
  endMonth: number | null,
  isCurrent = false,
) => {
  const start = date(startYear, startMonth);
  const end = isCurrent ? 'Present' : date(endYear, endMonth);
  return start || end ? `${start || 'Unknown'} – ${end || 'Unknown'}` : '';
};

const technologyNames = (technologies: Technology[]) =>
  [
    ...new Set(technologies.map(({ technology }) => value(technology.name))),
  ].join('; ');

const appendSection = (lines: string[], title: string, entries: string[]) => {
  const populatedEntries = entries.filter(Boolean);
  if (populatedEntries.length > 0) {
    lines.push(
      '',
      `${title}:`,
      ...populatedEntries.map((entry) => `- ${entry}`),
    );
  }
};

export function formatAiUserPrompt({
  language,
  candidate,
  jobOffer,
}: PromptData): string {
  const lines = [
    `Required output language: ${language}`,
    '',
    'Candidate profile:',
    `Name: ${candidate.name} ${candidate.surname}`,
    `Email: ${candidate.email}`,
    `Phone: ${candidate.mobilePhone}`,
    `Hometown: ${candidate.hometown}`,
  ];

  if (candidate.avatarUrl) {
    lines.push(`Avatar URL: ${candidate.avatarUrl}`);
  }

  appendSection(
    lines,
    'Social links',
    candidate.socialLinks.map(
      ({ type, label, url }) => `${value(label) || type}: ${url}`,
    ),
  );
  appendSection(lines, 'Technology skills', [
    [
      ...new Set(
        candidate.technologySkills.map(({ technology }) =>
          value(technology.name),
        ),
      ),
    ]
      .filter(Boolean)
      .join('; '),
  ]);
  appendSection(
    lines,
    'Languages',
    candidate.languageSkills.map(({ language: itemLanguage, level }) =>
      details(itemLanguage.name, level && `level ${level}`),
    ),
  );
  appendSection(
    lines,
    'Work experience',
    candidate.workExperiences.map((item) =>
      details(
        `${item.companyName} — ${item.position}`,
        dateRange(
          item.startYear,
          item.startMonth,
          item.endYear,
          item.endMonth,
          item.isCurrent,
        ),
        item.location,
        technologyNames(item.technologies) &&
          `Technologies: ${technologyNames(item.technologies)}`,
        item.description,
        item.responsibilities,
        item.achievements,
      ),
    ),
  );
  appendSection(
    lines,
    'Projects',
    candidate.projects.map((item) =>
      details(
        item.name,
        dateRange(item.startYear, item.startMonth, item.endYear, item.endMonth),
        technologyNames(item.technologies) &&
          `Technologies: ${technologyNames(item.technologies)}`,
        item.projectUrl,
        item.repositoryUrl,
        item.description,
        item.responsibilities,
        item.achievements,
      ),
    ),
  );
  appendSection(
    lines,
    'Education',
    candidate.education.map((item) =>
      details(
        item.institutionName,
        item.fieldOfStudy,
        dateRange(item.startYear, item.startMonth, item.endYear, item.endMonth),
        technologyNames(item.educationalTechnologies) &&
          `Technologies: ${technologyNames(item.educationalTechnologies)}`,
        item.description,
        item.achievements,
      ),
    ),
  );
  appendSection(
    lines,
    'Courses',
    candidate.courses.map((item) =>
      details(
        item.name,
        item.organization,
        dateRange(item.startYear, item.startMonth, item.endYear, item.endMonth),
        technologyNames(item.technologies) &&
          `Technologies: ${technologyNames(item.technologies)}`,
        item.description,
        item.learnedSkills,
      ),
    ),
  );
  appendSection(
    lines,
    'Certifications',
    candidate.certifications.map((item) =>
      details(
        item.name,
        item.organization,
        dateRange(
          item.issuedYear,
          item.issuedMonth,
          item.expirationYear,
          item.expirationMonth,
        ),
        technologyNames(item.certificationTechnologies) &&
          `Technologies: ${technologyNames(item.certificationTechnologies)}`,
        item.description,
      ),
    ),
  );

  lines.push(
    '',
    'Job offer:',
    `Title: ${jobOffer.title}`,
    `Company: ${jobOffer.companyName ?? ''}`,
    `URL: ${jobOffer.url ?? ''}`,
    `Description: ${jobOffer.description}`,
    '',
    'Job offer page text:',
    jobOffer.pageText,
  );

  return lines.join('\n');
}
