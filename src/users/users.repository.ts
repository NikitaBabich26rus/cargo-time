import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model, FilterQuery} from 'mongoose';
import {UserEntity, UserDocument} from "./schemas/user.schema";

@Injectable()
export class UsersRepository{
    constructor(@InjectModel(UserEntity.name) private userModel: Model<UserDocument>) {}

    async getUser(userFilterQuery: FilterQuery<UserEntity>): Promise<UserEntity> {
        return this.userModel.findOne(userFilterQuery);
    }

    async getUsers(): Promise<UserEntity[]> {
        return this.userModel.find()
    }

    async createUser(newUser: UserEntity): Promise<UserEntity> {
        const user = new this.userModel(newUser)
        return user.save()
    }
}