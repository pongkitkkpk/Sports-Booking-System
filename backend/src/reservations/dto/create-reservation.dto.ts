// src/reservations/dto/create-reservation.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApproveStatus } from 'src/reservation-slots/entities/reservation-slot.entity';

export class ReservationSlotInput {
  @IsNumber()
  court_id: number;

  @IsNumber()
  time_slot_id: number;

  @IsString()
  date: string;

  @IsOptional()
  @IsEnum(ApproveStatus)
  approve_status?: ApproveStatus; // ✅ เพิ่มตรงนี้
}

export class CreateReservationDto {
  @IsString()
  student_id: string;

  @IsString()
  student_name: string;

  @IsString()
  icit: string;

  @IsNumber()
  bookingStatusId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReservationSlotInput)
  slots: ReservationSlotInput[];
}
