import {Body, Controller, Get, Post} from '@nestjs/common';
import {UsersRepository} from "./users.repository";
import {UserEntity} from "./schemas/user.schema";
import {CreateUserDto} from "./dto/createUserDto";
import {ApiResponse} from "@nestjs/swagger";

@Controller('api/')
export class AuthController {
  constructor(private readonly _userRepository: UsersRepository) {}

  @Get('hello')
  getHello(): string {
    return "Hello"
  }

  @Get('sign-in/')
  signIn(): string {
    return "Hello"
  }

  @ApiResponse({ status: 200, type: UserEntity })
  @Post('sign-up')
  async signUp(@Body() user: CreateUserDto): Promise<UserEntity> {
    const userEntity = new UserEntity(user.email, user.password)
    return await this._userRepository.createUser(userEntity)
  }

  @ApiResponse({ status: 200, type: [UserEntity] })
  @Get('info')
  async getInfo(): Promise<UserEntity[]> {
    return await this._userRepository.getUsers()
  }

  @Get('latency')
  getLatency(): string {
    return "Hello"
  }

  @Get('logout')
  logout(): string {
    return "Hello"
  }
}
