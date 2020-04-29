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