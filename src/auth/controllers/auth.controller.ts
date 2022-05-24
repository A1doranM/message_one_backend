import {Body, Controller, Post, Req, UseGuards} from "@nestjs/common";
import {AuthService} from "../services/auth.service";
import {AuthDto} from "../dto/auth.dto";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {GetUser} from "../decorators/get-user.decorator";

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
       return this.authService.signinLocal(dto)
            .then(result => {
                return result;
            })
            .catch(err => {
                return err;
            });
    }

    @UseGuards(AuthGuard("jwt"))
    @Post("/logout")
    logout(@GetUser("id") userId: number) {
        console.log(userId)
        this.authService.logout(userId);
    }

    @UseGuards(AuthGuard("jwt-refresh"))
    @Post("/refresh")
    refreshToken() {
        this.authService.refreshToken();
    }
}