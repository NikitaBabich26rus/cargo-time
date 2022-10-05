import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({ example: 'user@gmail.com' })
    email: string

    @ApiProperty({ example: '123456789' })
    password: string
}