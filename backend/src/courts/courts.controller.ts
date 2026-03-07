import { Controller, Get, Post, Body } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { Court } from './entities/court.entity';

@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Get()
  findAll(): Promise<Court[]> {
    return this.courtsService.findAll();
  }

  @Post()
  create(@Body() court: Partial<Court>): Promise<Court> {
    return this.courtsService.create(court);
  }
}
