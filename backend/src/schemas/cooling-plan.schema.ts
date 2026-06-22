import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CoolingPlanDocument = CoolingPlan & Document;

@Schema({ collection: 'cooling_plans', timestamps: true })
export class CoolingPlan {
  @Prop([
    {
      room: String,
      schedule: { on: String, off: String },
      temperature: Number,
      reasoning: String,
    },
  ])
  strategies: {
    room: string;
    schedule: { on: string; off: string };
    temperature: number;
    reasoning: string;
  }[];

  @Prop({ default: 'DeepSeek' })
  generatedBy: string;

  @Prop({ default: () => new Date() })
  adoptedAt: Date;

  @Prop([
    {
      date: String,
      tempMax: Number,
      tempMin: Number,
      description: String,
    },
  ])
  weatherSnapshot: {
    date: string;
    tempMax: number;
    tempMin: number;
    description: string;
  }[];

  @Prop([
    {
      date: String,
      room: String,
      count: Number,
    },
  ])
  reservationSnapshot: {
    date: string;
    room: string;
    count: number;
  }[];
}

export const CoolingPlanSchema = SchemaFactory.createForClass(CoolingPlan);
