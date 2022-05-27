import {ForbiddenException, Injectable} from "@nestjs/common";
import {DatabaseConnectionService} from "../db-connection/database-connection";
import {UserModel} from "../models/user.model";

@Injectable()
export class DbAuthService {
    async createUser(user: {
        email: string,
        hash: string
    }): Promise<UserModel> {
        const today = new Date();
        const date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`;

        try {
            const response = await DatabaseConnectionService.executeQuery({
                name: "create user",
                text: "INSERT INTO users (email, hash, created_at, updated_at) " +
                    "values ($1, $2, $3, $4) RETURNING *",
                values: [user.email, user.hash, date, date]
            });
            return response.rows[0];
        } catch (err) {
            throw new Error(err.detail);
        }
    }

    async updateRefreshToken(userId: number, hashedToken: string): Promise<UserModel> {
        try {
            const response = await DatabaseConnectionService.executeQuery({
                name: "update refresh token by userId",
                text: "UPDATE users SET hashed_refresh_token = $2 WHERE users.id = $1 RETURNING *",
                values: [userId, hashedToken]
            });
            return response.rows[0];
        } catch (err) {
            throw new ForbiddenException(err.message);
        }
    }

    async removeRefreshToken(userId: number): Promise<boolean> {
        try {
            const response = await DatabaseConnectionService.executeQuery({
                name: "remove refresh token by userId",
                text: "UPDATE users SET hashed_refresh_token = $2 WHERE users.id = $1 RETURNING *",
                values: [userId, null]
            });
            return response.rows[0];
        } catch (err) {
            throw new ForbiddenException(err.message);
        }
    }
}