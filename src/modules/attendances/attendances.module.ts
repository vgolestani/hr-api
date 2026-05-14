import { Module } from '@nestjs/common';
import { AttendanceEmployeeService } from './attendance-employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { User } from '../auth/entities/user.entity';
import { AttendanceEmployeeController } from './attendance-employee.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance,User])
  ],
  controllers: [AttendanceEmployeeController],
  providers: [AttendanceEmployeeService],
})
export class AttendancesModule {}
