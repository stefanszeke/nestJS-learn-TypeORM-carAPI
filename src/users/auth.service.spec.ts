import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { create } from "domain";
import { User } from "./user.entity";
import { BadRequestException } from "@nestjs/common";

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt); // promisify is a function that converts a callback function to a promise function

describe('*** AuthService Tests ***', () => {
  // global variable for service so that we can use it in all test cases
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {

    const users: User[] = [];

    // Create fake users service
    fakeUsersService = {
      findByEmail: (email: string) => {
        return Promise.resolve(users.filter(user => user.email === email))
      },

      create: async (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 99999), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      }
    }

    // Create a module, and pass the fake users service to it
    const module = await Test.createTestingModule({
      providers: [AuthService, {
        provide: UsersService,
        useValue: fakeUsersService
      }]
    }).compile();

    // Get the service
    service = module.get(AuthService);
  })


  it('Can create an instance of auth service', async () => {
    // Test the service
    expect(expect(service).toBeDefined());
  })

  it('Can signup a new user and hash the password', async () => {
    const user = await service.signup("test@user.com", "password");

    expect(user.password).not.toEqual("password");
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Throws an error if user signs up with email that is in use', async () => {
    await service.signup("test@mail.com", "123");

    // Use try-catch to catch the exception thrown by the signup() method
    let exception;
    try {
      await service.signup("test@mail.com", "123");
    } catch (error) {
      exception = error;
    }

    // Assert that the exception is an instance of BadRequestException and has the correct message
    expect(exception).toBeInstanceOf(BadRequestException);
    expect(exception.message).toEqual('email in use');

    // another way to test the exception
    await expect(service.signup("test@mail.com", "123")).rejects.toThrow(BadRequestException);
    await expect(service.signup("test@mail.com", "123")).rejects.toThrow('email in use');
  })

  it('Throws an error if signin is called with an unused email', async () => {
    await expect(service.signin("weee@mail.com", "")).rejects.toThrow(BadRequestException);
    await expect(service.signin("weee@mail.com", "")).rejects.toThrow('invalid credentials');
  })

  it('Throws an error if an invalid password is provided', async () => {
    await service.signup("test@mail.com", "123");

    await expect(service.signin("test@mail.com", "1234")).rejects.toThrow(BadRequestException);
    await expect(service.signin("test@mail.com", "1234")).rejects.toThrow('invalid credentials');
  })

  it('Returns a user if correct password is provided', async () => {
    await service.signup("test2@mail.com", "123")

    const user = await service.signin("test2@mail.com", "123")

    expect(user).toBeDefined();
    // expect(user.id).toEqual(1);
    // expect(user.email).toEqual("test@mail.com");
  });

})




// providers: [AuthService, {
//   provide: UsersService,
//   useValue: fakeUsersService = is you as for userServices, you will get fakeUsersService
// }]

// const fakeUsersService = {
//   find: () => Promise.resolve([]), = when you call find, you will get an empty array
//   create: (email: string, password: string) => Promise.resolve({ id: 1, email, password }) = when you call create, you will get an object with id, email and password
// }