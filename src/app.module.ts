import {Module} from '@nestjs/common';
import {DatabaseModule} from "./DAL/database.module";
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "./auth/auth.module";

@Module({
    imports: [
        AuthModule,
        DatabaseModule,
        ConfigModule.forRoot({
            isGlobal: true
        })
    ]
})
export class AppModule {
}
