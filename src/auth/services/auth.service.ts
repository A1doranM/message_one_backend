import {Injectable} from "@nestjs/common";
import {DbAuthService} from "../../DAL/services/db-auth.service";
import {AuthDto} from "../dto/auth.dto";
import {randomBytes, scrypt} from "node:crypto";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    private db: DbAuthService;
    private jwt: JwtService;
    private config: ConfigService;

    constructor(
        dbService: DbAuthService,
        jwt: JwtService,
        config: ConfigService,
    ) {
        this.db = dbService;
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
            secret: this.config.get("JWT_SECRET")
        });
    }

    async signupLocal(dto: AuthDto) {
        try {
            const hashedPass = await this.hash(dto.password);
            return this.db.createUser({
                email: dto.email,
                password: hashedPass.toString()
            });
        } catch (err) {
            return false;
        }
    }

    async signinLocal(dto: AuthDto) {
        try {
            const user = await this.db.getUserByEmail(dto.email);
            if (user && await this.verify(dto.password, user.hash)) {
                const token = await this.signToken(user.id, user.email);
                const payload = {
                    access_token: token
                }

                return payload;
            } else {
                return "<h1>Incorrect name or pass</h1>"
            }
        } catch (err) {
            return "<h1>Something went wrong in signIn</h1>";
        }
    }

    async logout() {

    }

    async refreshToken() {

    }
}