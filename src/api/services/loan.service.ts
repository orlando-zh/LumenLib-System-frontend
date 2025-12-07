import { booksApi } from '@/api/axiosConfig';
import type { ActiveLoan, LoanTransactionDTO } from '@/api/interfaces/loans.interface';

export default {
    async getActiveLoans(): Promise<ActiveLoan[]> {
        const response = await booksApi.get<ActiveLoan[]>('/api/library/loans/active');
        return response.data;
    },



    async returnLoanById(prestamoId: number) {
        const response = await booksApi.put(`/api/library/loans/return/${prestamoId}`);
        return response.data;
    },

    async createLoan(data: LoanTransactionDTO) {
        const response = await booksApi.post('/api/library/loans', data);
        return response.data;
    }
};


