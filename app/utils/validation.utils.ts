export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validateAmount(amount: number): boolean {
    return amount > 0 && Number.isFinite(amount);
}

export function validateDateRange(startDate: Date, endDate: Date): boolean {
    return startDate < endDate;
}

export function validateRequired(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
}