import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  //сервіс потребує копію юзер репозиторію
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    //Обовязково треба спочатку створити юзер - має спочатку створитися ентіті у апп, а потім можна її зберегти в бд
    //це для того щоб спрацював хук typeorm @AfterInsert(), коли зробити просто this.repo.save({ email, password }) -
    //відбудеться додавання плеєн обєкта в бд, а не ентіті і не спрацює хук
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
    // return this.repo.findOneBy({ email: id }); //якщо треба знайти по email
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    //Коли робити save() спрацьовуватимуть хуки typeorm (напр @AfterUpdate()) навідміну від insert() or update()
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    //Коли робити remove() спрацьовуватимуть хуки typeorm (напр @AfterRemove()) навідміну від delete(), але в delete() можна передати id або email
    //ентіті яку треба видалити - це швидше, тому що в remove() треба спочатку знайти ентіті, а потім видалити
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.remove(user);
  }
}
