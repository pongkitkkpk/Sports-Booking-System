// src/booking-statuses/booking-statuses.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingStatus } from './entities/booking-status.entity';

@Injectable()
export class BookingStatusesService {
  constructor(
    @InjectRepository(BookingStatus)
    private readonly repo: Repository<BookingStatus>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findById(id: number) {
    return this.repo.findOneBy({ id });
  }
}
