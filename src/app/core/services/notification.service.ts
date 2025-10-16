import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notifications = signal<Notification[]>([]);
  readonly notifications$ = this.notifications.asReadonly();

  success(message: string, duration = 5000): void {
    this.show('success', message, duration);
  }

  error(message: string, duration = 7000): void {
    this.show('error', message, duration);
  }

  warning(message: string, duration = 6000): void {
    this.show('warning', message, duration);
  }

  info(message: string, duration = 5000): void {
    this.show('info', message, duration);
  }

  private show(type: Notification['type'], message: string, duration: number): void {
    const id = this.generateId();
    const notification: Notification = { id, type, message, duration };

    this.notifications.update((notifications) => [...notifications, notification]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  remove(id: string): void {
    this.notifications.update((notifications) =>
      notifications.filter((notification) => notification.id !== id)
    );
  }

  clear(): void {
    this.notifications.set([]);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
