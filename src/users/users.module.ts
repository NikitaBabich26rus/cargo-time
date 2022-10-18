import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {UserEntity, UserSchema} from "./schemas/user.schema";
import {AuthRepository} from "./auth.repository";
import {AuthController} from "./auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {TokenEntity, TokenSchema} from "./schemas/token.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: TokenEntity.name, schema: TokenSchema }]),
        JwtModule.register({
            secret: `${process.env.SECRET}`,
            signOptions: {
                expiresIn: '10m',
            }
        })
    ],
    controllers: [AuthController],
    providers: [AuthRepository],
})

export class UsersModule {}