export class User {
  uid: string;
  name: string;
  surname: string;
  document: string;
  email: string;
  password: string;

  constructor(
    name: string,
    surname: string,
    document: string,
    email: string,
    password: string
  ) {
    this.name = name;
    this.surname = surname;
    this.document = document;
    this.email = email;
    this.password = password;
  }
}
