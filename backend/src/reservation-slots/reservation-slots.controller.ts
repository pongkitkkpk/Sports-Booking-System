// src/reservation-slots/reservation-slots.controller.ts
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ReservationSlotsService } from './reservation-slots.service';
import { CreateReservationSlotDto } from './dto/create-reservation-slot.dto';
import { CancelReservationDto } from './dto/cancel-reservation-slot.dto';
@Controller('reservation-slots')
export class ReservationSlotsController {
  constructor(private readonly service: ReservationSlotsService) {}

  @Post()
  create(@Body() createDto: CreateReservationSlotDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('test')
  test() {
    return 'this is test message';
  }

  @Get('by-date')
  findByDate(@Query('date') date: string) {
    return this.service.findByDate(date);
  }
  @Get('by-date-and-court')
  getByDateAndCourt(@Query('date') date: string, @Query('courtId') courtId: number) {
    return this.service.findByDateAndCourt(date, courtId);
  }

  @Get('summary')
  getDashboardAvailabilitySummary(@Query('date') date: string) {
    return this.service.getDashboardAvailabilitySummary(date);
  }

  @Get('available-next-hour')
  getAvailableNextHour() {
    return this.service.getAvailableSlotsInNextHour();
  }

  @Get('gym-by-date')
  async getGymSlotsByDate(@Query('date') date: string) {
    return this.service.getGymSlotsByDate(date);
  }

  @Get('gym-available-next-hour')
  async getAvailableGymSlotsNextHour() {
    return this.service.getGymAvailableNextHour();
  }

  @Post('cancel')
  async cancelReservation(@Body() dto: CancelReservationDto) {
    console.log('cancel dto received:', dto);
    return this.service.cancelReservation(dto);
  }

  @Get('/usage-summary')
  async getUsageSummaryByCourt(
    @Query('courtId') courtId: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.service.getUsageSummaryByCourtAndRange(Number(courtId), start, end);
  }
}
