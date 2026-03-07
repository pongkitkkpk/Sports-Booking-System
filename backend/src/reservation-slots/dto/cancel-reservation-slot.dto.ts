// \src\reservation-slots\dto\cancel-reservation-slot.dto.ts
export class CancelReservationDto {
  id: number;
  timeSlot: { id: number };
  date: string; //  YYYY-MM-DD format
  status: 'cancel';
}
