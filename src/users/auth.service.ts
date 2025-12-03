import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

//randomBytes: функція з модуля crypto, яка генерує криптографічно захищені випадкові байти. Її часто використовують для створення соль (salt) або ключів.
//scrypt: функція для хешування паролів із використанням алгоритму scrypt. Це сучасний і безпечний алгоритм для хешування, який добре підходить для зберігання паролів.
//promisify: функція з модуля util, яка перетворює функцію з колбеком (callback) у функцію, яка повертає Promise.
//функція scrypt у модулі crypto використовує колбеки, що може ускладнити роботу з нею в сучасному JavaScript
//promisify перетворює _scrypt у функцію, яка працює на основі Promise
const script = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // If email is not in use, hash the password
    //Generate a salt

    //randomBytes generates 16 characters long string
    const salt = randomBytes(8).toString('hex');

    //Hash the salt and the password together
    //32 - це довжина хеша (32 байти або символи)
    const hash = (await script(password, salt, 32)) as Buffer;

    //Join the hashed result and the salt together
    //toString('hex') перетворює у шістнадцятковий формат
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.usersService.create(email, result);

    // Return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await script(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    return user;
  }
}
