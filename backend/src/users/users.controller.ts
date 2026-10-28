import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. PUBLICZNY ENDPOINT – Działa zawsze dla każdego
  @Get('public')
  test() {
    return { message: 'Ten endpoint jest publiczny i działa zawsze.' };
  }

  // 2. PRYWATNY ENDPOINT – Działa tylko po zalogowaniu (z poprawnym tokenem JWT)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Request() req: { user: { id: string } }) {
    return this.usersService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMyProfile(
    @Request() req: { user: { id: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProfile(@Request() req: { user: { id: string; email: string } }) {
    return req.user; // Zwraca zalogowanego użytkownika (zdekodowanego w JwtStrategy)
  }

  @Get('all')
  async findAll() {
    return this.usersService.findAll();
  }
}
