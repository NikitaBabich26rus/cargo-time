import {Body, Controller, Get, HttpException, HttpStatus, Post} from '@nestjs/common';
import {UsersRepository} from "./users.repository";
import {UserEntity} from "./schemas/user.schema";
import {UserDto} from "./dto/user.dto";
import {ApiResponse} from "@nestjs/swagger";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import {getIdType} from "./schemas/id.type";

@Controller('api/')
export class AuthController {
  constructor(private readonly _userRepository: UsersRepository,
              private readonly _jwtService: JwtService) {}

  @Get('hello')
  getHello(): string {
    return "Hello"
  }

  @Post('sign-in/')
  async signIn(@Body() loginUserDto: UserDto) {
    const user = await this._userRepository.getUser({ id: loginUserDto.id })

    if (!user){
      throw new HttpException('The user with this login is not registered', HttpStatus.BAD_REQUEST)
    }

    const passwordEquals = await bcrypt.compare(loginUserDto.password, user.password)

    if (!passwordEquals){
      throw new HttpException('Login or password error', HttpStatus.BAD_REQUEST)
    }

    return this.getJwtToken(user)
  }

  @ApiResponse({ status: 200, type: UserEntity })
  @Post('sign-up')
  async signUp(@Body() createUserDto: UserDto) {
    const idType = getIdType(createUserDto.id)

    if (idType == null){
      throw new HttpException('Email or phone number validation error', HttpStatus.BAD_REQUEST)
    }

    const registered = await this._userRepository.getUser({ id: createUserDto.id })

    if (registered){
      throw new HttpException('Email or phone number is used', HttpStatus.BAD_REQUEST)
    }

    const hashPassword =  await bcrypt.hash(createUserDto.password, 8)
    const userEntity = new UserEntity(createUserDto.id, hashPassword, idType)
    const user =  await this._userRepository.createUser(userEntity)

    return this.getJwtToken(user)
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

  private getJwtToken(user: UserEntity): object {
    const payload = { id: user.id, idType: user.idType }

    return {
      token: this._jwtService.sign(payload)
    }
  }

}
