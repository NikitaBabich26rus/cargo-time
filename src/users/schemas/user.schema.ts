import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ApiProperty} from "@nestjs/swagger";
import {IdType} from "./id.type";
import * as mongoose from "mongoose";

export type UserDocument = UserEntity & Document

@Schema()
export class UserEntity {

    constructor(id: string, password: string, idType: IdType) {
        this._id = id
        this.password = password
        this.idType = idType
    }

    @ApiProperty({ example: 'user@gmail.com' })
    @Prop({ unique: true, type: String})
    _id: string;

    @ApiProperty({ example: '123456789' })
    @Prop({ required: true })
    password: string;

    @ApiProperty({ example: IdType.Email })
    @Prop({ required: true })
    idType: IdType;
}
export const UserSchema = SchemaFactory.createForClass(UserEntity)