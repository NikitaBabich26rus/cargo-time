import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {UserEntity, UserSchema} from "./schemas/user.schema";
import {UsersRepository} from "./users.repository";
import {AuthController} from "./authController";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
    ],
    controllers: [AuthController],
    providers: [UsersRepository],
    exports: [UsersRepository],
})

export class UsersModule {}