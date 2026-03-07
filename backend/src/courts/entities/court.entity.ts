import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum CourtType {
  BADMINTON = 'badminton',
  FUTSAL = 'futsal',
  VOLLEYBALL = 'volleyball',
  BASKETBALL = 'basketball',
  BOXING = 'boxing',
  JUDO = 'judo',
  TENNIS = 'tennis',
  FOOTBALL = 'football',
  GYM = 'gym',
}

@Entity('courts')
export class Court {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  imageUrl: string;

  @Column('text')
  description: string;

  // ✅ ประเภทของสนาม เช่น 'badminton', 'futsal'
  @Column({
    type: 'enum',
    enum: CourtType,
  })
  type: CourtType;

  @Column({ default: 1 })
  capacity: number;
}
