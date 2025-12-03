import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//Param decorator exist outside the DI system, so our decorator can't get an
//instance of UsersService directly.

//SOLUTION: make an interceptor to get the current user, then use the value  produced
//by it in the decorator.

export const CurrentUser = createParamDecorator(
  //тут дата never тому що ми ніколи нічого ну юудемо передавати в декоратор параметром
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
