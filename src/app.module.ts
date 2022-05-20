import {Module} from '@nestjs/common';
import {DatabaseModule} from "./DAL/database.module";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot({
            isGlobal: true
        })
    ]
})
export class AppModule {
}
