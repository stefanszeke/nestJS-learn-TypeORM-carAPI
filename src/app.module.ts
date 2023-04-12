import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [TypeOrmModule.forRoot({  // for database
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [User, Report],
    synchronize: true, // modify table structure(create, drop, add column ...) , only for development
  }), UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
