import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { ReservationSlot, ApproveStatus } from './entities/reservation-slot.entity';
import { CreateReservationSlotDto } from './dto/create-reservation-slot.dto';
import { CancelReservationDto } from './dto/cancel-reservation-slot.dto';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Court, CourtType } from 'src/courts/entities/court.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';

import { KpiSummaryQueryDto } from './dto/KpiSummaryQueryDto';
dayjs.extend(isSameOrBefore);
@Injectable()
export class ReservationSlotsService {
  constructor(
    @InjectRepository(ReservationSlot)
    private readonly reservationSlotRepo: Repository<ReservationSlot>,

    @InjectRepository(Court)
    private readonly courtRepository: Repository<Court>,

    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(data: CreateReservationSlotDto): Promise<ReservationSlot> {
    const court = await this.courtRepository.findOne({ where: { id: data.courtId } });
    if (!court) {
      throw new Error('❌ ไม่พบสนามที่เลือก');
    }

    if (court.name.toLowerCase().includes('gym')) {
      const existingCount = await this.reservationSlotRepo.count({
        where: {
          date: data.date,
          court: { id: data.courtId },
          timeSlot: { id: data.timeSlotId },
        },
      });

      if (existingCount >= 30) {
        throw new Error('❌ ยิมเต็มแล้วในช่วงเวลานี้ (เต็ม 30 ที่)');
      }
    }

    const slot = this.reservationSlotRepo.create({
      date: data.date,
      reservation: { id: data.reservationId },
      court: { id: data.courtId },
      timeSlot: { id: data.timeSlotId },
      approve_status: data.approve_status || ApproveStatus.PENDING,
      createdAt: dayjs().toDate(),
    });

    const saved = await this.reservationSlotRepo.save(slot);

    const result = await this.reservationSlotRepo.findOne({
      where: { id: saved.id },
      relations: ['reservation', 'reservation.bookingStatus', 'court', 'timeSlot'],
    });

    if (!result) throw new Error('❌ ไม่พบข้อมูล slot หลังบันทึก');

    return result;
  }

  async findAll(): Promise<ReservationSlot[]> {
    return this.reservationSlotRepo.find({
      relations: ['reservation', 'reservation.bookingStatus', 'court', 'timeSlot'],
    });
  }

  async findByDate(date: string): Promise<ReservationSlot[]> {
    return this.reservationSlotRepo.find({
      where: {
        date,
        approve_status: In([
          ApproveStatus.APPROVED,
          ApproveStatus.PENDING,
          ApproveStatus.SUCCESS,
          ApproveStatus.CLOSE,
          ApproveStatus.WALKIN,
        ]),
      },
      relations: ['reservation', 'reservation.bookingStatus', 'court', 'timeSlot'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.reservationSlotRepo.delete(id);
  }

  async findByDateAndCourt(date: string, courtId: number) {
    return this.reservationSlotRepo.find({
      where: {
        date,
        court: { id: courtId },
      },
      relations: ['reservation', 'reservation.bookingStatus', 'timeSlot'],
    });
  }

  async getDashboardAvailabilitySummary(
    date: string,
  ): Promise<Record<string, { available: number; total: number }>> {
    const now = dayjs();
    const oneHourLater = now.add(1, 'hour');
    const startTime = now.format('HH:mm:ss');
    const endTime = oneHourLater.format('HH:mm:ss');

    const reservations = await this.reservationSlotRepo.find({
      where: {
        date,
        timeSlot: {
          start_time: Between(startTime, endTime),
        },
        approve_status: ApproveStatus.APPROVED,
      },
      relations: ['court', 'timeSlot'],
    });

    const courtMap: Record<string, number[]> = {
      badminton: [1, 2, 3, 4],
      volleyball: [5],
      basketball: [6],
      futsal: [7, 8],
      boxing_judo: [9, 10],
      tennis: [11],
      football: [12],
    };

    const result: Record<string, { available: number; total: number }> = {};

    for (const [type, ids] of Object.entries(courtMap)) {
      const bookedIds = new Set(
        reservations.filter((r) => ids.includes(r.court.id)).map((r) => r.court.id),
      );
      result[type] = {
        available: ids.length - bookedIds.size,
        total: ids.length,
      };
    }

    return result;
  }

  async getAvailableSlotsInNextHour() {
    const now = dayjs();
    const nextHourStart = now.add(1, 'hour').startOf('hour').format('HH:mm:ss');
    const nextHourEnd = now.add(1, 'hour').endOf('hour').format('HH:mm:ss');
    const today = now.format('YYYY-MM-DD');

    const reservations = await this.reservationSlotRepo.find({
      where: {
        date: today,
        approve_status: In([
          ApproveStatus.APPROVED,
          ApproveStatus.PENDING,
          ApproveStatus.SUCCESS,
          ApproveStatus.CLOSE,
          ApproveStatus.WALKIN,
        ]),
      },
      relations: ['court', 'timeSlot'],
    });

    const filtered = reservations.filter((r) => {
      const start = r.timeSlot?.start_time;
      return start >= nextHourStart && start <= nextHourEnd;
    });

    const bookedCourtIds = filtered.map((r) => r.court.id);

    const allCourts = await this.courtRepository.find();

    const groupByType: Record<string, { total: number; available: number }> = {};

    for (const court of allCourts) {
      const type = this.normalizeCourtType(court.name);
      if (!groupByType[type]) {
        groupByType[type] = { total: 0, available: 0 };
      }

      groupByType[type].total += 1;

      if (!bookedCourtIds.includes(court.id)) {
        groupByType[type].available += 1;
      }
    }

    return groupByType;
  }

  private normalizeCourtType(name: string): string {
    const lowered = name.toLowerCase();
    if (lowered.includes('badminton')) return 'badminton';
    if (lowered.includes('futsal')) return 'futsal';
    if (lowered.includes('basketball')) return 'basketball';
    if (lowered.includes('volleyball')) return 'volleyball';
    if (lowered.includes('tennis')) return 'tennis';
    if (lowered.includes('boxing')) return 'boxing';
    if (lowered.includes('judo')) return 'judo';
    if (lowered.includes('football')) return 'football';
    return 'other';
  }

  async getGymSlotsByDate(date: string) {
    const gymCourt = await this.courtRepository
      .createQueryBuilder('court')
      .where('LOWER(court.name) LIKE :name', { name: '%gym%' })
      .getOne();

    if (!gymCourt) throw new Error('ไม่พบสนามยิม');

    const slots = await this.reservationSlotRepo
      .createQueryBuilder('slot')
      .leftJoin('slot.timeSlot', 'timeSlot')
      .leftJoin('slot.reservation', 'reservation')
      .where('slot.court_id = :courtId', { courtId: gymCourt.id })
      .andWhere('slot.date = :date', { date })
      .andWhere('slot.approve_status IN (:...statuses)', {
        statuses: ['pending', 'approved', 'success', 'close', 'walk-in'],
      })
      .select([
        'timeSlot.id AS timeSlotId',
        'COUNT(slot.id) AS count',
        'reservation.booking_status_id AS booking_status_id',
      ])
      .groupBy('timeSlot.id, reservation.booking_status_id')
      .orderBy('timeSlot.id')
      .getRawMany();

    return slots.map((s) => ({
      date,
      time_slot_id: s.timeSlotId,
      reserved: Number(s.count),
      available: 30 - Number(s.count),
      booking_status_id: s.booking_status_id ? Number(s.booking_status_id) : null,
    }));
  }

  async getGymAvailableNextHour() {
    const now = dayjs();
    const currentHour = now.hour();
    const nextHour = currentHour + 1;
    const today = now.format('YYYY-MM-DD');

    // 08:00 = id 1 → ดังนั้น slotId = nextHour - 7
    const timeSlotId = nextHour - 7;

    // ถ้าเลยเวลาเปิด-ปิดสนาม
    if (timeSlotId < 1 || timeSlotId > 12) {
      return {
        gym: {
          total: 0,
          available: 0,
        },
      };
    }

    //  ดึงสนามยิมทั้งหมด
    const gymCourts = await this.courtRepository.find({
      where: { type: CourtType.GYM },
    });

    const courtIds = gymCourts.map((court) => court.id);
    const totalCapacity = gymCourts.reduce((sum, court) => sum + (court.capacity || 0), 0);

    const reservedSlots = await this.reservationSlotRepo.find({
      where: {
        court: { id: In(courtIds) },
        date: today,
        timeSlot: { id: timeSlotId },
        approve_status: In([
          ApproveStatus.PENDING,
          ApproveStatus.APPROVED,
          ApproveStatus.SUCCESS,
          ApproveStatus.CLOSE,
          // ApproveStatus.WALKIN,
        ]),
      },
      relations: ['court', 'timeSlot'],
    });

    const reservedCount = reservedSlots.length;

    // ถ้ามี slot ที่ถูก mark ว่า 'close' → ให้ available = 0
    const hasClosedSlot = reservedSlots.some((slot) => slot.approve_status === ApproveStatus.CLOSE);

    const available = hasClosedSlot ? 0 : Math.max(0, totalCapacity - reservedCount);

    return {
      gym: {
        total: totalCapacity,
        available,
      },
    };
  }

  async cancelReservation(dto: CancelReservationDto) {
    const slot = await this.reservationSlotRepo.findOne({
      where: {
        date: dto.date,
        timeSlot: { id: dto.timeSlot.id },
        reservation: { id: dto.id },
      },
      relations: ['timeSlot', 'reservation'],
    });

    if (!slot) {
      console.warn('cancel not found with', {
        reservationId: dto.id,
        timeSlotId: dto.timeSlot?.id,
        date: dto.date,
      });
      throw new NotFoundException('Reservation slot not found');
    }

    slot.approve_status = ApproveStatus.CANCEL;
    await this.reservationSlotRepo.save(slot);

    return { message: 'Reservation cancelled successfully' };
  }

  async getReservationKpis(query: KpiSummaryQueryDto) {
    const { from, to, courtType, approve_status } = query;

    const where: any = {
      date: Between(from, to),
    };

    if (approve_status) {
      where.approve_status = approve_status;
    }

    if (courtType) {
      where.court = { type: courtType };
    }

    const relations = ['court', 'timeSlot', 'reservation'];

    const reservations = await this.reservationSlotRepo.find({
      where,
      relations,
      order: {
        id: 'ASC', // 'DESC' ถ้าอยากเรียงล่าสุดก่อน
        timeSlot: {
          start_time: 'ASC',
        },
      },
    });

    return {
      total: reservations.length,
      data: reservations,
    };
  }

  async approve(id: number): Promise<ReservationSlot | null> {
    const slot = await this.reservationSlotRepo.findOne({ where: { id } });
    if (!slot) throw new NotFoundException('❌ ไม่พบข้อมูล slot');

    slot.approve_status = ApproveStatus.APPROVED;
    // slot.reason = null;

    return this.reservationSlotRepo.save(slot);
  }

  async reject(id: number, reason?: string): Promise<ReservationSlot | null> {
    const slot = await this.reservationSlotRepo.findOne({ where: { id } });
    if (!slot) throw new NotFoundException('❌ ไม่พบข้อมูล slot');

    slot.approve_status = ApproveStatus.REJECTED;
    slot.reason = reason || 'ไม่ระบุเหตุผล';
    slot.is_available = true;
    return this.reservationSlotRepo.save(slot);
  }

  async handleVerifySuccess(id: number): Promise<ReservationSlot | null> {
    const slot = await this.reservationSlotRepo.findOne({ where: { id } });
    if (!slot) throw new NotFoundException('❌ ไม่พบข้อมูล slot');

    slot.approve_status = ApproveStatus.SUCCESS;
    // slot.reason = null;
    return this.reservationSlotRepo.save(slot);
  }

  async handleVerifyNoShow(id: number, reason?: string): Promise<ReservationSlot | null> {
    const slot = await this.reservationSlotRepo.findOne({
      where: { id },
      relations: ['reservation'],
    });

    if (!slot) throw new NotFoundException('❌ ไม่พบข้อมูล slot');

    slot.approve_status = ApproveStatus.NO_SHOW;
    slot.reason = reason || 'ไม่ระบุเหตุผล';
    slot.is_available = true;

    if (slot.reservation) {
      const reservation = slot.reservation;

      reservation.ban_count = (reservation.ban_count || 0) + 1;

      reservation.is_banned = true;

      await this.reservationRepository.save(reservation);
    }

    return this.reservationSlotRepo.save(slot);
  }

  async findBanned(from?: string, to?: string, courtType?: string): Promise<Reservation[]> {
    const where: any = { is_banned: true };

    if (from && to) {
      where.slots = {
        date: Between(from, to),
      };
    }

    if (courtType) {
      where.slots = {
        ...(where.slots || {}),
        court: { type: courtType },
      };
    }

    return this.reservationRepository.find({
      where,
      relations: ['slots', 'slots.court', 'slots.timeSlot'],
      order: { id: 'DESC' },
    });
  }

  async unbanReservation(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({ where: { id: reservationId } });
    if (!reservation) throw new NotFoundException('❌ ไม่พบข้อมูล Reservation');

    reservation.is_banned = false;

    return this.reservationRepository.save(reservation);
  }
  async closeCourtRange(
    courtId: number,
    start: string,
    end: string,
    booking_status_id: number,
    reason: string,
  ) {
    const court = await this.courtRepository.findOne({ where: { id: courtId } });
    if (!court) throw new NotFoundException('❌ ไม่พบสนาม');

    const startDate = dayjs(start);
    const endDate = dayjs(end);

    if (!startDate.isValid() || !endDate.isValid()) {
      throw new Error('❌ วันที่ไม่ถูกต้อง');
    }

    const allDates: string[] = [];
    let date = startDate.clone();
    while (date.isSameOrBefore(endDate, 'day')) {
      allDates.push(date.format('YYYY-MM-DD'));
      date = date.add(1, 'day');
    }

    const allSlots = await this.reservationSlotRepo.find({
      where: {
        date: In(allDates),
        court: { id: courtId },
        approve_status: In([
          ApproveStatus.APPROVED,
          ApproveStatus.PENDING,
          ApproveStatus.SUCCESS,
          ApproveStatus.CLOSE,
          ApproveStatus.WALKIN,
        ]),
      },
      relations: ['reservation', 'timeSlot'],
    });

    if (allSlots.length > 0) {
      return {
        error: '❌ มีการจองอยู่ในช่วงเวลาที่ต้องการปิด โปรดยกเลิกก่อน',
        conflicts: allSlots.map((s) => ({
          date: s.date,
          courtId: s.court.id,
          timeSlotId: s.timeSlot.id,
        })),
      };
    }

    const createdSlots: ReservationSlot[] = [];

    for (const date of allDates) {
      const reservation = this.reservationRepository.create({
        student_id: 'admin-close',
        student_name: 'System Auto Close',
        bookingStatus: { id: booking_status_id },
      });
      await this.reservationRepository.save(reservation);

      for (let timeSlotId = 1; timeSlotId <= 12; timeSlotId++) {
        const slot = this.reservationSlotRepo.create({
          date,
          court: { id: courtId },
          timeSlot: { id: timeSlotId },
          reservation: { id: reservation.id },
          approve_status: ApproveStatus.CLOSE,
          createdAt: new Date(),
        });

        const saved = await this.reservationSlotRepo.save(slot);
        createdSlots.push(saved);
      }
    }

    return {
      message: `✅ ปิดสนามสำเร็จทั้งหมด ${createdSlots.length} slots`,
      createdSlots,
    };
  }

  async createAdminReservation(body: {
    student_id: string;
    student_name: string;
    bookingStatusId: number;
    slots: { court_id: number; time_slot_id: number; date: string }[];
  }) {
    const reservation = this.reservationRepository.create({
      student_id: body.student_id,
      student_name: body.student_name,
      bookingStatus: { id: body.bookingStatusId },
    });
    await this.reservationRepository.save(reservation);

    const createdSlots: ReservationSlot[] = [];

    for (const s of body.slots) {
      const slot = this.reservationSlotRepo.create({
        court: { id: s.court_id },
        timeSlot: { id: s.time_slot_id },
        date: s.date,
        reservation: { id: reservation.id },
        approve_status: ApproveStatus.CLOSE,
        createdAt: new Date(),
      });
      const saved = await this.reservationSlotRepo.save(slot);
      createdSlots.push(saved);
    }

    return {
      message: `✅ สร้างการปิดสนาม ${createdSlots.length} ช่องสำเร็จ`,
      reservationId: reservation.id,
      createdSlots,
    };
  }

  async getUsageSummaryByCourtAndRange(courtId: number, startDate: string, endDate: string) {
    const results = await this.reservationSlotRepo
      .createQueryBuilder('slot')
      .leftJoin('slot.timeSlot', 'timeSlot')
      .leftJoin('slot.court', 'court')
      .leftJoin('slot.reservation', 'reservation')
      .where('slot.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('slot.approve_status IN (:...statuses)', {
        statuses: ['pending', 'approved', 'success', 'close', 'walk-in'],
      })
      .andWhere('court.id = :courtId', { courtId })
      .select([
        'slot.date AS date',
        'slot.timeSlot.id AS time_slot_id',
        "CONCAT(DATE_FORMAT(timeSlot.start_time, '%H.%i'), ' - ', DATE_FORMAT(timeSlot.end_time, '%H.%i')) AS time_range",
        'court.id AS court_id',
        'court.name AS court_name',
        'COUNT(DISTINCT reservation.id) AS total_users',
        "GROUP_CONCAT(DISTINCT CONCAT(reservation.student_name, ' (', reservation.student_id, ')') SEPARATOR ', ') AS user_list",
      ])
      .groupBy('slot.date')
      .addGroupBy('slot.timeSlot.id')
      .addGroupBy('timeSlot.start_time')
      .addGroupBy('timeSlot.end_time')
      .addGroupBy('court.id')
      .addGroupBy('court.name')
      .orderBy('slot.date', 'ASC')
      .addOrderBy('slot.timeSlot.id', 'ASC')
      .getRawMany();

    return results;
  }
}
