import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interseptors/serialize-interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
//@Serialize це інтерцептор
@Serialize(UserDto) //застосовує до всіх методів повернення даних клієнту в форматі UserDto
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.userService.findOne(session.userId);
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  //@CurrentUser custom param decorator
  //Можна передати параметр в декоратор, наприклад @CurrentUser('admin') в декораторі параметр прийде першим аргументом
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    //session тут це кукі
    //тут є хедер Set-Cookie
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    //session тут це кукі
    //тут немає хедера Set-Cookie тому що кукі повертається назад з браузера
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;

    return user;
  }

  // @Serialize(UserDto) //застосовує до цього методу повернення даних клієнту в форматі UserDto
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
