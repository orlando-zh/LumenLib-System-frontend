import { booksApi } from '@/api/axiosConfig';
import type { ActiveLoan } from '@/api/interfaces/loans.interface';

export default {
    async getActiveLoans(): Promise<ActiveLoan[]> {
        const response = await booksApi.get<ActiveLoan[]>('/api/library/loans/active');
        return response.data;
    }
};
