import { User } from "src/users/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";


@Entity()
export class Report {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;


  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  // - 첫번째 아규먼트: 관계를 맺는 Entity타입을 리턴하는 함수
  // - 두번째 아규먼트: 관계를 맺는 Entity인스턴스를 아규먼트로 받고, 상대 객체가 Entity와 관계를 맺는 필드리턴
  @ManyToOne(() => User, (user) => user.reports, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })  //-> 이 테이블의 FK칼럼 이름을 user_id로 지정
  user: User;

  @Column({ name: 'user_id' })
  userId: number;
}