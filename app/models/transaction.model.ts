export interface ITransaction {
    id: string;
    amount: number;
    category: string;
    date: Date;
    description: string;
    type: 'expense' | 'income';
    userId: string;
    paymentMethod: string;
    location?: string;
    tags?: string[];
}

export class Transaction implements ITransaction {
    id: string;
    amount: number;
    category: string;
    date: Date;
    description: string;
    type: 'expense' | 'income';
    userId: string;
    paymentMethod: string;
    location?: string;
    tags?: string[];

    constructor(data: ITransaction) {
        Object.assign(this, data);
        this.date = new Date(data.date);
    }
}