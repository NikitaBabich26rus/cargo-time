import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {UserEntity} from "./user.schema";
import * as mongoose from "mongoose";

export type TokenDocument = TokenEntity & Document

@Schema()
export class TokenEntity {

    constructor(userId: string, token: string) {
        this.user = userId
        this.token = token
    }

    @Prop({ type: String, ref: 'UserEntity', required: true })
    user: string;

    @Prop({ required: true })
    token: string;
}
export const TokenSchema = SchemaFactory.createForClass(TokenEntity)