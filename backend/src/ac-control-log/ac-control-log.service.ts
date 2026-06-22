import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AcControlLog } from '../schemas/ac-control-log.schema';

@Injectable()
export class AcControlLogService {
  constructor(@InjectModel(AcControlLog.name) private acControlLogModel: Model<AcControlLog>) {}

  async create(data: Partial<AcControlLog>): Promise<AcControlLog> {
    const log = new this.acControlLogModel(data);
    return log.save();
  }

  async findAll(): Promise<AcControlLog[]> {
    return this.acControlLogModel.find().sort({ executedAt: -1 }).limit(100).exec();
  }

  async findByRoom(room: string): Promise<AcControlLog[]> {
    return this.acControlLogModel.find({ room }).sort({ executedAt: -1 }).limit(50).exec();
  }
}
