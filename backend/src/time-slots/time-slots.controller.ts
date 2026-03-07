// src/time-slots/time-slots.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';
import { TimeSlot } from './entities/time-slot.entity';

@Controller('time-slots')
export class TimeSlotsController {
  constructor(private readonly service: TimeSlotsService) {}

  @Get()
  findAll(): Promise<TimeSlot[]> {
    return this.service.findAll();
  }

  @Post()
  create(@Body() body: Partial<TimeSlot>) {
    return this.service.create(body);
  }
}
