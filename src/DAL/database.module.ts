import {Global, Module} from "@nestjs/common";
import {DbAuthService} from "./services/db-auth.service";
import {DbUsersService} from "./services/db-users.service";

@Global()
@Module({
    providers: [DbAuthService, DbUsersService],
    exports: [DbAuthService, DbUsersService],
})
export class DatabaseModule {
}