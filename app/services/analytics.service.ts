import { DatabaseService } from './database.service';
import { Transaction } from '../models/transaction.model';

export class AnalyticsService {
    private static instance: AnalyticsService;
    private dbService: DatabaseService;

    private constructor() {
        this.dbService = DatabaseService.getInstance();
    }

    static getInstance(): AnalyticsService {
        if (!AnalyticsService.instance) {
            AnalyticsService.instance = new AnalyticsService();
        }
        return AnalyticsService.instance;
    }

    async getSpendingByCategory(userId: string): Promise<Map<string, number>> {
        const transactions = await this.dbService.getTransactions(userId);
        const categorySpending = new Map<string, number>();

        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                const current = categorySpending.get(t.category) || 0;
                categorySpending.set(t.category, current + t.amount);
            });

        return categorySpending;
    }

    async getMonthlySpending(userId: string): Promise<Map<string, number>> {
        const transactions = await this.dbService.getTransactions(userId);
        const monthlySpending = new Map<string, number>();

        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                const monthYear = `${t.date.getMonth() + 1}/${t.date.getFullYear()}`;
                const current = monthlySpending.get(monthYear) || 0;
                monthlySpending.set(monthYear, current + t.amount);
            });

        return monthlySpending;
    }

    async analyzeTrends(userId: string): Promise<any> {
        const transactions = await this.dbService.getTransactions(userId);
        // Implement ML-based trend analysis here
        return this.basicTrendAnalysis(transactions);
    }

    private basicTrendAnalysis(transactions: Transaction[]): any {
        const weekdaySpending = new Map<number, number>();
        const hourlySpending = new Map<number, number>();

        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                const weekday = t.date.getDay();
                const hour = t.date.getHours();

                weekdaySpending.set(weekday, (weekdaySpending.get(weekday) || 0) + t.amount);
                hourlySpending.set(hour, (hourlySpending.get(hour) || 0) + t.amount);
            });

        return {
            weekdaySpending: Object.fromEntries(weekdaySpending),
            hourlySpending: Object.fromEntries(hourlySpending)
        };
    }
}