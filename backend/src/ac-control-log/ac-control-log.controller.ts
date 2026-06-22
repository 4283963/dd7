import { Controller, Get, Query } from '@nestjs/common';
import { AcControlLogService } from './ac-control-log.service';
import { AcControlLog } from '../schemas/ac-control-log.schema';

@Controller('api/ac-control-logs')
export class AcControlLogController {
  constructor(private readonly acControlLogService: AcControlLogService) {}

  @Get()
  async findAll(@Query('room') room?: string): Promise<AcControlLog[]> {
    if (room) {
      return this.acControlLogService.findByRoom(room);
    }
    return this.acControlLogService.findAll();
  }
}
