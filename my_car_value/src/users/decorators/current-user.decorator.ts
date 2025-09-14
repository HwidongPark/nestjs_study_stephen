import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    
    // console.log(request.session.userId);

    // Decorator에서는 request객체에는 접근할 수 있지만, Dependency Injection을 받을 수 없어서 Interceptor도 같이 사용해야 함


    return request.currentUser;
  }
);