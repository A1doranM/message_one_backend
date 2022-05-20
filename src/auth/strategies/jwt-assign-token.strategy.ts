import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {DbAuthService} from "../../DAL/services/db-auth.service";

@Injectable()
export class JwtAssignTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private config: ConfigService,
                private db: DbAuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_ASSIGN_TOKEN_SECRET")
        });
    }

    async validate(payload: any) {
        return payload;
    }
}