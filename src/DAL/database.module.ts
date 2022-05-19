import {Global, Module} from "@nestjs/common";
import {DbAuthService} from "./services/db-auth.service";

@Global()
@Module({
    providers: [DbAuthService],
    exports: [DbAuthService],
})
export class DatabaseModule {
}