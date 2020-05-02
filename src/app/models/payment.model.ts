export class Payment {
  uid: string;
  period: string;
  quantity: number;
  description: string;
  type: string;
  nature: string

  constructor(
    uid?: string,
    period?: string,
    quantity?: number,
    description?: string,
    type?: string,
    nature?: string
  ) {
    this.uid = uid || '';
    this.period = period || '';
    this.quantity = quantity || 0;
    this.description = description || '';
    this.type = type || '';
    this.nature = nature || '';
  }
}
