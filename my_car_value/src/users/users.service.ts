import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }


  /**
   * 유저 생성하는 메서드
   * @param email 
   * @param password 
   * @returns 
   */
  create(email: string, password: string) {

    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);

  }


  /**
   * id로 user찾는 메서드
   * @param id 
   * @returns 
   */
  async findOne(id: number) {
    if (!id) {
      return null;
    }

    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      
    });

    return user;
  }



  /**
   * email로 user list 찾는 메서드
   * @param email 
   * @returns 
   */
  find(email: string) {
    return this.userRepository.find({
      where: {
        email,
      }
    })
  }


  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException("유저를 찾을 수 없습니다.")
    }

    // Object에 attrs의 속성-값들을 overwrite함
    Object.assign(user, attrs);

    return this.userRepository.save(user);
  }


  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException("유저를 찾을 수 없습니다.")
    }
    
    return this.userRepository.remove(user);
  }

}
