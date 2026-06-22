export interface Seat {
  id: string;
  label: string;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface Room {
  _id: string;
  name: string;
  acEnabled: boolean;
  seats: Seat[];
}

export interface Reservation {
  _id: string;
  seatId: string;
  roomId: string;
  date: string;
  timeSlot: string;
  userId: string;
  status: 'confirmed' | 'cancelled';
}

export interface WeatherInfo {
  date: string;
  tempMax: number;
  tempMin: number;
  description: string;
}

export interface CoolingStrategy {
  room: string;
  schedule: { on: string; off: string };
  temperature: number;
  reasoning: string;
}

export interface CoolingPlan {
  _id: string;
  strategies: CoolingStrategy[];
  generatedBy: string;
  adoptedAt: string;
  weatherSnapshot: WeatherInfo[];
  reservationSnapshot: { date: string; room: string; count: number }[];
}

export interface AiStrategyResponse {
  strategies: CoolingStrategy[];
  weather: WeatherInfo[];
  reservationSummary: { date: string; room: string; count: number }[];
}
