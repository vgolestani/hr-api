import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../../shared/enums/user-role.enum";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AttendanceEmployeeService } from "./attendance-employee.service";
import { CheckInOutDto } from "./dto/check-in-out-dto";
import { User } from "../../common/decorators/user.decorator";
import { FilterAttendanceDto } from "./dto/filter-attendance.dto";
import { Attendance } from "./entities/attendance.entity";

@ApiBearerAuth()
@Roles(Role.EMPLOYEE)
@Controller('employee/attendance')
export class AttendanceEmployeeController {
    constructor(private readonly attendanceEmployeeService: AttendanceEmployeeService) { }

    @Post('check-in')
    async checkIn(
        @Body() dto: CheckInOutDto,
        @User() user: { id: number, role: string }
    ): Promise<Attendance> {
        return await this.attendanceEmployeeService.checkIn(user.id, dto.j_date, dto.notes)
    }

    @Post('check-out')
    async checkOut(
        @Body() dto: CheckInOutDto,
        @User() user: { id: number, role: string }
    ): Promise<Attendance> {
        return await this.attendanceEmployeeService.checkOut(user.id, dto.j_date, dto.notes)
    }

    @Get()
    async findMyAttendance(
        @Query() filters: FilterAttendanceDto,
        @User() user: { id: number }
    ): Promise<Attendance[]> {
        return await this.attendanceEmployeeService.findMyAttendance(user.id, filters)
    }
}