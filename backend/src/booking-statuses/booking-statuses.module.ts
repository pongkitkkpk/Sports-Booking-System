// src/booking-statuses/booking-statuses.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingStatusesService } from './booking-statuses.service';
import { BookingStatusesController } from './booking-statuses.controller';
import { BookingStatus } from './entities/booking-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingStatus])],
  controllers: [BookingStatusesController],
  providers: [BookingStatusesService],
  exports: [BookingStatusesService],
})
export class BookingStatusesModule {}
