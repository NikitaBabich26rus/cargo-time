import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ApiProperty} from "@nestjs/swagger";

export type UserDocument = UserEntity & Document

@Schema()
export class UserEntity {

    constructor(email: string, password: string) {
        this.email = email
        this.password = password
    }

    @ApiProperty({ example: 'user@gmail.com' })
    @Prop({unique: true})
    email: string;

    @ApiProperty({ example: '123456789' })
    @Prop()
    password: string;

}
export const UserSchema = SchemaFactory.createForClass(UserEntity)