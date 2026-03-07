import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Court } from './entities/court.entity';

@Injectable()
export class CourtsService {
  constructor(
    @InjectRepository(Court)
    private courtsRepo: Repository<Court>,
  ) {}

  findAll(): Promise<Court[]> {
    return this.courtsRepo.find();
  }

  create(court: Partial<Court>): Promise<Court> {
    return this.courtsRepo.save(court);
  }
}
