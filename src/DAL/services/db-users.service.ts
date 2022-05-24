import {ForbiddenException, Injectable} from "@nestjs/common";
import {DatabaseConnectionService} from "../db-connection/database-connection";
import {UserModel} from "../models/user.model";

@Injectable()
export class DbUsersService {
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
}