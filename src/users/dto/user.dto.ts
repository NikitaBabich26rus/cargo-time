import {ApiProperty} from "@nestjs/swagger";

export class UserDto {

    @ApiProperty({ example: 'user@gmail.com' })
    id: string

    @ApiProperty({ example: '123456789' })
    password: string
}