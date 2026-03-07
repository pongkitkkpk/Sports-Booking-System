import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { ReservationSlot } from 'src/reservation-slots/entities/reservation-slot.entity';
import { Court } from 'src/courts/entities/court.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, ReservationSlot, Court])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
