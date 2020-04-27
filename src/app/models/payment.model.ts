export class Payment {
  uid: string;
  period: string;
  quantity: number;
  description: string;
  type: string;
  nature: string

  constructor(
    period: string,
    quantity: number,
    description: string,
    type: string,
    nature: string
  ) {
    this.period = period;
    this.quantity = quantity;
    this.description = description;
    this.type = type;
    this.nature = nature;
  }
}
