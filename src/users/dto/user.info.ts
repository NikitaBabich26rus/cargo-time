import {ApiProperty} from "@nestjs/swagger";
import {IdType} from "../schemas/id.type";

export class UserInfo {

    constructor(id: string, idType: IdType) {
        this.id = id
        this.idType = idType
    }

    @ApiProperty({ example: 'user@gmail.com' })
    id: string

    @ApiProperty({ example: IdType.Email })
    idType: IdType
}