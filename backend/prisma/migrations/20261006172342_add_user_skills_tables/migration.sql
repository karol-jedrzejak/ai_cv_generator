-- CreateEnum
CREATE TYPE "LanguageLevel" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'NATIVE');

-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('GITHUB', 'LINKEDIN', 'FACEBOOK', 'X', 'TWITTER', 'INSTAGRAM', 'YOUTUBE', 'PERSONAL_WEBSITE', 'OTHER');

-- CreateEnum
CREATE TYPE "TechnologyCategory" AS ENUM ('FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS', 'CLOUD', 'MOBILE', 'TESTING', 'DATA', 'AI', 'SECURITY', 'DESIGN', 'TOOLS', 'OTHER');

-- CreateTable
CREATE TABLE "certification_technologies" (
    "certificationId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,

    CONSTRAINT "certification_technologies_pkey" PRIMARY KEY ("certificationId","technologyId")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "organization" VARCHAR(255) NOT NULL,
    "issuedYear" INTEGER,
    "issuedMonth" INTEGER,
    "expirationYear" INTEGER,
    "expirationMonth" INTEGER,
    "credentialId" VARCHAR(255),
    "credentialUrl" VARCHAR(500),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_technologies" (
    "courseId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,

    CONSTRAINT "course_technologies_pkey" PRIMARY KEY ("courseId","technologyId")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "organization" VARCHAR(255),
    "startYear" INTEGER,
    "startMonth" INTEGER,
    "endYear" INTEGER,
    "endMonth" INTEGER,
    "description" TEXT,
    "learnedSkills" TEXT,
    "certificateUrl" VARCHAR(500),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_technologies" (
    "educationId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,

    CONSTRAINT "education_technologies_pkey" PRIMARY KEY ("educationId","technologyId")
);

-- CreateTable
CREATE TABLE "education" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "institutionName" VARCHAR(255) NOT NULL,
    "fieldOfStudy" VARCHAR(255),
    "startYear" INTEGER,
    "startMonth" INTEGER,
    "endYear" INTEGER,
    "endMonth" INTEGER,
    "description" TEXT,
    "achievements" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_cvs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobOfferId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "description" TEXT,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generated_cvs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_motivation_letters" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobOfferId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "description" TEXT,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generated_motivation_letters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_offers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "companyName" VARCHAR(255),
    "location" VARCHAR(255),
    "url" VARCHAR(1000),
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "language_skills" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "level" "LanguageLevel" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "language_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_technologies" (
    "projectId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,

    CONSTRAINT "project_technologies_pkey" PRIMARY KEY ("projectId","technologyId")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "startYear" INTEGER,
    "startMonth" INTEGER,
    "endYear" INTEGER,
    "endMonth" INTEGER,
    "description" TEXT,
    "responsibilities" TEXT,
    "achievements" TEXT,
    "projectUrl" VARCHAR(500),
    "repositoryUrl" VARCHAR(500),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technologies" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" "TechnologyCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technologies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_social_links" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "LinkType" NOT NULL,
    "label" VARCHAR(100),
    "url" VARCHAR(500) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_technologies" (
    "userId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,
    "proficiency" INTEGER NOT NULL,

    CONSTRAINT "user_technologies_pkey" PRIMARY KEY ("userId","technologyId")
);

-- CreateTable
CREATE TABLE "work_experience_technologies" (
    "workExperienceId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,

    CONSTRAINT "work_experience_technologies_pkey" PRIMARY KEY ("workExperienceId","technologyId")
);

-- CreateTable
CREATE TABLE "work_experiences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" VARCHAR(200) NOT NULL,
    "position" VARCHAR(200) NOT NULL,
    "location" VARCHAR(255),
    "startYear" INTEGER NOT NULL,
    "startMonth" INTEGER,
    "endYear" INTEGER,
    "endMonth" INTEGER,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "responsibilities" TEXT,
    "achievements" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "certification_technologies_technologyId_idx" ON "certification_technologies"("technologyId");

-- CreateIndex
CREATE INDEX "certifications_userId_idx" ON "certifications"("userId");

-- CreateIndex
CREATE INDEX "course_technologies_technologyId_idx" ON "course_technologies"("technologyId");

-- CreateIndex
CREATE INDEX "courses_userId_idx" ON "courses"("userId");

-- CreateIndex
CREATE INDEX "courses_userId_startYear_idx" ON "courses"("userId", "startYear");

-- CreateIndex
CREATE INDEX "education_technologies_technologyId_idx" ON "education_technologies"("technologyId");

-- CreateIndex
CREATE INDEX "education_userId_idx" ON "education"("userId");

-- CreateIndex
CREATE INDEX "education_userId_startYear_idx" ON "education"("userId", "startYear");

-- CreateIndex
CREATE INDEX "generated_cvs_languageId_idx" ON "generated_cvs"("languageId");

-- CreateIndex
CREATE INDEX "generated_cvs_userId_idx" ON "generated_cvs"("userId");

-- CreateIndex
CREATE INDEX "generated_cvs_jobOfferId_idx" ON "generated_cvs"("jobOfferId");

-- CreateIndex
CREATE INDEX "generated_motivation_letters_userId_idx" ON "generated_motivation_letters"("userId");

-- CreateIndex
CREATE INDEX "generated_motivation_letters_jobOfferId_idx" ON "generated_motivation_letters"("jobOfferId");

-- CreateIndex
CREATE INDEX "generated_motivation_letters_languageId_idx" ON "generated_motivation_letters"("languageId");

-- CreateIndex
CREATE INDEX "job_offers_userId_idx" ON "job_offers"("userId");

-- CreateIndex
CREATE INDEX "language_skills_userId_idx" ON "language_skills"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "language_skills_userId_languageId_key" ON "language_skills"("userId", "languageId");

-- CreateIndex
CREATE INDEX "project_technologies_technologyId_idx" ON "project_technologies"("technologyId");

-- CreateIndex
CREATE INDEX "projects_userId_idx" ON "projects"("userId");

-- CreateIndex
CREATE INDEX "projects_userId_startYear_idx" ON "projects"("userId", "startYear");

-- CreateIndex
CREATE UNIQUE INDEX "technologies_name_key" ON "technologies"("name");

-- CreateIndex
CREATE INDEX "technologies_category_idx" ON "technologies"("category");

-- CreateIndex
CREATE INDEX "idx_user_social_links_user_id" ON "user_social_links"("userId");

-- CreateIndex
CREATE INDEX "idx_user_social_links_user_sort_order" ON "user_social_links"("userId", "sortOrder");

-- CreateIndex
CREATE INDEX "user_technologies_technologyId_idx" ON "user_technologies"("technologyId");

-- CreateIndex
CREATE INDEX "work_experience_technologies_technologyId_idx" ON "work_experience_technologies"("technologyId");

-- CreateIndex
CREATE INDEX "work_experiences_userId_idx" ON "work_experiences"("userId");

-- CreateIndex
CREATE INDEX "work_experiences_userId_startYear_idx" ON "work_experiences"("userId", "startYear");

-- AddForeignKey
ALTER TABLE "certification_technologies" ADD CONSTRAINT "certification_technologies_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "certifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification_technologies" ADD CONSTRAINT "certification_technologies_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_technologies" ADD CONSTRAINT "course_technologies_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_technologies" ADD CONSTRAINT "course_technologies_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_technologies" ADD CONSTRAINT "education_technologies_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "education"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_technologies" ADD CONSTRAINT "education_technologies_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_cvs" ADD CONSTRAINT "generated_cvs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_cvs" ADD CONSTRAINT "generated_cvs_jobOfferId_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_cvs" ADD CONSTRAINT "generated_cvs_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_motivation_letters" ADD CONSTRAINT "generated_motivation_letters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_motivation_letters" ADD CONSTRAINT "generated_motivation_letters_jobOfferId_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_motivation_letters" ADD CONSTRAINT "generated_motivation_letters_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_offers" ADD CONSTRAINT "job_offers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "language_skills" ADD CONSTRAINT "language_skills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "language_skills" ADD CONSTRAINT "language_skills_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_social_links" ADD CONSTRAINT "user_social_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_technologies" ADD CONSTRAINT "user_technologies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_technologies" ADD CONSTRAINT "user_technologies_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experience_technologies" ADD CONSTRAINT "work_experience_technologies_workExperienceId_fkey" FOREIGN KEY ("workExperienceId") REFERENCES "work_experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experience_technologies" ADD CONSTRAINT "work_experience_technologies_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experiences" ADD CONSTRAINT "work_experiences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
