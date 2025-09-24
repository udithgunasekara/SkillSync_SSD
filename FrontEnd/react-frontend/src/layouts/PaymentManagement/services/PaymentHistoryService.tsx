import { apiService } from '../../../services/ApiService';

interface Payment {
 
}

const REST_API_BASE_URL = '/payment';

export const listPayments = () => apiService.get(REST_API_BASE_URL);

// Explicitly specify the type of the payment parameter as Payment
export const makePayment = (payment: Payment) => apiService.post(REST_API_BASE_URL, payment);
