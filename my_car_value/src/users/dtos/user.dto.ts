import { IsEmail } from "class-validator";
import { Expose } from "class-transformer";

export class UserDto {
  
  @Expose()
  id: number;

  @Expose()
  email: string;

}