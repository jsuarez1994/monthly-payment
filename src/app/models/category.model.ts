export class Category {
    uid: string;
    description: string;
    type: string;
    nature: string
  
    constructor(
      uid: string,
      description?: string,
      type?: string,
      nature?: string
    ) {
      this.uid = uid || '';
      this.description = description || '';
      this.type = type || '';
      this.nature = nature || '';
    }
  }
  