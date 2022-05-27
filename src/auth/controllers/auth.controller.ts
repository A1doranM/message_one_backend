import {Body, Controller, Post, Req, UseGuards} from "@nestjs/common";
import {AuthService} from "../services/auth.service";
import {AuthDto} from "../dto/auth.dto";
import {GetUser} from "../decorators/get-user.decorator";
import { AtGuards } from "../guards/at.guards";
import { RtGuards } from "../guards/rt.guards";
import {Public} from "../decorators/public.decorator";

@Controller("auth")
export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    @Public()
    @Post("local/signup")
    signupLocal(@Body() dto: AuthDto) {
        return this.authService.signUpLocal(dto)
            .then(result => {
                return result;
            })
            .catch(err => {
                return err;
            })
    }

    @Public()
    @Post("local/signin")
    signinLocal(@Body() dto: AuthDto) {
       return this.authService.signInLocal(dto)
            .then(result => {
                return result;
            })
            .catch(err => {
                return err;
            });
    }

    @UseGuards(AtGuards)
    @Post("logout")
    logout(@GetUser("sub") userId: number) {
        return this.authService.logout(userId);
    }

    @Public()
    @UseGuards(RtGuards)
    @Post("refresh")
    async refreshToken(@GetUser() user: any) {
        return await this.authService.refreshTokens(user["sub"], user["refreshToken"]);
    }
}