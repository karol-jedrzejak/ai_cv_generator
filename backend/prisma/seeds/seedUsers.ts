import {
  LanguageLevel,
  LinkType,
  PrismaClient,
  ThemePreference,
  TechnologyCategory,
} from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

export async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding users...');

  const passwordHash = await bcrypt.hash('Test123!', 10);
  const sourcePhotoPath = resolve(__dirname, 'example_photo.jpg');
  const sourcePhoto = await readFile(sourcePhotoPath);
  if (
    sourcePhoto.length < 3 ||
    sourcePhoto[0] !== 0xff ||
    sourcePhoto[1] !== 0xd8 ||
    sourcePhoto[2] !== 0xff
  ) {
    throw new Error(`Seed photo is not a valid JPEG: ${sourcePhotoPath}`);
  }
  const photoFilename = `seed-user-1-${createHash('sha256')
    .update(sourcePhoto)
    .digest('hex')
    .slice(0, 12)}.jpg`;
  const avatarDirectory = resolve(__dirname, '../../dist/uploads/avatars');
  const destinationPhotoPath = resolve(avatarDirectory, photoFilename);
  const avatarUrl = `/uploads/avatars/${photoFilename}`;

  const users = [
    {
      id: 'user-1',
      name: 'Jan',
      surname: 'Kowalski',
      mobilePhone: '+48 123 456 789',
      hometown: 'Warsaw',
      username: 'jan.kowalski',
      email: 'jan.kowalski@example.com',
      passwordHash,

      avatarUrl,

      isActive: true,
      emailVerifiedAt: new Date(),

      themePreference: ThemePreference.SYSTEM,
      locale: 'pl-PL',
      timezone: 'Europe/Warsaw',

      lastLoginAt: null,
    },
    {
      id: 'user-2',
      name: 'Anna',
      surname: 'Nowak',
      mobilePhone: '+48 123 456 789',
      hometown: 'Warsaw',
      username: 'anna.nowak',
      email: 'anna.nowak@example.com',
      passwordHash,

      avatarUrl: null,

      isActive: true,
      emailVerifiedAt: new Date(),

      themePreference: ThemePreference.LIGHT,
      locale: 'pl-PL',
      timezone: 'Europe/Warsaw',

      lastLoginAt: null,
    },
  ];

  await mkdir(avatarDirectory, { recursive: true });
  await copyFile(sourcePhotoPath, destinationPhotoPath);
  const copiedPhoto = await stat(destinationPhotoPath);
  if (copiedPhoto.size !== sourcePhoto.length) {
    throw new Error(
      `Seed photo copy failed: expected ${sourcePhoto.length} bytes, got ${copiedPhoto.size}`,
    );
  }
  console.log(
    `Copied ${sourcePhotoPath} to ${destinationPhotoPath} (${avatarUrl})`,
  );

  for (const userData of users) {
    await prisma.user.upsert({
      where: {
        id: userData.id,
      },
      update: {
        name: userData.name,
        surname: userData.surname,
        mobilePhone: userData.mobilePhone,
        hometown: userData.hometown,
        username: userData.username,
        email: userData.email,
        passwordHash: userData.passwordHash,

        avatarUrl: userData.avatarUrl,

        isActive: userData.isActive,
        emailVerifiedAt: userData.emailVerifiedAt,

        themePreference: userData.themePreference,
        locale: userData.locale,
        timezone: userData.timezone,

        lastLoginAt: userData.lastLoginAt,
      },
      create: userData,
    });
  }

  const kowalskiId = 'user-1';
  const languageNames = ['Polski', 'Angielski', 'Niemiecki'];
  const technologyNames = [
    'Node.js',
    'NestJS',
    'Express.js',
    'JavaScript',
    'TypeScript',
    'React',
    'MySQL',
    'Docker',
    'Jest',
    'Git',
  ];
  const expectedTechnologyCategories: TechnologyCategory[] = [
    TechnologyCategory.BACKEND,
    TechnologyCategory.BACKEND,
    TechnologyCategory.BACKEND,
    TechnologyCategory.FRONTEND,
    TechnologyCategory.FRONTEND,
    TechnologyCategory.FRONTEND,
    TechnologyCategory.DATABASE,
    TechnologyCategory.DEVOPS,
    TechnologyCategory.TESTING,
    TechnologyCategory.TOOLS,
  ];
  const [languages, technologies] = await Promise.all([
    prisma.language.findMany({
      where: { name: { in: languageNames } },
      select: { id: true, name: true },
    }),
    prisma.technology.findMany({
      where: { name: { in: technologyNames } },
      select: { id: true, name: true, category: true },
    }),
  ]);
  const languagesByName = new Map(
    languages.flatMap((language) =>
      language.name ? [[language.name, language.id] as const] : [],
    ),
  );
  const technologiesByName = new Map(
    technologies.map((technology) => [technology.name, technology]),
  );
  const missingLanguages = languageNames.filter(
    (name) => !languagesByName.has(name),
  );
  const missingTechnologies = technologyNames.filter(
    (name) => !technologiesByName.has(name),
  );
  if (missingLanguages.length || missingTechnologies.length) {
    throw new Error(
      `Kowalski seed dependencies are missing. Languages: ${missingLanguages.join(', ') || 'none'}; technologies: ${missingTechnologies.join(', ') || 'none'}`,
    );
  }

  await Promise.all([
    prisma.userSocialLink.deleteMany({ where: { userId: kowalskiId } }),
    prisma.userTechnology.deleteMany({ where: { userId: kowalskiId } }),
    prisma.languageSkill.deleteMany({ where: { userId: kowalskiId } }),
    prisma.workExperience.deleteMany({ where: { userId: kowalskiId } }),
    prisma.project.deleteMany({ where: { userId: kowalskiId } }),
    prisma.education.deleteMany({ where: { userId: kowalskiId } }),
    prisma.course.deleteMany({ where: { userId: kowalskiId } }),
    prisma.certification.deleteMany({ where: { userId: kowalskiId } }),
  ]);

  await Promise.all([
    prisma.userSocialLink.createMany({
      data: [
        {
          userId: kowalskiId,
          type: LinkType.GITHUB,
          label: 'GitHub',
          url: 'https://github.com/jan-kowalski',
          sortOrder: 0,
        },
        {
          userId: kowalskiId,
          type: LinkType.LINKEDIN,
          label: 'LinkedIn',
          url: 'https://www.linkedin.com/in/jan-kowalski-demo',
          sortOrder: 1,
        },
        {
          userId: kowalskiId,
          type: LinkType.PERSONAL_WEBSITE,
          label: 'Portfolio',
          url: 'https://jan-kowalski.example.com',
          sortOrder: 2,
        },
      ],
    }),
    prisma.userTechnology.createMany({
      data: technologyNames.map((name, index) => {
        const technology = technologiesByName.get(name);
        if (!technology) {
          throw new Error(`Missing seeded technology: ${name}`);
        }
        const expectedCategory = expectedTechnologyCategories[index];
        if (technology.category !== expectedCategory) {
          throw new Error(
            `Technology ${name} is not in the expected ${expectedCategory} category`,
          );
        }
        return {
          userId: kowalskiId,
          technologyId: technology.id,
          proficiency: index < 6 ? 4 : 3,
        };
      }),
    }),
    prisma.languageSkill.createMany({
      data: [
        {
          userId: kowalskiId,
          languageId: languagesByName.get('Polski')!,
          level: LanguageLevel.NATIVE,
          sortOrder: 0,
        },
        {
          userId: kowalskiId,
          languageId: languagesByName.get('Angielski')!,
          level: LanguageLevel.C1,
          sortOrder: 1,
        },
        {
          userId: kowalskiId,
          languageId: languagesByName.get('Niemiecki')!,
          level: LanguageLevel.B1,
          sortOrder: 2,
        },
      ],
    }),
    prisma.workExperience.createMany({
      data: [
        {
          userId: kowalskiId,
          companyName: 'Northstar Software',
          position: 'Full-Stack Developer',
          location: 'Warsaw, Poland',
          startYear: 2022,
          startMonth: 3,
          isCurrent: true,
          description:
            'Developed internal web applications for operations teams.',
          responsibilities:
            'Built React interfaces and NestJS REST endpoints; reviewed pull requests.',
          achievements:
            'Helped reduce repeated manual reporting through workflow automation.',
          sortOrder: 0,
        },
        {
          userId: kowalskiId,
          companyName: 'BrightPath Digital',
          position: 'Frontend Developer',
          location: 'Warsaw, Poland',
          startYear: 2020,
          startMonth: 6,
          endYear: 2022,
          endMonth: 2,
          isCurrent: false,
          description:
            'Created responsive dashboards and customer-facing web features.',
          responsibilities:
            'Implemented React components and coordinated API integration with backend engineers.',
          achievements:
            'Improved accessibility and consistency across shared UI components.',
          sortOrder: 1,
        },
        {
          userId: kowalskiId,
          companyName: 'PixelCraft Studio',
          position: 'Junior Web Developer',
          location: 'Warsaw, Poland',
          startYear: 2018,
          startMonth: 7,
          endYear: 2020,
          endMonth: 5,
          isCurrent: false,
          description:
            'Maintained websites and implemented small business web applications.',
          responsibilities:
            'Worked on JavaScript features, bug fixes, and browser compatibility.',
          achievements:
            'Delivered regular website updates with the design and content teams.',
          sortOrder: 2,
        },
      ],
    }),
    prisma.project.createMany({
      data: [
        {
          userId: kowalskiId,
          name: 'Team Task Planner',
          startYear: 2024,
          startMonth: 1,
          description:
            'A small task planning application for distributed teams.',
          responsibilities:
            'Implemented the dashboard, task filters, and REST API integration.',
          achievements:
            'Added clear task status views and keyboard-friendly navigation.',
          projectUrl: 'https://planner.example.com',
          repositoryUrl: 'https://github.com/jan-kowalski-demo/team-planner',
          sortOrder: 0,
        },
        {
          userId: kowalskiId,
          name: 'Local Events Finder',
          startYear: 2023,
          startMonth: 4,
          endYear: 2023,
          endMonth: 10,
          description:
            'A responsive web app for browsing community events by location.',
          responsibilities:
            'Built event search and reusable listing components.',
          achievements:
            'Created a mobile-friendly interface with accessible form controls.',
          projectUrl: 'https://events.example.com',
          repositoryUrl: 'https://github.com/jan-kowalski-demo/events-finder',
          sortOrder: 1,
        },
        {
          userId: kowalskiId,
          name: 'Study Notes API',
          startYear: 2022,
          startMonth: 2,
          endYear: 2022,
          endMonth: 8,
          description:
            'A demo API for organizing study notes and learning topics.',
          responsibilities:
            'Designed API routes and added validation for note operations.',
          achievements:
            'Documented the API endpoints and added automated tests.',
          repositoryUrl: 'https://github.com/jan-kowalski-demo/study-notes',
          sortOrder: 2,
        },
      ],
    }),
    prisma.education.createMany({
      data: [
        {
          userId: kowalskiId,
          institutionName: 'Warsaw Middle School No. 12',
          fieldOfStudy: 'General education',
          startYear: 2010,
          endYear: 2013,
          description: 'Completed middle-school education in Warsaw.',
          sortOrder: 0,
        },
        {
          userId: kowalskiId,
          institutionName: 'Warsaw Technical High School',
          fieldOfStudy: 'Information Technology',
          startYear: 2013,
          endYear: 2016,
          description:
            'Completed secondary education with a focus on information technology.',
          achievements: 'School projects in programming and computer networks.',
          sortOrder: 1,
        },
      ],
    }),
    prisma.course.createMany({
      data: [
        {
          userId: kowalskiId,
          name: 'Advanced TypeScript',
          organization: 'Code Academy',
          startYear: 2024,
          endYear: 2024,
          description: 'Practical TypeScript patterns for maintainable apps.',
          learnedSkills: 'Generics, utility types, and type-safe API clients.',
          sortOrder: 0,
        },
        {
          userId: kowalskiId,
          name: 'Building REST APIs with NestJS',
          organization: 'DevPath',
          startYear: 2023,
          endYear: 2023,
          description: 'A project-based course on NestJS backend development.',
          learnedSkills:
            'Modules, controllers, services, validation, and testing.',
          sortOrder: 1,
        },
        {
          userId: kowalskiId,
          name: 'Modern React Applications',
          organization: 'Frontend Lab',
          startYear: 2022,
          endYear: 2022,
          description: 'Building reusable and accessible React interfaces.',
          learnedSkills: 'Hooks, component composition, and state management.',
          sortOrder: 2,
        },
        {
          userId: kowalskiId,
          name: 'SQL and Database Design',
          organization: 'Open Learning Institute',
          startYear: 2021,
          endYear: 2021,
          description: 'Relational database fundamentals and query practice.',
          learnedSkills:
            'Schema design, joins, indexes, and query optimization.',
          sortOrder: 3,
        },
        {
          userId: kowalskiId,
          name: 'Practical Docker for Developers',
          organization: 'CloudSkills',
          startYear: 2020,
          endYear: 2020,
          description: 'Containerizing and running development environments.',
          learnedSkills: 'Dockerfiles, images, containers, and Compose.',
          sortOrder: 4,
        },
      ],
    }),
    prisma.certification.createMany({
      data: [
        {
          userId: kowalskiId,
          name: 'JavaScript Developer Certificate',
          organization: 'Code Academy',
          issuedYear: 2023,
          issuedMonth: 5,
          credentialId: 'CA-JS-2023-1042',
          credentialUrl: 'https://credentials.example.com/CA-JS-2023-1042',
          description: 'Assessment of modern JavaScript development skills.',
        },
        {
          userId: kowalskiId,
          name: 'AWS Cloud Practitioner (Demo)',
          organization: 'CloudSkills',
          issuedYear: 2022,
          issuedMonth: 9,
          credentialId: 'CS-AWS-2209-581',
          credentialUrl: 'https://credentials.example.com/CS-AWS-2209-581',
          description: 'Foundational cloud concepts and AWS services.',
        },
        {
          userId: kowalskiId,
          name: 'Professional Scrum Foundations',
          organization: 'Agile Learning Group',
          issuedYear: 2021,
          issuedMonth: 11,
          credentialId: 'ALG-SCRUM-2111-307',
          credentialUrl: 'https://credentials.example.com/ALG-SCRUM-2111-307',
          description: 'Foundational Scrum roles, events, and practices.',
        },
      ],
    }),
  ]);

  const [workExperiences, projects, education, courses, certifications] =
    await Promise.all([
      prisma.workExperience.findMany({
        where: { userId: kowalskiId },
        select: { id: true, companyName: true },
      }),
      prisma.project.findMany({
        where: { userId: kowalskiId },
        select: { id: true, name: true },
      }),
      prisma.education.findMany({
        where: { userId: kowalskiId },
        select: { id: true, institutionName: true },
      }),
      prisma.course.findMany({
        where: { userId: kowalskiId },
        select: { id: true, name: true },
      }),
      prisma.certification.findMany({
        where: { userId: kowalskiId },
        select: { id: true, name: true },
      }),
    ]);

  const getTechnologyId = (name: string) => {
    const technology = technologiesByName.get(name);
    if (!technology) {
      throw new Error(`Missing seeded technology: ${name}`);
    }
    return technology.id;
  };

  const technologyAssignments = <T extends { id: string }>(
    records: T[],
    getNames: (record: T) => string[],
  ) =>
    records.flatMap((record) =>
      getNames(record)
        .slice(0, 3)
        .map((name) => ({
          recordId: record.id,
          technologyId: getTechnologyId(name),
        })),
    );

  await Promise.all([
    prisma.workExperienceTechnology.createMany({
      data: technologyAssignments(
        workExperiences,
        (record) =>
          ({
            'Northstar Software': ['Node.js', 'NestJS', 'MySQL'],
            'BrightPath Digital': ['React', 'TypeScript', 'JavaScript'],
            'PixelCraft Studio': ['JavaScript', 'Express.js', 'Git'],
          })[record.companyName] ?? [],
      ).map(({ recordId, technologyId }) => ({
        workExperienceId: recordId,
        technologyId,
      })),
    }),
    prisma.projectTechnology.createMany({
      data: technologyAssignments(
        projects,
        (record) =>
          ({
            'Team Task Planner': ['React', 'TypeScript', 'Node.js'],
            'Local Events Finder': ['React', 'JavaScript', 'MySQL'],
            'Study Notes API': ['Node.js', 'NestJS', 'Jest'],
          })[record.name] ?? [],
      ).map(({ recordId, technologyId }) => ({
        projectId: recordId,
        technologyId,
      })),
    }),
    prisma.educationTechnology.createMany({
      data: technologyAssignments(
        education,
        (record) =>
          ({
            'Warsaw Middle School No. 12': ['JavaScript'],
            'Warsaw Technical High School': ['JavaScript', 'MySQL', 'Git'],
          })[record.institutionName] ?? [],
      ).map(({ recordId, technologyId }) => ({
        educationId: recordId,
        technologyId,
      })),
    }),
    prisma.courseTechnology.createMany({
      data: technologyAssignments(
        courses,
        (record) =>
          ({
            'Advanced TypeScript': ['TypeScript', 'React', 'Node.js'],
            'Building REST APIs with NestJS': ['NestJS', 'Node.js', 'MySQL'],
            'Modern React Applications': ['React', 'JavaScript', 'TypeScript'],
            'SQL and Database Design': ['MySQL', 'Node.js'],
            'Practical Docker for Developers': ['Docker', 'Git'],
          })[record.name] ?? [],
      ).map(({ recordId, technologyId }) => ({
        courseId: recordId,
        technologyId,
      })),
    }),
    prisma.certificationTechnology.createMany({
      data: technologyAssignments(
        certifications,
        (record) =>
          ({
            'JavaScript Developer Certificate': [
              'JavaScript',
              'TypeScript',
              'React',
            ],
            'AWS Cloud Practitioner (Demo)': ['Docker', 'Node.js'],
            'Professional Scrum Foundations': ['Git', 'Jest'],
          })[record.name] ?? [],
      ).map(({ recordId, technologyId }) => ({
        certificationId: recordId,
        technologyId,
      })),
    }),
  ]);

  console.log('Users seeded successfully!');
}
