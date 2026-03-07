// src/reservation-slots/reservation-slots.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationSlot } from './entities/reservation-slot.entity';
import { ReservationSlotsService } from './reservation-slots.service';
import { ReservationSlotsController } from './reservation-slots.controller';
import { Court } from 'src/courts/entities/court.entity';
import { ReservationSlotsAdminController } from './admin.controller';
import { Reservation } from 'src/reservations/entities/reservation.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ReservationSlot, Court, Reservation])],
  controllers: [ReservationSlotsController, ReservationSlotsAdminController],
  providers: [ReservationSlotsService],
  exports: [TypeOrmModule],
})
export class ReservationSlotsModule {}
