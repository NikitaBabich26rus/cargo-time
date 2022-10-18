import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {UsersModule} from "./users/users.module";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: `.${process.env.NODE_ENV}.env`
      }),
      MongooseModule.forRoot(process.env.DB_HOST + process.env.DB_PORT),
      UsersModule
  ],
})

export class AppModule {}
