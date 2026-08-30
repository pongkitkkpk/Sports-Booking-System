// src/reservation-slots/admin.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  Body,
  Patch,
  Param,
  Post,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { ReservationSlotsService } from './reservation-slots.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { KpiSummaryQueryDto } from './dto/KpiSummaryQueryDto';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Controller('admin/reservation-slots')
// ทุก endpoint ในนี้ต้อง login ก่อน (ไม่เปิดให้ผู้ใช้ไม่ผ่านการยืนยันตัวตนเรียกได้)
// endpoint ที่ผูกกับ "การปิดสนาม" และ "อนุมัติการจอง" โดยเฉพาะ ล็อกเพิ่มเป็น admin เท่านั้น
// ส่วน reject/verifysuccess/verifynoshow/banned/unban/kpis ยังใช้ร่วมกับหน้า "ยืนยันตัวตน"
// (VerifyReserve) ซึ่งไม่ได้จำกัดเฉพาะ admin จึงคงไว้แค่ระดับ "ต้อง login"
@UseGuards(AuthGuard('jwt'))
export class ReservationSlotsAdminController {
  constructor(private readonly service: ReservationSlotsService) {}

  @Get('kpis')
  async getReservationKpis(@Query() query: KpiSummaryQueryDto) {
    return this.service.getReservationKpis(query);
  }

  @Get('test')
  test() {
    return { message: 'hello from admin 👋' };
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id/approve')
  async approve(@Param('id', ParseIntPipe) id: number) {
    const result = await this.service.approve(id);
    if (!result) throw new NotFoundException('❌ ไม่พบการจอง');
    return result;
  }

  @Patch(':id/reject')
  async reject(@Param('id', ParseIntPipe) id: number, @Body() body: { reason?: string }) {
    const result = await this.service.reject(id, body.reason);
    if (!result) throw new NotFoundException('❌ ไม่พบการจอง');
    return result;
  }

  @Patch(':id/verifysuccess')
  async verifysuccess(@Param('id', ParseIntPipe) id: number) {
    const result = await this.service.handleVerifySuccess(id);
    if (!result) throw new NotFoundException('❌ ไม่พบการจอง');
    return result;
  }

  @Patch(':id/verifynoshow')
  async verifynoshow(@Param('id', ParseIntPipe) id: number, @Body() body: { reason?: string }) {
    const result = await this.service.handleVerifyNoShow(id, body.reason);
    if (!result) throw new NotFoundException('❌ ไม่พบการจอง');
    return result;
  }

  @Get('banned')
  async findBanned(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('courtType') courtType?: string,
  ): Promise<Reservation[]> {
    return this.service.findBanned(from, to, courtType);
  }

  @Patch(':id/unban')
  async unbanReservation(@Param('id', ParseIntPipe) id: number): Promise<Reservation> {
    return this.service.unbanReservation(id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post('close-court')
  async closeCourt(
    @Body()
    dto: {
      court_id: number;
      start_date: string;
      end_date: string;
      reason: string;
      booking_status_id: number;
    },
  ) {
    return this.service.closeCourtRange(
      dto.court_id,
      dto.start_date,
      dto.end_date,
      dto.booking_status_id,
      dto.reason,
    );
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post()
  async createAdminReservation(
    @Body()
    body: {
      student_id: string;
      student_name: string;
      bookingStatusId: number;
      slots: { court_id: number; time_slot_id: number; date: string }[];
    },
  ) {
    return this.service.createAdminReservation(body);
  }
}
