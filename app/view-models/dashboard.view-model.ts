import { Observable } from '@nativescript/core';
import { TransactionService } from '../services/transaction/transaction.service';
import { BudgetService } from '../services/budget/budget.service';
import { formatCurrency } from '../utils/currency.utils';
import { Transaction } from '../models/transaction.model';
import { Budget } from '../models/budget.model';
import { handleError } from '../utils/error.utils';

export class DashboardViewModel extends Observable {
    private transactionService: TransactionService;
    private budgetService: BudgetService;
    private _transactions: Transaction[] = [];
    private _budgets: Budget[] = [];
    private _totalBalance: number = 0;

    constructor(private userId: string) {
        super();
        this.transactionService = TransactionService.getInstance();
        this.budgetService = BudgetService.getInstance();
        this.loadData();
    }

    get transactions(): Transaction[] {
        return this._transactions;
    }

    get budgets(): Budget[] {
        return this._budgets;
    }

    get totalBalance(): string {
        return formatCurrency(this._totalBalance);
    }

    private async loadData(): Promise<void> {
        try {
            const [transactions, budgets] = await Promise.all([
                this.transactionService.getUserTransactions(this.userId),
                this.budgetService.getUserBudgets(this.userId)
            ]);

            this._transactions = transactions;
            this._budgets = budgets;
            this.calculateTotalBalance();
            
            this.notifyPropertyChange('transactions', this._transactions);
            this.notifyPropertyChange('budgets', this._budgets);
            this.notifyPropertyChange('totalBalance', this.totalBalance);
        } catch (error) {
            throw handleError(error);
        }
    }

    private calculateTotalBalance(): void {
        this._totalBalance = this._transactions.reduce((total, t) => {
            return total + (t.type === 'income' ? t.amount : -t.amount);
        }, 0);
    }
}