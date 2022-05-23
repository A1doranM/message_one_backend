import {Body, Controller, Post} from "@nestjs/common";
import {AuthService} from "../services/auth.service";
import {AuthDto} from "../dto/auth.dto";

@Controller("auth")
export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    @Post("/local/signup")
    signupLocal(@Body() dto: AuthDto) {
        return this.authService.signupLocal(dto)
            .then(result => {
                return result;
            })
            .catch(err => {
                return err;
            })
    }

    @Post("/local/signin")
    signinLocal(@Body() dto: AuthDto) {
        return this.authService.signinLocal(dto);
    }

    @Post("/logout")
    logout() {
        this.authService.logout();
    }

    @Post("/refresh")
    refreshToken() {
        this.authService.refreshToken();
    }
}