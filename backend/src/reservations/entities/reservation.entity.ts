// src/reservations/entities/reservation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ReservationSlot } from '../../reservation-slots/entities/reservation-slot.entity';
import { BookingStatus } from 'src/booking-statuses/entities/booking-status.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_id: string;

  @Column()
  student_name: string;

  @Column()
  icit: string;

  @Column()
  approve_status: string;

  @ManyToOne(() => BookingStatus, (status) => status.reservations, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'booking_status_id' })
  bookingStatus: BookingStatus;

  @OneToMany(() => ReservationSlot, (slot) => slot.reservation)
  slots: ReservationSlot[];

  @Column({ default: 0 })
  ban_count: number; // ✅ นับจำนวนครั้งที่โดนแบน

  @Column({ default: false })
  is_banned: boolean; // ✅ ถูกแบนหรือไม่
}
