import {Module} from '@nestjs/common';
import {DatabaseModule} from "./DAL/database.module";
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "./auth/auth.module";
import {APP_GUARD} from "@nestjs/core";
import {AtGuards} from "./auth/guards/at.guards";

@Module({
    imports: [
        AuthModule,
        DatabaseModule,
        ConfigModule.forRoot({
            isGlobal: true
        })
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AtGuards,
        }
    ]
})
export class AppModule {
}
