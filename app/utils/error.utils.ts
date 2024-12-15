export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export function handleError(error: any): AppError {
    if (error instanceof AppError) {
        return error;
    }

    // Firebase error handling
    if (error.code) {
        switch (error.code) {
            case 'auth/user-not-found':
                return new AppError('User not found', 'AUTH_ERROR', error);
            case 'auth/wrong-password':
                return new AppError('Invalid password', 'AUTH_ERROR', error);
            default:
                return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR', error);
        }
    }

    return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR', error);
}