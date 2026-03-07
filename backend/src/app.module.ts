import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourtsModule } from './courts/courts.module';
import { Court } from './courts/entities/court.entity';
import { TimeSlotsModule } from './time-slots/time-slots.module';
import { TimeSlot } from './time-slots/entities/time-slot.entity';
import { ReservationsModule } from './reservations/reservations.module';
import { Reservation } from './reservations/entities/reservation.entity';
import { ReservationSlotsModule } from './reservation-slots/reservation-slots.module';
import { ReservationSlot } from './reservation-slots/entities/reservation-slot.entity';
import { BookingStatusesModule } from './booking-statuses/booking-statuses.module';
import { BookingStatus } from './booking-statuses/entities/booking-status.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', // ใส่รหัสผ่าน MySQL ของคุณ
      database: 'sportfield',
      entities: [Court, TimeSlot, Reservation, ReservationSlot, BookingStatus],
      synchronize: true, // พัฒนาได้ เปิด true (ระวัง prod)
    }),
    CourtsModule,
    TimeSlotsModule,
    ReservationsModule,
    ReservationSlotsModule,
    BookingStatusesModule,
    AuthModule,
  ],
})
export class AppModule {}
