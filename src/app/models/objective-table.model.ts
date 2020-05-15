export class ObjectiveTable
 {
    averageEntry: number;
    saving: number;
    savingInYear: number;
    personalExpensive: number;
    permanentExpensive: number;
  
    constructor(
        averageEntry?:number,
        porcentSaving?:number,
        porcentPaymentPermanent?:number,
        porcentPaymentPersonal?:number
    ) {
      this.averageEntry = averageEntry || 0;
      this.saving = averageEntry * (porcentSaving / 100) || 0;
      this.savingInYear = this.saving * 12 || 0;
      this.personalExpensive = averageEntry * (porcentPaymentPersonal / 100) || 0;
      this.permanentExpensive = averageEntry * (porcentPaymentPermanent / 100) || 0;
    }
  }
