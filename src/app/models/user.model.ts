export class User {
  private uid: string;
  private name: string;
  private surname: string;
  private document: string;
  private mail: string;
  private password: string;

  constructor(
    name: string,
    surname: string,
    document: string,
    mail: string,
    password: string
  ) {
    this.name = name;
    this.surname = surname;
    this.document = document;
    this.mail = mail;
    this.password = password;
  }
}
