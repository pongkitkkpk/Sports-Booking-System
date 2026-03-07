// src/reservation-slots/dto/create-reservation-slot.dto.ts

import { ApproveStatus } from '../entities/reservation-slot.entity';

export class CreateReservationSlotDto {
  date: string; // Format: YYYY-MM-DD
  reservationId: number;
  courtId: number;
  courtName: string;
  approve_status?: ApproveStatus;
  timeSlotId: number;
}
