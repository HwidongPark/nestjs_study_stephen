import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';


// Integration Test (End to End Test)
describe('Authentication System', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });


  // ### 회원가입 테스트
  it('handles a signup request', () => {
    const emailToSignup = 'integrationTests23@asdflkasdf.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: emailToSignup,
        password: 'asdf'
      })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        
        expect(id).toBeDefined;
        expect(email).toEqual(emailToSignup);

      })
  });


  // ### 회원가입 후 받은 Set-Cookie를 다시 서버에 요청해서 cookie에 저장돼 있는 세션정보 검증
  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'asdf@asdf.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asdf' })
      .expect(201);
    
    // ## 응답 헤더의 Set-Cookie가져오기
    const cookie = res.get('Set-Cookie') as unknown as string;
    
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });

});
