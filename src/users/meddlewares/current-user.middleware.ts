import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Request, Response, NextFunction } from 'express';

//Ми замінили current-user.interceptor на current-user.middleware тому що
//інтерсептори в nest js виконуються перед або після обробників маршрутів,
//а AuthGuard виконується до обробників маршрутів.
//middleware ж виконується до обробників маршрутів і до гвардів,

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      req.currentUser = user;
    }

    next();
  }
}
