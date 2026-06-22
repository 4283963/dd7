import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation } from '../schemas/reservation.schema';

@Injectable()
export class ReservationsService {
  constructor(@InjectModel(Reservation.name) private reservationModel: Model<Reservation>) {}

  async findByDate(date: string): Promise<Reservation[]> {
    return this.reservationModel.find({ date, status: 'confirmed' }).exec();
  }

  async create(data: Partial<Reservation>): Promise<Reservation> {
    const created = new this.reservationModel(data);
    return created.save();
  }

  async cancel(id: string): Promise<Reservation | null> {
    return this.reservationModel.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true }).exec();
  }

  async countByDateRange(startDate: string, endDate: string): Promise<{ date: string; roomId: string; count: number }[]> {
    const result = await this.reservationModel.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: 'confirmed',
        },
      },
      {
        $group: {
          _id: { date: '$date', roomId: '$roomId' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          date: '$_id.date',
          roomId: '$_id.roomId',
          count: 1,
          _id: 0,
        },
      },
    ]);
    return result;
  }

  async seedReservations(): Promise<void> {
    const count = await this.reservationModel.countDocuments();
    if (count > 0) return;

    const today = new Date();
    const reservations = [];
    const timeSlots = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

    for (let d = 0; d < 3; d++) {
      const dateStr = new Date(today.getTime() + d * 86400000).toISOString().split('T')[0];
      for (const slot of timeSlots) {
        for (let i = 0; i < 3 + Math.floor(Math.random() * 5); i++) {
          const roomIdx = Math.floor(Math.random() * 3);
          const seatNum = Math.floor(Math.random() * 12) + 1;
          const roomIdMap = ['A101', 'A102', 'B201'];
          reservations.push({
            seatId: `${roomIdMap[roomIdx]}-${String(seatNum).padStart(2, '0')}`,
            roomId: roomIdMap[roomIdx],
            date: dateStr,
            timeSlot: slot,
            userId: `user_${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
            status: 'confirmed',
          });
        }
      }
    }

    await this.reservationModel.insertMany(reservations);
  }
}
