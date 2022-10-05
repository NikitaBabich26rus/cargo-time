import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function startServer() {
  const port = process.env.PORT || 5000
  const app = await NestFactory.create(AppModule)
  app.enableCors()

  const options = new DocumentBuilder()
      .setTitle('cargo-time')
      .setDescription('api')
      .setVersion('1.0.0')
      .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  await app.listen(port, () => console.log(`Server started on PORT = ${port}`))
}

startServer();
