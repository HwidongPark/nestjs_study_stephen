import { Controller, Get } from "@nestjs/common";

@Controller("/app")
export class AppControlelr {
  
  // incoming 요청을 처리할 method
  @Get("/asdf")
  getRootRoute() {


    // Controller에서 return하면 응답 보내짐
    return "hi there!";
  }

  @Get("/bye")
  getByeRoute() {
    return "bye there!";
  }

}
