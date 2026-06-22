import { Controller, Get } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room } from '../schemas/room.schema';

@Controller('api/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }
}
