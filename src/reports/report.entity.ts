import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => User, (user) => user.reports)
  //лише цей декоратор спричиняє зміни у БД (на відміну від @OneToMany в User) - додається колонка userId
  //After adding in the 'ManyToOne' decorator, you must delete your current database.
  //
  // Please delete the db.sqlite file in your root project directory, otherwise you will get an error in the coming videos.
  //
  // After deleting the database, make a request to 'sign up' to your app again using your API client
  user: User;
}
