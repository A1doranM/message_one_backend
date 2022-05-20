import {Module} from "@nestjs/common";
import {AuthController} from "./controllers/auth.controller";
import {AuthService} from "./services/auth.service";
import {JwtAssignTokenStrategy} from "./strategies/jwt-assign-token.strategy";
import {JwtRefreshTokenStrategy} from "./strategies/jwt-refresh-token.strategy";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtAssignTokenStrategy, JwtRefreshTokenStrategy]
})
export class AuthModule {
}