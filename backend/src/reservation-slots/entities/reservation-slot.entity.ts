// src/reservation-slots/entities/reservation-slot.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Court } from 'src/courts/entities/court.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { fstat } from 'fs';

export enum ApproveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCEL = 'cancel',
  SUCCESS = 'success',
  NO_SHOW = 'no_show',
  CLOSE = 'close',
  WALKIN = 'walk-in',
}

@Entity('reservation_slots')
export class ReservationSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string; // YYYY-MM-DD format

  @Column({ type: 'enum', enum: ApproveStatus, default: ApproveStatus.PENDING })
  approve_status: ApproveStatus;

  @ManyToOne(() => Reservation, (reservation) => reservation.slots, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reservation_id' }) //  FK: reservation_id
  reservation: Reservation;

  @ManyToOne(() => Court, { eager: true })
  @JoinColumn({ name: 'court_id' }) //  FK: court_id
  court: Court;

  @ManyToOne(() => TimeSlot, { eager: true })
  @JoinColumn({ name: 'time_slot_id' }) // FK: time_slot_id
  timeSlot: TimeSlot;

  @Column({ nullable: true })
  reason: string;

  @Column({ default: false })
  is_available: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
