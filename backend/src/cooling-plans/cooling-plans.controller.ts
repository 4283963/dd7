import { Controller, Get, Post, Body } from '@nestjs/common';
import { CoolingPlansService } from './cooling-plans.service';
import { CoolingPlan } from '../schemas/cooling-plan.schema';

@Controller('api/cooling-plans')
export class CoolingPlansController {
  constructor(private readonly coolingPlansService: CoolingPlansService) {}

  @Get()
  async findAll(): Promise<CoolingPlan[]> {
    return this.coolingPlansService.findAll();
  }

  @Post()
  async create(@Body() body: Partial<CoolingPlan>): Promise<CoolingPlan> {
    return this.coolingPlansService.create(body);
  }
}
