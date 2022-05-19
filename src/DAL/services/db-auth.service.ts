import {ForbiddenException, Injectable} from "@nestjs/common";
import {DatabaseConnectionService} from "../db-connection/database-connection";
import {UserModel} from "../models/user.model";

interface User {
    email: string;
    password: string;
}

@Injectable()
export class DbAuthService {
    async getUserByEmail(email: string): Promise<UserModel> {
        try {
            const response = await DatabaseConnectionService.executeQuery({
                name: "get user",
                text: "SELECT * FROM users WHERE email = $1",
                values: [email]
            });
            return response.rows[0];
        } catch (err) {
            throw new ForbiddenException(err.message);
        }
    }

    async getUserById(id: number): Promise<UserModel> {
        try {
            const response = await DatabaseConnectionService.executeQuery({
                name: "get user by id",
                text: "SELECT * FROM users WHERE id = $1",
                values: [id]
            });
            return response.rows[0];
        } catch (err) {
            throw new ForbiddenException(err.message);
        }
    }

    async createUser(user: User): Promise<boolean> {
        const today = new Date();
        const date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`;

        try {
            const response = await DatabaseConnectionService.executeQuery({
                name: "create user",
                text: "INSERT INTO users (email, password, firstname, lastname, createdat, updatedat) " +
                    "values ($1, $2, $3, $4, $5, $6)",
                values: [user.email, user.password, "", "", date, date]
            });
            return true;
        } catch (err) {
            throw new ForbiddenException(err.message);
        }
    }
}