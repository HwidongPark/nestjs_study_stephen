import { IsEmail } from "class-validator";
import { Report } from "src/reports/report.entity";
import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;


  // - 첫번째 아규먼트: 관계를 맺는 Entity타입을 리턴하는 함수
  // - 두번째 아규먼트: 관계를 맺는 Entity인스턴스를 아규먼트로 받고, 상대 객체가 Entity와 관계를 맺는 필드리턴
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];


  @AfterInsert()
  logInsert() {
    console.log(`Inserted User with id `, this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log("Updated User with id: ", this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log("Removed User with id: ", this.id);
  }
}