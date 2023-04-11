import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // register the User entity within the module, and TypeORM will automatically create a repository for it
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
