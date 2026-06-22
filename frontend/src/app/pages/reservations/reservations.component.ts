import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../core/services/room.service';
import { ReservationService } from '../../core/services/reservation.service';
import { Room, Reservation } from '../../core/models/interfaces';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatProgressBarModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit {
  rooms: Room[] = [];
  reservations: Reservation[] = [];
  selectedDate: Date = new Date();
  loading = true;

  constructor(
    private roomService: RoomService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onDateChange(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    const dateStr = this.selectedDate.toISOString().split('T')[0];
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
    this.reservationService.getByDate(dateStr).subscribe({
      next: (reservations) => (this.reservations = reservations),
      error: () => (this.reservations = [])
    });
  }

  getOccupiedCount(room: Room): number {
    return room.seats.filter(s => s.status === 'occupied').length;
  }

  getOccupancyRate(room: Room): number {
    if (room.seats.length === 0) return 0;
    return (this.getOccupiedCount(room) / room.seats.length) * 100;
  }

  getTotalReservations(): number {
    return this.reservations.length;
  }

  getTotalOccupied(): number {
    return this.rooms.reduce((sum, r) => sum + this.getOccupiedCount(r), 0);
  }

  getTotalSeats(): number {
    return this.rooms.reduce((sum, r) => sum + r.seats.length, 0);
  }

  getSeatStatusClass(status: string): string {
    switch (status) {
      case 'occupied': return 'seat-occupied';
      case 'maintenance': return 'seat-maintenance';
      default: return 'seat-available';
    }
  }

  getSeatIcon(status: string): string {
    switch (status) {
      case 'occupied': return 'person';
      case 'maintenance': return 'build';
      default: return 'event_seat';
    }
  }
}
