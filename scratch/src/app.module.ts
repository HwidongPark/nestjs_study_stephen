import { Module } from "@nestjs/common";
import { AppControlelr } from "./app.controller";


@Module({
  controllers: [AppControlelr]
})
export class AppModule {

}