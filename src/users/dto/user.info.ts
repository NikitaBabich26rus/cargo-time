import {ApiProperty} from "@nestjs/swagger";
import {IdType} from "../schemas/id.type";

export class UserInfo {

    @ApiProperty({ example: 'user@gmail.com' })
    id: string

    @ApiProperty({ example: IdType.Email })
    idType: IdType
}