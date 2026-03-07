// src/reservation-slots/dto/KpiSummaryQueryDto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApproveStatus } from '../entities/reservation-slot.entity';
import { CourtType } from 'src/courts/entities/court.entity';

export class KpiSummaryQueryDto {
  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsOptional()
  @IsEnum(CourtType)
  courtType?: CourtType;

  @IsOptional()
  @IsEnum(ApproveStatus)
  approve_status?: ApproveStatus;
}
