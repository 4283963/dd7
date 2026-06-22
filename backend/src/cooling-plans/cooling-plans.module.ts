import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoolingPlan, CoolingPlanSchema } from '../schemas/cooling-plan.schema';
import { CoolingPlansService } from './cooling-plans.service';
import { CoolingPlansController } from './cooling-plans.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: CoolingPlan.name, schema: CoolingPlanSchema }])],
  controllers: [CoolingPlansController],
  providers: [CoolingPlansService],
  exports: [CoolingPlansService],
})
export class CoolingPlansModule {}
