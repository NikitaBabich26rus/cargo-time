import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model, FilterQuery} from 'mongoose';
import {UserEntity, UserDocument} from "./schemas/user.schema";
import {TokenEntity, TokenDocument} from "./schemas/token.schema";

@Injectable()
export class AuthRepository {
    constructor(@InjectModel(UserEntity.name) private userModel: Model<UserDocument>,
                @InjectModel(TokenEntity.name) private tokenModel: Model<TokenDocument>) {}

    async getUser(userFilterQuery: FilterQuery<UserEntity>): Promise<UserEntity> {
        return this.userModel.findOne(userFilterQuery)
    }

    async saveToken(newToken: TokenEntity): Promise<TokenEntity> {
        const token = new this.tokenModel(newToken)
        return token.save()
    }

    async deleteTokens(tokenFilterQuery: FilterQuery<TokenEntity>) {
        this.tokenModel.deleteMany(tokenFilterQuery)
    }

    async deleteToken(token: TokenEntity) {
        this.tokenModel.deleteOne(token)
    }

    async getToken(tokenFilterQuery: FilterQuery<TokenEntity>): Promise<TokenEntity> {
        return this.tokenModel.findOne(tokenFilterQuery)
    }

    async createUser(newUser: UserEntity): Promise<UserEntity> {
        const user = new this.userModel(newUser)
        return user.save()
    }
}