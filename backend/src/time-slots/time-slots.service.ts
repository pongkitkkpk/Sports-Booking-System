// src/time-slots/time-slots.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlot } from './entities/time-slot.entity';

@Injectable()
export class TimeSlotsService {
  constructor(
    @InjectRepository(TimeSlot)
    private timeSlotRepo: Repository<TimeSlot>,
  ) {}

  findAll(): Promise<TimeSlot[]> {
    return this.timeSlotRepo.find({ order: { start_time: 'ASC' } });
  }

  create(slot: Partial<TimeSlot>) {
    return this.timeSlotRepo.save(slot);
  }
}
