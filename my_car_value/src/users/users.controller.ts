import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ClassSerializerInterceptor, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize, SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guard/auth.guard';


@Serialize(UserDto)
@Controller('auth')
export class UsersController {

  constructor(private usersService: UsersService, private authService: AuthService) {}

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }


  // Interceptor + Decorator를 동시에 사용해야 @CurrentUser()를 사용해서 유저정보를 가져올 수 있음
  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    
    // create user
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {

    const user = await this.authService.signin(body.email, body.password);

    session.userId = user.id;

    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  
  @Get("/:id")
  findUser(@Param("id") id: string) { // param은 항상 string임.. 숫자면 후처리로 parsing해야 함
    console.log('handler is running.');
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  find(@Query("email") email: string) { // param은 항상 string임.. 숫자면 후처리로 parsing해야 함

    return this.usersService.find(email);
  }

  @Delete("/:id")
  removeUser(@Param("id") id: string) {
    return this.usersService.remove(parseInt(id));
  }


  @Patch("/:id")
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    
    this.usersService.update(parseInt(id), body);
  }

}
