export class Payment {
  uid: string;
  period: string;
  quantity: number;
  description: string;
  type: number;
  nature: number;

  constructor(
    uid?: string,
    period?: string,
    quantity?: number,
    description?: string,
    type?: number,
    nature?: number
  ) {
    this.uid = uid || '';
    this.period = period || '';
    this.quantity = quantity || 0;
    this.description = description || '';
    this.type = type || -1;
    this.nature = nature || -1;
  }
}
