// src/reservations/reservations.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import {
  ReservationSlot,
  ApproveStatus,
} from 'src/reservation-slots/entities/reservation-slot.entity';
import { Repository, In, Not } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Court, CourtType } from 'src/courts/entities/court.entity';

type FindByStudentOptions = {
  includeCanceled?: boolean;
  status?: ApproveStatus;
};

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Court)
    private readonly courtRepository: Repository<Court>,

    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(ReservationSlot)
    private reservationSlotRepository: Repository<ReservationSlot>,
  ) {}

  async findAll() {
    return this.reservationRepository.find({
      relations: ['slots', 'slots.court', 'slots.timeSlot'],
    });
  }
  async create(dto: CreateReservationDto): Promise<Reservation> {
    const reservation = this.reservationRepository.create({
      student_id: dto.student_id,
      student_name: dto.student_name,
      icit: dto.icit,
      bookingStatus: { id: dto.bookingStatusId },
    });

    const saved = await this.reservationRepository.save(reservation);

    if (dto.slots?.length) {
      const courtIds = [...new Set(dto.slots.map((s) => s.court_id))];
      const courts = await this.courtRepository.findBy({ id: In(courtIds) });
      const courtMap = new Map(courts.map((c) => [c.id, c]));

      for (const slot of dto.slots) {
        const court = courtMap.get(slot.court_id);
        if (!court) {
          throw new NotFoundException(`❌ ไม่พบสนามที่มี id = ${slot.court_id}`);
        }

        const approveStatus = slot.approve_status ?? ApproveStatus.PENDING;

        if (court.type === CourtType.GYM) {
          const activeCount = await this.reservationSlotRepository.count({
            where: {
              court: { id: slot.court_id },
              timeSlot: { id: slot.time_slot_id },
              date: slot.date,
              is_available: false,
            },
          });

          if (activeCount >= court.capacity) {
            throw new ConflictException(
              `❌ ยิมช่วงเวลา ${slot.time_slot_id} เต็มแล้ว (${activeCount}/${court.capacity})`,
            );
          }

          const newSlot = this.reservationSlotRepository.create({
            reservation: saved,
            court: { id: slot.court_id },
            timeSlot: { id: slot.time_slot_id },
            date: slot.date,
            approve_status: approveStatus,
            is_available: false,
            createdAt: new Date(),
          });
          await this.reservationSlotRepository.save(newSlot);
        } else {
          const activeSlot = await this.reservationSlotRepository.findOne({
            where: {
              court: { id: slot.court_id },
              timeSlot: { id: slot.time_slot_id },
              date: slot.date,
              approve_status: In([
                ApproveStatus.PENDING,
                ApproveStatus.APPROVED,
                ApproveStatus.SUCCESS,
                ApproveStatus.CLOSE,
              ]),
            },
          });

          if (activeSlot) {
            throw new ConflictException(
              `❌ สนาม "${court.name}" ช่วงเวลา ${slot.time_slot_id} มีคนจองแล้ว`,
            );
          }

          const newSlot = this.reservationSlotRepository.create({
            reservation: saved,
            court: { id: slot.court_id },
            timeSlot: { id: slot.time_slot_id },
            date: slot.date,
            approve_status: approveStatus,
            is_available: false,
            createdAt: new Date(),
          });
          await this.reservationSlotRepository.save(newSlot);
        }
      }
    }

    return saved;
  }

  /**
   * ✅ ดึงข้อมูล “ราย slot” ของนักศึกษา โดย default จะไม่รวม CANCEL
   *    ถ้าส่ง status มา จะเลือกสถานะนั้นตรงๆ
   *    ถ้าส่ง includeCanceled=true จะรวม CANCEL ด้วย
   */
  async findByStudentId(studentId: string, opts: FindByStudentOptions = {}): Promise<any[]> {
    const where: any = {
      reservation: { student_id: studentId },
    };

    if (opts.status) {
      where.approve_status = opts.status;
    } else if (!opts.includeCanceled) {
      where.approve_status = Not(ApproveStatus.CANCEL);
    }

    const slots = await this.reservationSlotRepository.find({
      where,
      relations: ['reservation', 'reservation.bookingStatus', 'court', 'timeSlot'],
      order: { date: 'ASC', timeSlot: { start_time: 'ASC' } },
    });

    const result = slots.map((slot) => ({
      id: slot.reservation.id,
      court: {
        name: slot.court.name,
        type: slot.court.type,
      },
      timeSlot: {
        id: slot.timeSlot.id,
        start: slot.timeSlot.start_time,
        end: slot.timeSlot.end_time,
      },
      date: slot.date,
      status: slot.approve_status || 'pending',
      booking_status_id: slot.reservation.bookingStatus?.id ?? null,
      booking_status: slot.reservation.bookingStatus?.description ?? 'ไม่ระบุ',
      reservation_slot_id: slot.id,
    }));

    return result;
  }
}
