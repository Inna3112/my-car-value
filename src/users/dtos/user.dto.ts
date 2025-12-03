//цей клас визначає яким має бути респонс від сервера
import { Expose } from 'class-transformer';
export class UserDto {
  @Expose()
  id: number;

  @Expose() // Expose decorator is used to expose (share) the property
  email: string;
}
