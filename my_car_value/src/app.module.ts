import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import cookieSession from 'cookie-session';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [
        User,
        Report,
      ],
      synchronize: true,
    }),
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
export class AppModule  implements NestModul {
  
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
