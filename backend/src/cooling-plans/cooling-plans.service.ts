import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoolingPlan } from '../schemas/cooling-plan.schema';
import { SchedulerService } from '../scheduler/scheduler.service';

@Injectable()
export class CoolingPlansService {
  private readonly logger = new Logger(CoolingPlansService.name);

  constructor(
    @InjectModel(CoolingPlan.name) private coolingPlanModel: Model<CoolingPlan>,
    private schedulerService: SchedulerService,
  ) {}

  async findAll(): Promise<CoolingPlan[]> {
    return this.coolingPlanModel.find().sort({ adoptedAt: -1 }).exec();
  }

  async create(data: Partial<CoolingPlan>): Promise<CoolingPlan> {
    const created = new this.coolingPlanModel(data);
    const saved = await created.save();

    if (saved.strategies && saved.strategies.length > 0) {
      try {
        this.schedulerService.registerStrategies(saved.strategies, saved._id.toString());
        this.logger.log(`策略已采纳并注册 ${saved.strategies.length} 组定时任务 (planId: ${saved._id})`);
      } catch (err) {
        this.logger.error(`定时任务注册失败 (planId: ${saved._id})`, err);
      }
    }

    return saved;
  }
}
