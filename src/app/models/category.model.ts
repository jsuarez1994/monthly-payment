export class Category {
    uid: string;
    description: string;
    type: string;
    nature: string
  
    constructor(
      description: string,
      type: string,
      nature: string
    ) {
      this.description = description;
      this.type = type;
      this.nature = nature;
    }
  }
  