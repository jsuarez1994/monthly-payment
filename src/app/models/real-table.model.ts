export class RealTable
 {
    period: string;
    monthGains: number;
    plusGains: number;//real - objetive
    monthSaveObjective: number;
    monthSaveReal: number;
    monthPersonalExpensiveObjective: number;
    monthPersonalExpensiveReal: number;
    monthPermanentExpensiveObjective: number;
    monthPermanentExpensiveReal: number;

    constructor(
        period?:string,
        monthGains?:number,
        plusGains?:number,
        monthSaveReal?:number,
        monthPersonalExpensiveReal?:number,
        monthPermanentExpensiveReal?:number,
        porcentSaving?:number,
        porcentPermanent?:number,
        porcentPersonal?:number
    ) {
        this.period = period || '';
        this.monthGains = monthGains || 0;
        this.plusGains = plusGains || 0;
        this.monthSaveObjective = this.monthGains * (porcentSaving / 100) || 0;
        this.monthSaveReal = monthSaveReal || 0;
        this.monthPersonalExpensiveObjective = this.monthGains * (porcentPersonal / 100) || 0;
        this.monthPersonalExpensiveReal = monthPersonalExpensiveReal || 0;
        this.monthPermanentExpensiveObjective = this.monthGains * (porcentPermanent / 100) || 0;
        this.monthPermanentExpensiveReal = monthPermanentExpensiveReal || 0;
    }
  }
  