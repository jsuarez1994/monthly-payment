/**
 * Set correct form period
 * @param month
 * @param year
 */
export function setPeriod(month: number, year: number) {
  console.log('### Set Period ###');
  const monthPeriod = month < 10 ? String('0' + month) : String(month);
  const yearPeriod = String(year);

  return yearPeriod.concat(monthPeriod).trim();
}

/**
 * Set correct form period current date
 */
export function currentDate() {
    console.log('### currentDate ###');
    const today = new Date();
    const monthPeriod = today.getMonth()+1;
    const yearPeriod = today.getFullYear();

    return setPeriod(monthPeriod, yearPeriod);
}

/**
 * Export Period to MM/YYYY (list)
 * @param periods 
 */
export function periodToDate(periods: string[]): string[] {
  let dates: string[] = [];
  periods.forEach(period => {
    let year = period.substr(0,4);
    let month = period.substr(4,6);
    dates.push(month.concat('/').concat(year));
  });
  return dates;
}

/**
 * Export period yo YYYY (list)
 * @param periods 
 */
export function periodToYears(periods: string[]): string[] {
  let years: string[] = [];

  periods.forEach(period => {
    years.push(period.substr(0,4));
  })

  return years;
}

/**
 * Export period to MM (list)
 * @param periods 
 */
export function periodToMonths(periods: string[]): string[] {
  let months: string[] = [];

  periods.forEach(period => {
    months.push(period.substr(4,6));
  })

  return months;
}

/**
 * Export period to YYYY (item)
 * @param period 
 */
export function getYearByPeriod(period: string): string{
  return period.substr(0,4);
}

/**
 * Export period to MM (item)
 * @param period 
 */
export function getMonthByPeriod(period: string): string{
  return period.substr(4,6);
}

/**
 * List elements not repeat
 * @param list 
 */
export function listStringNotRepeat(list: string[]) {
  return list.filter(function(elem, index, self) {return index === self.indexOf(elem)});
}
