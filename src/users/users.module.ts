import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // register the User entity within the module, and TypeORM will automatically create a repository for it
  controllers: [UsersController],
  providers: [UsersService, AuthService]
})
export class UsersModule {}
