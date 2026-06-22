import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from '../schemas/room.schema';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async findAll(): Promise<Room[]> {
    return this.roomModel.find().exec();
  }

  async seedRooms(): Promise<void> {
    const count = await this.roomModel.countDocuments();
    if (count > 0) return;

    const rooms = [
      {
        name: 'A101',
        acEnabled: true,
        seats: Array.from({ length: 12 }, (_, i) => ({
          id: `A101-${String(i + 1).padStart(2, '0')}`,
          label: `A${i + 1}`,
          status: i < 3 ? 'occupied' : 'available',
        })),
      },
      {
        name: 'A102',
        acEnabled: true,
        seats: Array.from({ length: 10 }, (_, i) => ({
          id: `A102-${String(i + 1).padStart(2, '0')}`,
          label: `B${i + 1}`,
          status: i < 5 ? 'occupied' : 'available',
        })),
      },
      {
        name: 'B201',
        acEnabled: true,
        seats: Array.from({ length: 8 }, (_, i) => ({
          id: `B201-${String(i + 1).padStart(2, '0')}`,
          label: `C${i + 1}`,
          status: i < 2 ? 'occupied' : 'available',
        })),
      },
      {
        name: 'B202',
        acEnabled: false,
        seats: Array.from({ length: 8 }, (_, i) => ({
          id: `B202-${String(i + 1).padStart(2, '0')}`,
          label: `D${i + 1}`,
          status: 'maintenance',
        })),
      },
    ];

    await this.roomModel.insertMany(rooms);
  }
}
