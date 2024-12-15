import { Budget, IBudget } from '../../models/budget.model';
import { DatabaseService } from '../database/database.service';

export class BudgetService {
    private static instance: BudgetService;
    private dbService: DatabaseService;

    private constructor() {
        this.dbService = DatabaseService.getInstance();
    }

    static getInstance(): BudgetService {
        if (!BudgetService.instance) {
            BudgetService.instance = new BudgetService();
        }
        return BudgetService.instance;
    }

    async createBudget(budget: IBudget): Promise<void> {
        await this.dbService.addDocument('budgets', budget);
    }

    async getUserBudgets(userId: string): Promise<Budget[]> {
        const budgets = await this.dbService.getDocuments('budgets', 'userId', userId);
        return budgets.map(b => new Budget(b as IBudget));
    }

    async updateBudgetSpending(budgetId: string, amount: number): Promise<void> {
        const budget = await this.dbService.getDocument('budgets', budgetId) as IBudget;
        budget.spent += amount;
        await this.dbService.updateDocument('budgets', budgetId, budget);
    }
}