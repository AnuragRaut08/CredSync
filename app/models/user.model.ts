import { Observable } from '@nativescript/core';

export interface IBudget {
    category: string;
    limit: number;
    spent: number;
}

export class User extends Observable {
    id: string;
    email: string;
    name: string;
    budgets: IBudget[];
    totalBalance: number;
    monthlyIncome: number;

    constructor(data: Partial<User>) {
        super();
        Object.assign(this, data);
        this.budgets = this.budgets || [];
    }
}