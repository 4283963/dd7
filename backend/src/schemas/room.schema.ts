import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema({ collection: 'rooms', timestamps: true })
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop({ default: true })
  acEnabled: boolean;

  @Prop([
    {
      id: String,
      label: String,
      status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
    },
  ])
  seats: { id: string; label: string; status: string }[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
