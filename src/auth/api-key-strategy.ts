import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-http-bearer";
import { AuthService } from "./auth.service";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService){
        super();
    }

    async validate(apiKey: string) {
        console.log("apikey-strategy : ", apiKey)
        const user = await this.authService.validateUserByApiKey(apiKey)
        if(!user) {
            throw new UnauthorizedException();
        }
        return user
    }
}