import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import cookieSession from 'cookie-session';
import { ConfigModule, ConfigService } from '@nestjs/config';
// config module은 dev, beta, release 중 어떤 .env파일 읽을지 정함
//-> 어떤 .env 파일을 읽을지는 forRoot() 옵션에 따라 달라짐.
// config service는 ConfigModule이 읽어들인 환경변수들을 애플리케이션 내부에서 가져다 쓰도록 제공하는 서비스.

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],  // TypeOrmModule에서도 환경변수 접근가능하도록
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>("DB_NAME"),
          entities: [
            User,
            Report,
          ],
          synchronize: true,
        }
      }
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [
    //     User,
    //     Report,
    //   ],
    //   synchronize: true,
    // }),
    UsersModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      })
    }
  ],
})
export class AppModule implements NestModule {
  
  // ### configure메서드는 app이 시작하면 저절로 실행됨
  configure(consumer: MiddlewareConsumer) {
    
    // 여기서 모든 incoming request에 대해 작동하는 middleware작성 가능
    consumer
      .apply(
        cookieSession({
          // 비밀키
          keys: ['secretKey'],
        })
      )
      .forRoutes('*');
  }

}
