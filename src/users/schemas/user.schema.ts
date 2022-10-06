import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ApiProperty} from "@nestjs/swagger";
import {IdType} from "./id.type";

export type UserDocument = UserEntity & Document

@Schema()
export class UserEntity {

    constructor(id: string, password: string, idType: IdType) {
        this.id = id
        this.password = password
        this.idType = idType
    }

    @ApiProperty({ example: 'user@gmail.com' })
    @Prop({unique: true})
    id: string;

    @ApiProperty({ example: '123456789' })
    @Prop()
    password: string;

    @ApiProperty({ example: IdType.Email })
    @Prop()
    idType: IdType;
}
export const UserSchema = SchemaFactory.createForClass(UserEntity)