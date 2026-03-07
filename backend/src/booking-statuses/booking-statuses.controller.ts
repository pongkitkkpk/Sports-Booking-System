// src/booking-statuses/booking-statuses.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { BookingStatusesService } from './booking-statuses.service';

@Controller('booking-statuses')
export class BookingStatusesController {
  constructor(private readonly service: BookingStatusesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(+id);
  }
}
