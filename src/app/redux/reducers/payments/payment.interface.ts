// MODELS
import { Payment } from '../../../models/payment.model';

export interface PaymentState {
  payments: Payment[];
  loaded: boolean;
  error: any;
}
