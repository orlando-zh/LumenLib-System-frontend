import { booksApi } from '@/api/axiosConfig';
import type { ActiveLoan, LoanHistory, LoanTransactionDTO, LoanCreatedResponse } from '@/api/interfaces/loans.interface';

export default {
    async getActiveLoans(): Promise<ActiveLoan[]> {
        const response = await booksApi.get<ActiveLoan[]>('/api/library/loans/active');
        return response.data;
    },



    async returnLoanById(prestamoId: number) {
        const response = await booksApi.put(`/api/library/loans/return/${prestamoId}`);
        return response.data;
    },

    async createLoan(data: LoanTransactionDTO): Promise<LoanCreatedResponse> {
        const response = await booksApi.post<LoanCreatedResponse>('/api/library/loans', data);
        return response.data;
    },


    async getMyLoanHistory(): Promise<LoanHistory[]> {
        const response = await booksApi.get<LoanHistory[]>('/api/library/loans/my-history');
        return response.data;
    }
};


