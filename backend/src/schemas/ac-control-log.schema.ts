import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AcControlLogDocument = AcControlLog & Document;

@Schema({ collection: 'ac_control_logs', timestamps: true })
export class AcControlLog {
  @Prop({ required: true })
  room: string;

  @Prop({ required: true, enum: ['on', 'off'] })
  action: string;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  scheduledAt: string;

  @Prop({ required: true })
  executedAt: Date;

  @Prop({ default: 'simulated' })
  mode: string;

  @Prop()
  coolingPlanId: string;

  @Prop({ default: 'success' })
  status: string;
}

export const AcControlLogSchema = SchemaFactory.createForClass(AcControlLog);
