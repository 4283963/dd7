import { Routes } from '@angular/router';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { AiSavingsComponent } from './pages/ai-savings/ai-savings.component';

export const routes: Routes = [
  { path: '', redirectTo: 'reservations', pathMatch: 'full' },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'ai-savings', component: AiSavingsComponent },
];
