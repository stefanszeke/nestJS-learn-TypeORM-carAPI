import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number) {
    if(!id) return null;
    return this.repo.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.repo.findBy({ email });
  }

  find(email: string) {
    return this.repo.find({
      where: {
        email: ILike(`%${email}%`),
      }
    });
  }
  // ILike is only for some databases, for example, postgresql, sqlite ...
  // alternative:
  // async find(email: string): Promise<User[]> {
  //   const queryBuilder = this.repo
  //     .createQueryBuilder('user')
  //     .where('LOWER(user.email) LIKE LOWER(:email)', { email: `%${email}%` });
  
  //   const result = await queryBuilder.getMany();
  //   return result;
  // }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) { throw new NotFoundException('user not found') }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) { throw new NotFoundException('user not found') }

    return this.repo.remove(user);
  }

  // partial<> is a typescript type, it means that the object can have some of the properties
  // but not all of them, 
}
