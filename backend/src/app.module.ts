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
    TechnologiesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
