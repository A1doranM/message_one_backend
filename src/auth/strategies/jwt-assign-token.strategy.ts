import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class JwtAssignTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_REFRESH_TOKEN_SECRET")
        });
    }

    async validate(payload: any) {
        return payload;
    }
}