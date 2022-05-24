import {Injectable} from "@nestjs/common";
import {DbAuthService} from "../../DAL/services/db-auth.service";
import {AuthDto} from "../dto/auth.dto";
import {randomBytes, scrypt} from "node:crypto";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {Tokens} from "../types/tokens.type";
import {DbUsersService} from "../../DAL/services/db-users.service";

@Injectable()
export class AuthService {
    private dbauth: DbAuthService;
    private dbusers: DbUsersService;
    private jwt: JwtService;
    private config: ConfigService;

    constructor(
        dbAuthService: DbAuthService,
        dbUsersService: DbUsersService,
        jwt: JwtService,
        config: ConfigService,
    ) {
        this.dbauth = dbAuthService;
        this.dbusers = dbUsersService;
        this.jwt = jwt;
        this.config = config;
    }

    private async hash(password): Promise<string> {
        return new Promise((resolve, reject) => {
            const salt = randomBytes(16).toString("hex")

            scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) reject(err);
                resolve(salt + ":" + derivedKey.toString("hex"));
            });
        })
    }

    private async verify(password, hash): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const [salt, key] = hash.split(":")
            scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) reject(err);
                resolve(key == derivedKey.toString("hex"));
            });
        })
    }

    private async signToken(userId: number, email: string): Promise<string> {
        const data = {
            sub: userId,
            email: email,
        }

        return this.jwt.signAsync(data, {
            expiresIn: "15m",
            secret: this.config.get("JWT_ASSIGN_TOKEN_SECRET")
        });
    }

    private async getTokens(userId: number, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync({
                    sub: userId,
                    email,
                },
                {
                    secret: this.config.get("JWT_ASSIGN_TOKEN_SECRET"),
                    expiresIn: 60 * 15
                }),
            this.jwt.signAsync({
                    sub: userId,
                    email,
                },
                {
                    secret: this.config.get("JWT_REFRESH_TOKEN_SECRET"),
                    expiresIn: 60 * 60 * 24 * 7
                })
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        }
    }

    private async updateRefreshTokenHash(userId: number, refreshToken: string) {
        const hash = await this.hash(refreshToken);
        await this.dbauth.updateRefreshToken(userId, hash);
    }

    async signupLocal(dto: AuthDto): Promise<Tokens | Error> {
        try {
            const hashedPass = await this.hash(dto.password);
            const newUser = await this.dbauth.createUser({
                email: dto.email,
                hash: hashedPass.toString()
            });
            const tokens = await this.getTokens(newUser.id, newUser.email)
            await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);
            return tokens;
        } catch (err) {
            return Promise.reject("Error when trying to signupLocal: " + err);
        }
    }

    async signinLocal(dto: AuthDto): Promise<Tokens | Error> {
        try {
            const user = await this.dbusers.getUserByEmail(dto.email);
            if (user && await this.verify(dto.password, user.hash)) {
                const tokens = await this.getTokens(user.id, user.email);
                return tokens;
            } else {
                return Promise.reject("Incorrect name or pass");
            }
        } catch (err) {
            return Promise.reject("Error when trying to signupLocal: " + err);
        }
    }

    async logout(userId: number) {
        try {
            return await this.dbauth.removeRefreshToken(userId);
        } catch (err) {
            return Promise.reject("Error when trying to logout");
        }
    }

    async refreshToken(userId: number) {
        try {
            return await this.dbauth.removeRefreshToken(userId);
        } catch (err) {
            return Promise.reject("Error when trying to logout");
        }
    }
}