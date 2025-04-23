import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { configuration, getDataSourceOptions } from './config';
import { TransactionsRemoteModule } from './modules/transactions-remote/transactions.module';
import { TransactionsLocalModule } from './modules/transactions-local/transactions-local.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: __dirname + '/../.env',
      load: [configuration.config],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
          ...getDataSourceOptions(configService),
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    TransactionsRemoteModule,
    TransactionsLocalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
