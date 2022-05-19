import {Module} from '@nestjs/common';
import {DatabaseModule} from "./DAL/database.module";

@Module({
    imports: [DatabaseModule]
})
export class AppModule {
}
