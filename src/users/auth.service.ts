import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt); // promisify is a function that converts a callback function to a promise function

@Injectable()
export class AuthService {

  constructor(private usersService: UsersService) { }

  async signup(email: string, password: string) {
    console.log(this.usersService)
    // see if email exists
    const users = await this.usersService.findByEmail(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // hash password
    // 1. generate salt
    const salt = randomBytes(8).toString('hex'); // 16 characters    
    // 2. hash password with salt
    const hash = (await scrypt(password, salt, 32)) as Buffer; // as Buffer is a type assertion, Buffer is needed for the next step
    // 3. join salt and hash
    const result = salt + '.' + hash.toString('hex'); // '.' separates salt and hash

    // create user
    const user = await this.usersService.create(email, result);

    // return user
    return user;
  }

  async signin(email: string, password: string) {
    // find user by email:
    const [user] = await this.usersService.findByEmail(email);

    // if user does not exist, throw error
    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    // split salt and hash from user.password
    const [salt, storedHash] = user.password.split('.');
    
    // hash the request password with salt from user.password
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // if password does not match, throw error
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('invalid credentials');
    }

    // if password matches, return user
    return user;
  }
}