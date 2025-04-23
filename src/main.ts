import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { ResponseInterceptor } from './commons/response';
import { AllExceptionFilter } from './commons/filters/all-exception.filter';

const setupSwagger = (app: NestFastifyApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Nest Int API')
    .setDescription('Nest Int')
    .setVersion(process.env.npm_package_version as string)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useLogger(new ConsoleLogger());
  await app.register(helmet);
  app.enableCors();
  setupSwagger(app);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
