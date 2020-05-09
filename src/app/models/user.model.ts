export class User {
  uid: string;
  name: string;
  surname: string;
  document: string;
  email: string;
  password: string;
  porcentPaymentPermanent: number;
  porcentPaymentPersonal: number;
  porcentSaving: number;

  constructor(
    name: string,
    surname: string,
    document: string,
    email: string,
    password: string,
    porcentPaymentPermanent,
    porcentPaymentPersonal,
    porcentSaving
  ) {
    this.name = name;
    this.surname = surname;
    this.document = document;
    this.email = email;
    this.password = password;
    this.porcentPaymentPermanent = porcentPaymentPermanent;
    this.porcentPaymentPersonal = porcentPaymentPersonal;
    this.porcentSaving = porcentSaving;
  }
}
