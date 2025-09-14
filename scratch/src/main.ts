import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";


// NestJS 애플리케이션을 부트스트랩하는 함수
// 서버가 시작되면, 실행되서 모듈을 활성화시키고 controllers등이 등록되도록 함
// 참고: 부트스트랩이란?
// - 프로그램을 실행할 때 제일 먼저 초기화 과정을 담당하는 것
// - 필요한 설정을 불러오고, 서버를 띄우고, 모듈을 준비하는 것
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
}

bootstrap();