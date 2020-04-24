export class User {
  private uid: string;
  private period: string;
  private quantity: number;
  private description: string;
  private type: string;

  constructor(
    period: string,
    quantity: number,
    description: string,
    type: string
  ) {
    this.period = period;
    this.quantity = quantity;
    this.description = description;
    this.type = type;
  }
}
