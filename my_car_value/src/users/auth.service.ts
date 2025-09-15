import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt, scrypt } from "crypto";
import { promisify } from "util";//-> 콜백 함수를 Promise 반환 함수로 변환

const ascrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

  constructor(private usersService: UsersService) { }

  
  async signup(email: string, password: string) {
    // ### 유저가 이미 존재하는지 확인
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // ### 비밀번호 Hashing
    // ## randomBytes로 salt 생성 
    const salt = randomBytes(8).toString('hex');  //-> size가 8bytes인 random bytes를 만들어서 hex로 만듦
    // ## scrypt로 salt + 비밀번호 Hashing하기
    const hash = (await ascrypt(password, salt, 32)) as Buffer;

    // ## salt와 salt+비밀번호로 hashing된거 합치기
    const result = salt + '.' + hash.toString('hex');
    // 참고: 그냥 bcrypt 패키지 다운로드받아서 해도 되긴함....


    // ### 유저 생성 및 return
    const user = await this.usersService.create(email, result);
    return user;
  }


  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split(".");
    const hash = (await ascrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    return user;
  }
}