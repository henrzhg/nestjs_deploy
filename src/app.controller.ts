import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/jwt-guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
// @ApiBearerAuth('JWT-auth') // can be placed here to set authorization on this route
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  getProfile(
    @Req()
    request
  ) {
    return request.user
  }
}
