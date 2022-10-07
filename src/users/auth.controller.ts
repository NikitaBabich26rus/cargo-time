import {Body, Controller, Get, Headers, HttpException, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {UsersRepository} from "./users.repository";
import {UserEntity} from "./schemas/user.schema";
import {UserDto} from "./dto/user.dto";
import {ApiResponse} from "@nestjs/swagger";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import {getIdType} from "./schemas/id.type";
import {UserInfo} from "./dto/user.info";
import {JwtAuthGuard} from "./jwt.auth.guard";

const ping = require('ping');

@Controller('api/')
export class AuthController {
    constructor(private readonly _userRepository: UsersRepository,
                private readonly _jwtService: JwtService) {}

    @Post('sign-in/')
    public async signIn(@Body() loginUserDto: UserDto) {
        const user = await this._userRepository.getUser({ _id: loginUserDto.id })

        if (!user) {
            throw new HttpException('The user with this login is not registered', HttpStatus.BAD_REQUEST)
        }

        const passwordEquals = await bcrypt.compare(loginUserDto.password, user.password)

        if (!passwordEquals) {
            throw new HttpException('Login or password error', HttpStatus.BAD_REQUEST)
        }

        return this.createJwtToken(user)
    }

    @ApiResponse({status: 200, type: UserEntity})
    @Post('sign-up')
    public async signUp(@Body() createUserDto: UserDto) {
        const idType = getIdType(createUserDto.id)

        if (idType == null) {
            throw new HttpException('Email or phone number validation error', HttpStatus.BAD_REQUEST)
        }

        const registered = await this._userRepository.getUser({ _id: createUserDto.id })

        if (registered) {
            throw new HttpException('Email or phone number is used', HttpStatus.BAD_REQUEST)
        }

        const hashPassword = await bcrypt.hash(createUserDto.password, 8)
        const userEntity = new UserEntity(createUserDto.id, hashPassword, idType)
        const user = await this._userRepository.createUser(userEntity)

        return this.createJwtToken(user)
    }

    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @Get('info')
    public async getInfo(@Headers() headers): Promise<UserInfo> {
        const token = this.getJwtToken(headers.authorization)

        return new UserInfo(token['id'], token['idType'])
    }

    @ApiResponse({status: 200, type: Number})
    @UseGuards(JwtAuthGuard)
    @Get('latency')
    public async getLatency(): Promise<string> {
        const host = 'google.com'

        try {
            const result = await ping.promise.probe(host)
            return result.time + ' ms'
        }
        catch (e) {
            throw new HttpException('google.com is not available', HttpStatus.OK)
        }
    }

    @Get('logout')
    @UseGuards(JwtAuthGuard)
    public logout(): string {
        return "Hello"
    }

    private createJwtToken(user: UserEntity) {
        const payload = {id: user._id, idType: user.idType}

        return {
            token: this._jwtService.sign(payload)
        }
    }

    private getJwtToken(headersAuthorization: string) {
        const token = headersAuthorization.split(' ')[1]

        return this._jwtService.decode(token)
    }
}
