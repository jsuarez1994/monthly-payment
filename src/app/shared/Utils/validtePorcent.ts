
export function validatePorcent(mapPorcent: Map<string, number>): string[] {

    const messagesFormat = validateFormat(mapPorcent);
    const messagesValues = validateValues(mapPorcent);

    if (messagesFormat.length === 0) {
        if (messagesValues.length === 0) {
            return [];
        } else {
            return messagesValues;
        }
    } else {
        return messagesFormat;
    }
}

function validateFormat(map: Map<string, number>): string[] {
    const porcentPaymentPermanent = map.get('porcentPaymentPermanent');
    const porcentPaymentPersonal = map.get('porcentPaymentPersonal');
    const porcentSaving = map.get('porcentSaving');


    const sumPorcents =
      porcentPaymentPermanent +
      porcentPaymentPersonal +
      porcentSaving;

    if (sumPorcents > 100) {
      return [
        'COMMONS.ERROR_PORCENT_TITLE',
        'COMMONS.ERROR_PORCENT_MORE_THAN_ONE_HUNDRED',
      ];
    } else if (sumPorcents < 100) {
      return [
        'COMMONS.ERROR_PORCENT_TITLE',
        'COMMONS.ERROR_PORCENT_LESS_THAN_ONE_HUNDRED',
      ];
    } else {
      return [];
    }
}


function validateValues(map: Map<string, number>): string[] {

    const porcentPaymentPermanent = map.get('porcentPaymentPermanent');
    const porcentPaymentPersonal = map.get('porcentPaymentPersonal');
    const porcentSaving = map.get('porcentSaving');

    if (porcentPaymentPermanent > 50) {
        return [
            'COMMONS.ERROR_PORCENT_TITLE',
            'COMMONS.ERROR_PORCENT_PERMANENT_MORE_THAN_FIFTY',
        ];
    } else if (porcentPaymentPersonal > 30) {
        return [
            'COMMONS.ERROR_PORCENT_TITLE',
            'COMMONS.ERROR_PORCENT_PERSONAL_MORE_THAN_THITY',
        ];
    } else if (porcentSaving < 20) {
        return [
            'COMMONS.ERROR_PORCENT_TITLE',
            'COMMONS.ERROR_PORCENT_SAVING_LESS_THAN_TWENTY',
        ];
    } else {
        return [];
    }
}
