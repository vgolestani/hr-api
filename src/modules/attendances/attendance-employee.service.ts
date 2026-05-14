import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CheckInOutDto } from './dto/check-in-out-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { IsNull, Repository } from 'typeorm';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';


@Injectable()
export class AttendanceEmployeeService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>
  ) { }

  async checkIn(userId: number, j_date: string, notes?: string) {
    const opened_attendance =await this.attendanceRepo.find({
      where: {
        user: { id: userId } ,
        checkOutTime: IsNull(),
        j_date
      }
    })

    if(opened_attendance.length) throw new BadRequestException('یک تردد باز داری که هنوز خروجش را ثبت نکردی')

    const attendance = this.attendanceRepo.create({
      user: { id: userId } as any,
      checkInTime: new Date(),
      notes: notes || null,
      j_date: j_date
    })
    return await this.attendanceRepo.save(attendance)
  }

  async checkOut(userId: number,j_date:string, notes?: string ) {
    const attendance = await this.attendanceRepo.findOne({
      where: {
        user: { id: userId },
        checkOutTime: IsNull(),
        j_date
      },
      order: { checkInTime: 'DESC' }
    })

    if (!attendance) throw new NotFoundException('هیچ رکورد ورودی بدون خروج یافت نشد')

    attendance.checkOutTime = new Date()
    if (notes) {
      attendance.notes = attendance.notes ? `${attendance.notes} - ${notes}` : notes
    }

    return await this.attendanceRepo.save(attendance)
  }

  async findMyAttendance(userId: number, filters: FilterAttendanceDto) {
    const querBuilder = this.attendanceRepo
      .createQueryBuilder('attendances')
      .where('attendances.userId= userId', { userId })

    if (filters.startTime) {
      querBuilder.andWhere('attendances.j_date >= :startTime', {
        startTime: filters.startTime
      })
    }

    if (filters.endTime) {
      querBuilder.andWhere('attendances.j_date <= :endTime', {
        endTime: filters.endTime
      })
    }

    return await querBuilder
      .orderBy('attendances.checkInTime', 'DESC')
      .getMany()
  }

}
