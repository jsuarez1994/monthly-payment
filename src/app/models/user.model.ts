export class User {
  private uid: string;
  private name: string;
  private surname: string;
  private document: string;
  private email: string;
  private password: string;

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
