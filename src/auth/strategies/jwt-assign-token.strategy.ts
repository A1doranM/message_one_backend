import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class JwtAssignTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_ASSIGN_TOKEN_SECRET")
        });
    }

    async validate(payload: any) {
        console.log("PAYLOAD: ", payload);
        return payload;
    }
}