import { Expose } from 'class-transformer';
export class UserDto {
  @Expose()
  id: number;

  @Expose() // Expose decorator is used to expose the property
  email: string;
}
