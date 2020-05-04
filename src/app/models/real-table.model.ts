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
        monthPermanentExpensiveReal?:number
    ) {
        this.period = period || '';
        this.monthGains = monthGains || 0;
        this.plusGains = plusGains || 0;
        this.monthSaveObjective = this.monthGains * 0.2 || 0;
        this.monthSaveReal = monthSaveReal || 0;
        this.monthPersonalExpensiveObjective = this.monthGains * 0.3 || 0;
        this.monthPersonalExpensiveReal = monthPersonalExpensiveReal || 0;
        this.monthPermanentExpensiveObjective = this.monthGains * 0.5 || 0;
        this.monthPermanentExpensiveReal = monthPermanentExpensiveReal || 0;
    }
  }
  