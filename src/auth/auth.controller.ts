import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-users.dto';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-guard';
import { Enable2FAType } from './types';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) {}

    @Post('signup')
    @ApiOperation({ summary: "Register new user" })
    @ApiResponse({
        status: 201,
        description: "This api will return user detail in the response",
    })
    signup(@Body() userDTO: CreateUserDto): Promise<User> {
        return this.userService.create(userDTO);
    }

    @Post('login')
    login(@Body() loginDTO: LoginDTO){
        return this.authService.login(loginDTO)
    }

    @Get('enable-2fa')
    @UseGuards(JwtAuthGuard)
    enable2fa(
        @Request()
        request
    ): Promise<Enable2FAType> {
        return this.authService.enable2FA(request.user.userId);
    }

    @Post('validate-2fa')
    @UseGuards(JwtAuthGuard)
    vaildate2FA(
        @Request() req,
        @Body() validateTokenDto: ValidateTokenDTO
    ): Promise<{ verified: boolean}> {
        return this.authService.validate2FAToken(
            req.user.userId,
            validateTokenDto.token
        )
    }

    @Get('disable-2fa')
    @UseGuards(JwtAuthGuard)
    disable2FA(
        @Request() req,
    ): Promise<UpdateResult> {
        return this.authService.disable2FA(req.user.userId);
    }

    @Get('profile')
    @UseGuards(AuthGuard('bearer'))
    getProfile(@Request() req) {
        delete req.user.password;
        return {
            msg: 'autheticated with api key',
            user: req.user
        };
    }

}
