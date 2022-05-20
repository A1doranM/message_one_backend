import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {DbAuthService} from "../../DAL/services/db-auth.service";
import {Request} from "express";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(private config: ConfigService,
                private db: DbAuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_ASSIGN_TOKEN_SECRET"),
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: any) {
        const refreshToken = req.get("authorization").replace("Bearer", " ").trim();
        return {
            ...payload,
            refreshToken
        };
    }
}