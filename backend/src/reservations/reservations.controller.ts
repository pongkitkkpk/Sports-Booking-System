// src/reservations/reservations.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ApproveStatus } from 'src/reservation-slots/entities/reservation-slot.entity';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly service: ReservationsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('test')
  test() {
    return 'this is test messageasdfasd';
  }

  @Post('test')
  testPost(@Body() body: any) {
    console.log('Got POST:', body);
    return { ok: true };
  }

  @Post()
  async create(@Body() dto: CreateReservationDto) {
    return this.service.create(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  getSecret() {
    return { message: 'แอดมินเท่านั้นที่เข้าได้' };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('student')
  @Get('student-only')
  getStudentArea() {
    return { message: 'โซนนักศึกษาเท่านั้น 👨‍🎓' };
  }

  // GET /api/reservations/by-student/:studentId?includeCanceled=false
  // GET /api/reservations/by-student/:studentId?status=cancel
  @Get('by-student/:studentId')
  async getByStudentId(
    @Param('studentId') studentId: string,
    @Query('includeCanceled') includeCanceled?: string, // 'true'/'false'
    @Query('status') status?: ApproveStatus, // 'pending' | 'approved' | 'cancel' ...
  ) {
    const include = String(includeCanceled || '').toLowerCase();
    return this.service.findByStudentId(studentId, {
      includeCanceled: include === 'true' || include === '1' || include === 'yes',
      status,
    });
  }
}
