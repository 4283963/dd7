import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { AcControlLogService } from '../ac-control-log/ac-control-log.service';
import { CoolingStrategy } from '../ai-strategy/ai-strategy.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private acControlLogService: AcControlLogService,
  ) {}

  registerStrategies(strategies: CoolingStrategy[], coolingPlanId: string): void {
    for (const strategy of strategies) {
      this.registerCronJob(strategy, 'on', coolingPlanId);
      this.registerCronJob(strategy, 'off', coolingPlanId);
    }
  }

  removeStrategies(strategies: CoolingStrategy[]): void {
    for (const strategy of strategies) {
      this.removeCronJob(strategy, 'on');
      this.removeCronJob(strategy, 'off');
    }
  }

  private registerCronJob(strategy: CoolingStrategy, action: 'on' | 'off', coolingPlanId: string): void {
    const timeStr = action === 'on' ? strategy.schedule.on : strategy.schedule.off;
    const jobName = this.getJobName(strategy.room, action);

    try {
      const existing = this.schedulerRegistry.getCronJob(jobName);
      if (existing) {
        existing.stop();
        this.schedulerRegistry.deleteCronJob(jobName);
      }
    } catch {}

    const cronExpression = this.timeToCron(timeStr);
    if (!cronExpression) {
      this.logger.warn(`跳过无效时间: ${strategy.room} ${action} @ ${timeStr}`);
      return;
    }

    const job = new CronJob(cronExpression, () => {
      this.executeControl(strategy, action, coolingPlanId, timeStr);
    });

    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();

    this.logger.log(`已注册定时任务: ${jobName} → ${cronExpression} (${action === 'on' ? '开机' : '关机'})`);
  }

  private removeCronJob(strategy: CoolingStrategy, action: 'on' | 'off'): void {
    const jobName = this.getJobName(strategy.room, action);
    try {
      const job = this.schedulerRegistry.getCronJob(jobName);
      if (job) {
        job.stop();
        this.schedulerRegistry.deleteCronJob(jobName);
        this.logger.log(`已移除定时任务: ${jobName}`);
      }
    } catch {}
  }

  private async executeControl(strategy: CoolingStrategy, action: 'on' | 'off', coolingPlanId: string, scheduledAt: string): Promise<void> {
    const temperature = action === 'on' ? strategy.temperature : 0;
    const actionLabel = action === 'on' ? '开机' : '关机';

    this.logger.log(`🔌 空调控制指令: ${strategy.room} ${actionLabel} ${action === 'on' ? `温度${temperature}°C` : ''}`);

    try {
      await this.acControlLogService.create({
        room: strategy.room,
        action,
        temperature,
        scheduledAt,
        executedAt: new Date(),
        mode: 'simulated',
        coolingPlanId,
        status: 'success',
      });
      this.logger.log(`✅ 控制日志已记录: ${strategy.room} ${actionLabel}`);
    } catch (err) {
      this.logger.error(`❌ 控制日志写入失败: ${strategy.room} ${actionLabel}`, err);
    }
  }

  private getJobName(room: string, action: string): string {
    return `ac_${room}_${action}`;
  }

  private timeToCron(timeStr: string): string | null {
    const parts = timeStr.split(':');
    if (parts.length !== 2) return null;

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null;
    }

    return `${minutes} ${hours} * * *`;
  }

  getActiveJobs(): string[] {
    return this.schedulerRegistry.getCronJobs()
      ? Array.from(this.schedulerRegistry.getCronJobs().keys())
      : [];
  }
}
