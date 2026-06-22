import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema({ collection: 'reservations', timestamps: true })
export class Reservation {
  @Prop({ required: true })
  seatId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Room' })
  roomId: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  timeSlot: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ enum: ['confirmed', 'cancelled'], default: 'confirmed' })
  status: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
