import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {ForbiddenException, Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {Request} from "express";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_REFRESH_TOKEN_SECRET"),
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: any) {
        const refreshToken = req?.get("authorization")?.replace("Bearer", "").trim();
        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
        return {
            ...payload,
            refreshToken
        };
    }
}