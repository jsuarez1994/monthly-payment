export class Category {
    uid: string;
    description: string;
    type: number;
    nature: number;
  
    constructor(
      uid?: string,
      description?: string,
      type?: number,
      nature?: number
    ) {
      this.uid = uid || '';
      this.description = description || '';
      this.type = type || -1;
      this.nature = nature || -1;
    }
  }
  