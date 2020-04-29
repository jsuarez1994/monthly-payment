export class InformationPayment
 {
    allGains: number;
    porcentPermanent: number;
    porcentPersonal: number;
  
    constructor(
        allGains: number,
        porcentPermanent: number,
        porcentPersonal: number
    ) {
      this.allGains = allGains;
      this.porcentPermanent = porcentPermanent;
      this.porcentPersonal = porcentPersonal;
    }
  }
  