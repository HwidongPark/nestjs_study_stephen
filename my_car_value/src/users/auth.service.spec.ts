import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { UsersService } from "./users.service"
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from '@nestjs/common';



describe("AuthService Test 설명 쓸 수 있음", () => {

  let service: AuthService;
  let fakeUsersService: Partial<UsersService>
  
  beforeEach(async () => {
    // Create a fake copy of the users service
    fakeUsersService = {
      find: (email: string) => Promise.resolve([]),
      create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User),
    }
    
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,

        }
      ]
    }).compile();

    service = module.get(AuthService);
  });

  // ### Mock 의존성 사용하는 Service 인스턴스를 잘 만들었는지 테스트
  it('can create an instance of auth service', async () => {

    expect(service).toBeDefined();
  });

  // ### 비밀번호 해싱되는지 여부 테스트
  it('create a new user with a salted and hased password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    console.log(`user = `, user);

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split(".");
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();


  });



  // ### 이미 존재하는 계정인 경우 예외 던지는지 여부 테스트
  it('throws an error if user signs up with email that is in use', async () => {
    
    // 참고: 어차피 beforeEach가 발동해서 다음 test에선 원래 정의한 fakeUsersService정보 그대로 유지됨
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);  // 이미 유저 존재한다고 가정


    // 예외 테스트는 아래와 같이 하면됨
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });


  // ### 유효하지 않은 이메일로 로그인 시도 테스트
  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdfavw@aslkasd.com', 'avwewlrjk')
    ).rejects.toThrow(
      NotFoundException
    )
  });


  // ### 유효하지 않은 비밀번호로 로그인 시도 테스트
  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () => Promise.resolve([
      {
        email: 'asdf@asdf.com',
        password: 'awvaewv'
      } as User
    ]);

    await expect(
      service.signin('avalsijefl@lijlesf.com', 'password')
    ).rejects.toThrow(BadRequestException);
  })


});