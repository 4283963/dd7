import { Controller, Get, Post, Delete, Query, Param, Body } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation } from '../schemas/reservation.schema';

@Controller('api/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  async findByDate(@Query('date') date: string): Promise<Reservation[]> {
    return this.reservationsService.findByDate(date);
  }

  @Post()
  async create(@Body() body: Partial<Reservation>): Promise<Reservation> {
    return this.reservationsService.create(body);
  }

  @Delete(':id')
  async cancel(@Param('id') id: string): Promise<Reservation | null> {
    return this.reservationsService.cancel(id);
  }
}
