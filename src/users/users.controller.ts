import { Body, Controller, Post, Get, Patch, Delete, Param, Query, NotFoundException } from '@nestjs/common';
import { createUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user.dto';


@Controller('auth')
export class UsersController {

  constructor(private userService: UsersService) { }

  @Post('signup')
  createUser(@Body() body: createUserDTO) {
    this.userService.create(body.email, body.password);
  }

  @Get(':id')// in nest param is string
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) { throw new NotFoundException('user not found') }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return this.userService.update(+id, body);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

}


// create user entity
// create user dto for user request with validators
// setup controller routes and service methods
// in service, inject repository
// in controller, inject service
// first you make the services where you use the repository and also use some logic.
// these services can be accessed through the controllers.