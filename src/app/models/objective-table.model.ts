export class ObjectiveTable
 {
    averageEntry: number;
    saving: number;
    savingInYear: number;
    personalExpensive: number;
    permanentExpensive: number;
  
    constructor(
        averageEntry?:number
    ) {
      this.averageEntry = averageEntry || 0;
      this.saving = averageEntry * 0.2 || 0;
      this.savingInYear = this.saving*12 || 0;
      this.personalExpensive = averageEntry * 0.3 || 0;
      this.permanentExpensive = averageEntry * 0.5 || 0;
    }
  }
  