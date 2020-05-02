// TRANSLATE
import { TranslateService } from '@ngx-translate/core';

export class Literals {
  constructor(private translate: TranslateService) {}

  getLiterals(literals: string[]): Map<string, string> {
    let mapResult: Map<string, string> = new Map<string, string>();

    literals.forEach((literal) => {
      this.translate.get(literal).subscribe((data) => {
        mapResult.set(literal, data);
      });
    });
    return mapResult;
  }

  getMapModalDelete(){
    const deleteModal = this.getLiterals([
      'COMMONS.DELETE_OPERATION',
      'COMMONS.YES',
      'COMMONS.NO',
      'COMMONS.MESSAGE_DELETE_OPERATION',
      'COMMONS.DELETE_OPERATION_SUCCESS',
      'COMMONS.DELETE_OPERATION_SUCCESS_MESSAGE',
      'COMMONS.DELETE_OPERATION_CANCELED',
      'COMMONS.DELETE_OPERATION_CANCELED_MESSAGE',
    ]);

    let map: Map<string, string> = new Map<string, string>();

    map.set('title', deleteModal.get('COMMONS.DELETE_OPERATION'));
    map.set('textButtonYes', deleteModal.get('COMMONS.YES'));
    map.set('textButtonNo', deleteModal.get('COMMONS.NO'));
    map.set('message', deleteModal.get('COMMONS.MESSAGE_DELETE_OPERATION'));
    map.set(
      'titleOpSuccess',
      deleteModal.get('COMMONS.DELETE_OPERATION_SUCCESS')
    );
    map.set(
      'messageOpSuccess',
      deleteModal.get('COMMONS.DELETE_OPERATION_SUCCESS_MESSAGE')
    );
    map.set(
      'titleOpCanceled',
      deleteModal.get('COMMONS.DELETE_OPERATION_CANCELED')
    );
    map.set(
      'messageOpCanceled',
      deleteModal.get('COMMONS.DELETE_OPERATION_CANCELED_MESSAGE')
    );

    return map;
  }
}
