import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SocialLinksModule } from './social-links/social-links.module';
import { UserTechnologiesModule } from './user-technologies/user-technologies.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { LanguageSkillModule } from './language-skill/language-skill.module';
import { LanguagesModule } from './languages/languages.module';
import { WorkExperienceModule } from './work-experience/work-experience.module';
import { ProjectsModule } from './projects/projects.module';
import { EducationModule } from './education/education.module';
import { CoursesModule } from './courses/courses.module';
import { CertificationsModule } from './certifications/certifications.module';
import { JobOffersModule } from './job-offers/job-offers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    SocialLinksModule,
    UserTechnologiesModule,
    TechnologiesModule,
    LanguageSkillModule,
    LanguagesModule,
    WorkExperienceModule,
    ProjectsModule,
    EducationModule,
    CoursesModule,
    CertificationsModule,
    JobOffersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
