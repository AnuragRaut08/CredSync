export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

export function calculatePercentage(value: number, total: number): number {
    return total === 0 ? 0 : (value / total) * 100;
}