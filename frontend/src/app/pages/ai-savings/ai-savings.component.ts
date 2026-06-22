import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiStrategyService } from '../../core/services/ai-strategy.service';
import { WeatherService } from '../../core/services/weather.service';
import { CoolingPlanService } from '../../core/services/cooling-plan.service';
import { WeatherInfo, CoolingStrategy, CoolingPlan, AiStrategyResponse } from '../../core/models/interfaces';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-ai-savings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatProgressBarModule, MatSnackBarModule, MatExpansionModule, MatTooltipModule],
  templateUrl: './ai-savings.component.html',
  styleUrl: './ai-savings.component.scss'
})
export class AiSavingsComponent implements OnInit {
  weather: WeatherInfo[] = [];
  strategies: CoolingStrategy[] = [];
  coolingPlans: CoolingPlan[] = [];
  reservationSummary: { date: string; room: string; count: number }[] = [];
  generating = false;
  loading = true;

  constructor(
    private aiStrategyService: AiStrategyService,
    private weatherService: WeatherService,
    private coolingPlanService: CoolingPlanService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loading = true;
    this.weatherService.getForecast(3).subscribe({
      next: (w) => { this.weather = w; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.coolingPlanService.getAll().subscribe({
      next: (plans) => (this.coolingPlans = plans),
      error: () => (this.coolingPlans = [])
    });
  }

  generateStrategy(): void {
    this.generating = true;
    this.strategies = [];
    this.aiStrategyService.generate().subscribe({
      next: (res: AiStrategyResponse) => {
        this.strategies = res.strategies;
        this.weather = res.weather;
        this.reservationSummary = res.reservationSummary;
        this.generating = false;
      },
      error: () => {
        this.generating = false;
        this.snackBar.open('生成策略失败，请重试', '关闭', { duration: 3000 });
      }
    });
  }

  adoptStrategy(): void {
    if (this.strategies.length === 0) return;
    const plan: Partial<CoolingPlan> = {
      strategies: this.strategies,
      generatedBy: 'DeepSeek',
      adoptedAt: new Date().toISOString(),
      weatherSnapshot: this.weather,
      reservationSnapshot: this.reservationSummary
    };
    this.coolingPlanService.adopt(plan).subscribe({
      next: (saved) => {
        this.coolingPlans.unshift(saved);
        this.snackBar.open('策略已采纳并保存', '关闭', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('保存失败，请重试', '关闭', { duration: 3000 });
      }
    });
  }

  getWeatherIcon(desc: string): string {
    if (desc.includes('晴')) return 'wb_sunny';
    if (desc.includes('云') || desc.includes('阴')) return 'cloud';
    if (desc.includes('雨')) return 'grain';
    if (desc.includes('雪')) return 'ac_unit';
    return 'cloud_queue';
  }

  getWeatherColor(desc: string): string {
    if (desc.includes('晴')) return '#f97316';
    if (desc.includes('云')) return '#64748b';
    if (desc.includes('雨')) return '#3b82f6';
    return '#94a3b8';
  }

  getTotalReservations(): number {
    return this.reservationSummary.reduce((sum, r) => sum + r.count, 0);
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${d.getMonth() + 1}/${d.getDate()} ${weekdays[d.getDay()]}`;
  }
}
