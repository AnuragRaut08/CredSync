import { Observable } from '@nativescript/core';
import { DatabaseService } from './services/database.service';
import { Transaction } from './models/transaction.model';

export class MainViewModel extends Observable {
    private databaseService: DatabaseService;
    private _transactions: Transaction[] = [];
    private _totalBalance: number = 1000; // Demo initial balance

    constructor() {
        super();
        this.databaseService = new DatabaseService();
        this.loadTransactions();
    }

    get transactions(): Transaction[] {
        return this._transactions;
    }

    get totalBalance(): string {
        return `$${this._totalBalance.toFixed(2)}`;
    }

    onAddTransaction() {
        // Demo transaction
        const newTransaction = new Transaction({
            id: Date.now().toString(),
            amount: 50,
            category: 'Food',
            date: new Date(),
            description: 'Lunch',
            type: 'expense'
        });

        this.databaseService.addTransaction(newTransaction);
        this._totalBalance -= newTransaction.amount;
        
        this.loadTransactions();
        this.notifyPropertyChange('totalBalance', this.totalBalance);
    }

    private loadTransactions() {
        this._transactions = this.databaseService.getTransactions();
        this.notifyPropertyChange('transactions', this._transactions);
    }
}