import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  mileage: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  //obj - це увесь об'єкт Report, з якого ми беремо user і з нього дістаємо id
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
