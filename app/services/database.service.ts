import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import { Transaction, ITransaction } from '../models/transaction.model';
import { User, IBudget } from '../models/user.model';

export class DatabaseService {
    private static instance: DatabaseService;
    private db = firebase.firestore();

    static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    async addTransaction(transaction: ITransaction): Promise<void> {
        try {
            await this.db.collection('transactions').add(transaction);
            await this.updateBudget(transaction);
        } catch (error) {
            console.error('Add transaction error:', error);
            throw error;
        }
    }

    async getTransactions(userId: string): Promise<Transaction[]> {
        try {
            const snapshot = await this.db
                .collection('transactions')
                .where('userId', '==', userId)
                .orderBy('date', 'desc')
                .get();

            return snapshot.docs.map(doc => new Transaction({ id: doc.id, ...doc.data() as ITransaction }));
        } catch (error) {
            console.error('Get transactions error:', error);
            throw error;
        }
    }

    private async updateBudget(transaction: ITransaction): Promise<void> {
        if (transaction.type !== 'expense') return;

        try {
            const userDoc = await this.db.collection('users').doc(transaction.userId).get();
            const userData = userDoc.data() as User;
            
            const budget = userData.budgets.find(b => b.category === transaction.category);
            if (budget) {
                budget.spent += transaction.amount;
                await userDoc.ref.update({ budgets: userData.budgets });
            }
        } catch (error) {
            console.error('Update budget error:', error);
            throw error;
        }
    }
}