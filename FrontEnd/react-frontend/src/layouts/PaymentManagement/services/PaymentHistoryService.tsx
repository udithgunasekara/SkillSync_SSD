import axios from "axios";


interface Payment {
 
}

const REST_API_BASE_URL = 'http://localhost:8082/payment';

export const listPayments = () => axios.get(REST_API_BASE_URL);

// Explicitly specify the type of the payment parameter as Payment
export const makePayment = (payment: Payment) => axios.post(REST_API_BASE_URL, payment);
