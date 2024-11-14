import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { Enable2FAType, PayloadType } from './types';
import * as speakeasy from 'speakeasy'
import { UpdateResult } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
      private userService: UsersService,
      private artistService: ArtistsService,
      private jwtService: JwtService,
      private cfgService: ConfigService,
    ) {}

    async login(loginDTO: LoginDTO): Promise<{ accessToken: string } | { validate2FA: string; message: string;} > {
      const user = await this.userService.findOne(loginDTO); // 1.
  
      const passwordMatched = await bcrypt.compare(
        loginDTO.password,
        user.password,
      ); // 2.
  
      if (passwordMatched) {
        //3
        // delete user.password; // 4.
        const payload: PayloadType = {
          email: user.email,
          userId: user.id
        }
        const artist = await this.artistService.findArtist(user.id)
        if (artist) {
          payload.artistId = artist.id
        }

        if (user.enable2FA && user.twoFASecret) {
          return {
            validate2FA: "http://localhost:3000/auth/validate2-fa",
            message: "Please sends the 2FA password/token"
          };
        }

        const jwt = {
          accessToken: this.jwtService.sign(payload)
        }

        return jwt
      } else {
        throw new UnauthorizedException('Password does not match'); // 5.
      }
    }

    async enable2FA(userId: number): Promise<Enable2FAType> {
      const user = await this.userService.findById(userId);
      if (user.enable2FA) {
        return { secret: user.twoFASecret }
      }

      const secret = speakeasy.generateSecret();
      console.log(secret)

      user.twoFASecret = secret.base32
      await this.userService.updateSecretKey(user.id, user.twoFASecret)
      return { secret: user.twoFASecret }
    }

    async validate2FAToken(userId: number, token: string): Promise<{ verified: boolean }> {
      try {
        const user = await this.userService.findById(userId);

        const verified = speakeasy.totp.verify({
          secret: user.twoFASecret,
          token: token,
          encoding: 'base32'
        })

        return { verified: verified }
      } catch (e) {
        throw new UnauthorizedException("Error verifying token");
      }
    }

    async disable2FA(userId: number): Promise<UpdateResult> {
      return this.userService.disable2FA(userId);
    }

    async validateUserByApiKey(apiKey: string): Promise<User> {
      return this.userService.findByApiKey(apiKey)
    }

    getEnvVariable() {
      return this.cfgService.get<number>('port');
    }
}
