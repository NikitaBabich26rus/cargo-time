import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {UserEntity, UserSchema} from "./schemas/user.schema";
import {UsersRepository} from "./users.repository";
import {AuthController} from "./auth.controller";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
        JwtModule.register({
            secret: `${process.env.SECRET}`,
            signOptions: {
                expiresIn: '10m',
            }
        })
    ],
    controllers: [AuthController],
    providers: [UsersRepository],
})

export class UsersModule {}