import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AcControlLog, AcControlLogSchema } from '../schemas/ac-control-log.schema';
import { AcControlLogService } from './ac-control-log.service';
import { AcControlLogController } from './ac-control-log.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: AcControlLog.name, schema: AcControlLogSchema }])],
  controllers: [AcControlLogController],
  providers: [AcControlLogService],
  exports: [AcControlLogService],
})
export class AcControlLogModule {}
