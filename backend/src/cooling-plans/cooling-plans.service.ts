import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoolingPlan } from '../schemas/cooling-plan.schema';

@Injectable()
export class CoolingPlansService {
  constructor(@InjectModel(CoolingPlan.name) private coolingPlanModel: Model<CoolingPlan>) {}

  async findAll(): Promise<CoolingPlan[]> {
    return this.coolingPlanModel.find().sort({ adoptedAt: -1 }).exec();
  }

  async create(data: Partial<CoolingPlan>): Promise<CoolingPlan> {
    const created = new this.coolingPlanModel(data);
    return created.save();
  }
}
