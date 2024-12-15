export interface IBudget {
    id: string;
    category: string;
    limit: number;
    spent: number;
    userId: string;
    startDate: Date;
    endDate: Date;
}

export class Budget implements IBudget {
    id: string;
    category: string;
    limit: number;
    spent: number;
    userId: string;
    startDate: Date;
    endDate: Date;

    constructor(data: IBudget) {
        Object.assign(this, data);
        this.startDate = new Date(data.startDate);
        this.endDate = new Date(data.endDate);
    }

    get remainingAmount(): number {
        return this.limit - this.spent;
    }

    get percentageUsed(): number {
        return (this.spent / this.limit) * 100;
    }
}