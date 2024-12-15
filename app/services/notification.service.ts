import { LocalNotifications } from '@nativescript/local-notifications';
import { DatabaseService } from './database.service';

export class NotificationService {
    private static instance: NotificationService;
    private dbService: DatabaseService;

    private constructor() {
        this.dbService = DatabaseService.getInstance();
    }

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    async checkBudgetLimits(userId: string): Promise<void> {
        const transactions = await this.dbService.getTransactions(userId);
        const monthlyTotal = transactions
            .filter(t => t.type === 'expense' && t.date.getMonth() === new Date().getMonth())
            .reduce((sum, t) => sum + t.amount, 0);

        if (monthlyTotal > 5000) { // Example threshold
            await this.sendNotification({
                id: 1,
                title: 'Budget Alert',
                body: 'You have exceeded your monthly spending limit!'
            });
        }
    }

    private async sendNotification(notification: { id: number; title: string; body: string }): Promise<void> {
        try {
            await LocalNotifications.schedule([{
                id: notification.id,
                title: notification.title,
                body: notification.body,
                badge: 1
            }]);
        } catch (error) {
            console.error('Notification error:', error);
        }
    }
}