import { Transaction, ITransaction } from '../../models/transaction.model';
import { DatabaseService } from '../database/database.service';
import { BudgetService } from '../budget/budget.service';

export class TransactionService {
    private static instance: TransactionService;
    private dbService: DatabaseService;
    private budgetService: BudgetService;

    private constructor() {
        this.dbService = DatabaseService.getInstance();
        this.budgetService = BudgetService.getInstance();
    }

    static getInstance(): TransactionService {
        if (!TransactionService.instance) {
            TransactionService.instance = new TransactionService();
        }
        return TransactionService.instance;
    }

    async addTransaction(transaction: ITransaction): Promise<void> {
        const id = await this.dbService.addDocument('transactions', transaction);
        if (transaction.type === 'expense') {
            const budgets = await this.budgetService.getUserBudgets(transaction.userId);
            const budget = budgets.find(b => b.category === transaction.category);
            if (budget) {
                await this.budgetService.updateBudgetSpending(budget.id, transaction.amount);
            }
        }
    }

    async getUserTransactions(userId: string): Promise<Transaction[]> {
        const transactions = await this.dbService.getDocuments('transactions', 'userId', userId);
        return transactions.map(t => new Transaction(t as ITransaction));
    }
}