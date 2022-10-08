import {Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Post, UseGuards} from '@nestjs/common';
import {AuthRepository} from "./auth.repository";
import {UserEntity} from "./schemas/user.schema";
import {UserDto} from "./dto/user.dto";
import {ApiResponse} from "@nestjs/swagger";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import {getIdType, IdType} from "./schemas/id.type";
import {UserInfo} from "./dto/user.info";
import {JwtAuthGuard} from "./jwt.auth.guard";
import {TokenEntity} from "./schemas/token.schema";
import {ResponseDto} from "./dto/response.dto";

const ping = require('ping');

@Controller('api')
export class AuthController {
    constructor(private readonly authRepository: AuthRepository,
                private readonly _jwtService: JwtService) {}

    @Post('sign-in/')
    public async signIn(@Body() loginUserDto: UserDto) {
        const user = await this.authRepository.getUser({ _id: loginUserDto.id })

        if (!user) {
            throw new HttpException('The user with this login is not registered', HttpStatus.BAD_REQUEST)
        }

        const passwordEquals = await bcrypt.compare(loginUserDto.password, user.password)

        if (!passwordEquals) {
            throw new HttpException('Login or password error', HttpStatus.BAD_REQUEST)
        }

        return await this.extendToken(user._id, user.idType)
    }

    @ApiResponse({status: 200, type: UserEntity})
    @Post('sign-up')
    public async signUp(@Body() createUserDto: UserDto) {
        const idType = getIdType(createUserDto.id)

        if (idType == null) {
            throw new HttpException('Email or phone number validation error', HttpStatus.BAD_REQUEST)
        }

        const registered = await this.authRepository.getUser({ _id: createUserDto.id })

        if (registered) {
            throw new HttpException('Email or phone number is used', HttpStatus.BAD_REQUEST)
        }

        const hashPassword = await bcrypt.hash(createUserDto.password, 8)
        const userEntity = new UserEntity(createUserDto.id, hashPassword, idType)
        const user = await this.authRepository.createUser(userEntity)

        return await this.extendToken(user._id, user.idType)
    }

    @ApiResponse({status: 200, type: ResponseDto })
    @UseGuards(JwtAuthGuard)
    @Get('info')
    public async getInfo(@Headers() headers): Promise<ResponseDto> {
        const token = this.getJwtToken(headers.authorization)
        const userId = token['id']
        const idType = token['idType']
        const tokenString = await this.extendToken(userId, idType)

        return new ResponseDto(new UserInfo(userId, idType), tokenString)
    }

    @ApiResponse({ status: 200, type: ResponseDto })
    @UseGuards(JwtAuthGuard)
    @Get('latency')
    public async getLatency(@Headers() headers): Promise<ResponseDto> {
        const token = this.getJwtToken(headers.authorization)
        const userId = token['id']
        const idType = token['idType']
        const tokenString = await this.extendToken(userId, idType)
        const host = 'google.com'

        try {
            const result = await ping.promise.probe(host)
            return new ResponseDto(result.time + ' ms', tokenString)
        }
        catch (e) {
            throw new HttpException('google.com is not available', HttpStatus.OK)
        }
    }

    @ApiResponse({status: 200, type: String})
    @Get('logout:all')
    @UseGuards(JwtAuthGuard)
    public async logout(@Headers() headers, @Param('all') all: boolean) {
        console.log(all)
        if (all) {
            const token = this.getJwtToken(headers.authorization)
            const userId = token['id']
            const tokens = await this.authRepository.getTokens({ user: userId })

            for (const tokenEntity of tokens) {
                await this.authRepository.deleteToken(tokenEntity)
            }

            return
        }

        const tokenEntity = await this.authRepository.getToken({ token: headers.authorization })
        await this.authRepository.deleteToken(tokenEntity)
    }

    private async extendToken(userId: string, idType: IdType) {
        const token = this.createJwtToken(userId, idType)
        const tokenEntity = new TokenEntity(userId, token.token)
        await this.authRepository.saveToken(tokenEntity)

        return token.token
    }

    private createJwtToken(userId: string, idType: IdType) {
        const payload = {id: userId, idType: idType}

        return {
            token: this._jwtService.sign(payload)
        }
    }

    private getJwtToken(headersAuthorization: string) {
        const token = headersAuthorization.split(' ')[1]

        return this._jwtService.decode(token)
    }
}
