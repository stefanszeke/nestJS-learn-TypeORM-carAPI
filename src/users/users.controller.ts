import { Body, Controller, Post, Get, Patch, Delete, Param, Query, NotFoundException, Session, UseGuards } from '@nestjs/common';
import { createUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDTO } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decoratora/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';


@Controller('auth/')
@Serialize(UserDTO) // apply to all routes in this 
export class UsersController {

  constructor(private userService: UsersService, private authService: AuthService) { }

  @Get('testMe')
  @UseGuards(AuthGuard)
  // interceptors run before the request goes to the controller
  testMe(@CurrentUser() user: User) {
    return user;
  }
  // interceptors run after the request goes to the controller


  @Post('signup')
  async createUser(@Body() body: createUserDTO, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() body: createUserDTO, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  // @Serialize(UserDTO) apply to this route
  @Get(':id')// in nest param is string
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) { throw new NotFoundException('user not found') }
    return user;
  }


  @Get()
  @UseGuards(AuthGuard)
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


// @Get('colors/:color')
// setColor(@Param('color') color: string, @Session() session: any) {
//   session.color = color;
// }

// @Get('colors')
// getColor(@Session() session: any) {
//   return session.color;
// }