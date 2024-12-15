import { Observable } from '@nativescript/core';
import { AnalyticsService } from '../services/analytics.service';
import { Transaction } from '../models/transaction.model';
import { handleError } from '../utils/error.utils';

export class AnalyticsViewModel extends Observable {
    private analyticsService: AnalyticsService;
    private _spendingTrends: any[] = [];
    private _categorySpending: Map<string, number> = new Map();
    private _insights: any[] = [];

    constructor(private userId: string) {
        super();
        this.analyticsService = AnalyticsService.getInstance();
        this.loadAnalytics();
    }

    get spendingTrends(): any[] {
        return this._spendingTrends;
    }

    get categorySpending(): any[] {
        return Array.from(this._categorySpending, ([category, amount]) => ({
            category,
            amount
        }));
    }

    get insights(): any[] {
        return this._insights;
    }

    private async loadAnalytics(): Promise<void> {
        try {
            const [categorySpending, monthlySpending, trends] = await Promise.all([
                this.analyticsService.getSpendingByCategory(this.userId),
                this.analyticsService.getMonthlySpending(this.userId),
                this.analyticsService.analyzeTrends(this.userId)
            ]);

            this._categorySpending = categorySpending;
            this._spendingTrends = this.formatTrendsData(monthlySpending);
            this._insights = this.generateInsights(trends);

            this.notifyPropertyChange('categorySpending', this.categorySpending);
            this.notifyPropertyChange('spendingTrends', this._spendingTrends);
            this.notifyPropertyChange('insights', this._insights);
        } catch (error) {
            throw handleError(error);
        }
    }

    private formatTrendsData(monthlySpending: Map<string, number>): any[] {
        return Array.from(monthlySpending, ([date, amount]) => ({
            date,
            amount
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    private generateInsights(trends: any): any[] {
        const insights = [];
        
        // Add spending pattern insights
        if (trends.weekdaySpending) {
            const highestDay = Object.entries(trends.weekdaySpending)
                .reduce((a, b) => b[1] > a[1] ? b : a);
            
            insights.push({
                title: 'Spending Pattern',
                description: `You tend to spend more on ${this.getDayName(parseInt(highestDay[0]))}`
            });
        }

        return insights;
    }

    private getDayName(day: number): string {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
    }
}