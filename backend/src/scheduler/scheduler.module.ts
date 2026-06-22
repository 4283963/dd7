import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { AcControlLogModule } from '../ac-control-log/ac-control-log.module';

@Module({
  imports: [AcControlLogModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
