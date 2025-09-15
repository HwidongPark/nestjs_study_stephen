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

});
