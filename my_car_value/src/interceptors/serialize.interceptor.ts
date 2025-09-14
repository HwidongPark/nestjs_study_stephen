import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs'
import { plainToClass } from 'class-transformer'
import { UserDto } from '../users/dtos/user.dto'

// Tip: 아무 Class 타입 나타내는 방법
interface ClassConstructor {
  // any class라는 의미
  new (...args: any[]): {}
}

// decorator는 그냥 함수임
// custom decorator를 만들어서 @UseInterceptors(new SerializeInterceptor(UserDto)) 같은 긴 decorator사용 안해도 되도록 만듦
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}


/**
 * 적절한 DTO로 응답하도록 하는 Custom Interceptor
 */
export class SerializeInterceptor implements NestInterceptor {
  

  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by the request handler
    console.log("I'm running before the handler. ", context);




    return next.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        console.log("I'm running before response is sent out. ", data);

        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,  //-> DTO 클래스에 @Expose()로 지정된 속성만 직렬화 대상에 포함시킴
        });
      })
    );
  }
}