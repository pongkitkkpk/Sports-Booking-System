// src/booking-statuses/entities/booking-status.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Entity({ name: 'booking_statuses' })
export class BookingStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @OneToMany(() => Reservation, (reservation) => reservation.bookingStatus)
  reservations: Reservation[];
}
