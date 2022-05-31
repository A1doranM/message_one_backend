import {Module} from "@nestjs/common";
import {AuthController} from "./controllers/auth.controller";
import {AuthService} from "./services/auth.service";
import {JwtAssignTokenStrategy} from "./strategies/jwt-assign-token.strategy";
import {JwtRefreshTokenStrategy} from "./strategies/jwt-refresh-token.strategy";
import {JwtModule} from "@nestjs/jwt";
import {AtGuards} from "./guards/at.guards";
import {RtGuards} from "./guards/rt.guards";

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtAssignTokenStrategy, JwtRefreshTokenStrategy],
    exports: [AtGuards, RtGuards]
})
export class AuthModule {
}
