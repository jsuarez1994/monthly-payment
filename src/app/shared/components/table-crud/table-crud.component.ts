import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// LITERALS
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
import { map } from 'rxjs/operators';
import { Literals } from '../../Utils/literals';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-table-crud',
  templateUrl: './table-crud.component.html',
  styles: [],
  providers: [ConfirmationService]
})
export class TableCrudComponent implements OnInit {

  @Input() list: any[];
  @Input() headers: any[];

  @Output() methodHistoric = new EventEmitter();
  @Output() methodAdd = new EventEmitter();
  @Output() methodUpdate = new EventEmitter();
  @Output() methodDelete = new EventEmitter();

  itemSelect: any;


  displayDialog: boolean;
  titleDialog: string;
  labelsDialog: string[];
  buttonAction: string;
  buttonCancel: string;
  itemDialog: any;

  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;

  constructor(private translate: TranslateService) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.displayDialog = false;
    this.buttonCancel = this.LiteralClass.getLiterals(['COMMONS.CANCEL_OPERATION_LABEL']).get('COMMONS.CANCEL_OPERATION_LABEL');
    this.itemDialog = {};
    this.labelsDialog = [];
    this.buttonAction = '';
  }

  /**
   * Translate values
   * @param key
   * @param column
   */
  translateColumn(key: number, column: string) {

    const mapNature: Map<number, string> = new Map<number, string>();
    const mapType: Map<number, string> = new Map<number, string>();

    // NATURE
    mapNature.set(Number(this.LiteralClass.getLiterals(['COMMONS.NATURE_GAIN_KEY']).get('COMMONS.NATURE_GAIN_KEY')),
                  this.LiteralClass.getLiterals(['COMMONS.NATURE_GAIN']).get('COMMONS.NATURE_GAIN'));
    mapNature.set(Number(this.LiteralClass.getLiterals(['COMMONS.NATURE_EXPENDITURE_KEY']).get('COMMONS.NATURE_EXPENDITURE_KEY')),
                  this.LiteralClass.getLiterals(['COMMONS.NATURE_EXPENDITURE']).get('COMMONS.NATURE_EXPENDITURE'));

    // TYPE
    mapType.set(Number(this.LiteralClass.getLiterals(['COMMONS.TYPE_PERSONAL_KEY']).get('COMMONS.TYPE_PERSONAL_KEY')),
                this.LiteralClass.getLiterals(['COMMONS.TYPE_PERSONAL']).get('COMMONS.TYPE_PERSONAL'));
    mapType.set(Number(this.LiteralClass.getLiterals(['COMMONS.TYPE_PERMANENT_KEY']).get('COMMONS.TYPE_PERMANENT_KEY')),
                this.LiteralClass.getLiterals(['COMMONS.TYPE_PERMANENT']).get('COMMONS.TYPE_PERMANENT'));

    return (column === 'nature') ? mapNature.get(key) : mapType.get(key);
  }

  hiddenDialog() {
    this.displayDialog = false;
    this.labelsDialog = [];
    this.buttonAction = '';
    this.titleDialog = '';
  }

  actionDialog() {
    const mapLiterals = this.LiteralClass.getLiterals([
      'COMMONS.ADD_OPERATION_LABEL',
      'COMMONS.UPDATE_OPERATION_LABEL',
    ]);

    if (this.titleDialog === mapLiterals.get('COMMONS.ADD_OPERATION_LABEL')) {
      this.addItem(this.itemDialog);
    } else if (this.titleDialog === mapLiterals.get('COMMONS.UPDATE_OPERATION_LABEL')) {
      this.updateItem(this.itemDialog);
    }
  }


  findAllPeriodsByPayment(item) {
    this.methodHistoric.emit(item);
  }

  showDialogToAdd() {
    this.displayDialog = true;
    this.titleDialog = this.LiteralClass.getLiterals(['COMMONS.ADD_OPERATION_LABEL']).get('COMMONS.ADD_OPERATION_LABEL');
    this.itemDialog = {};

    // LABELS FORM

  }

  addItem(item) {
    this.methodAdd.emit(item);
  }

  deleteItem(item) {
    this.methodDelete.emit(item);
  }

  showDialogToUpdate(event) {
    this.displayDialog = true;
    this.titleDialog = this.LiteralClass.getLiterals(['COMMONS.UPDATE_OPERATION_LABEL']).get('COMMONS.UPDATE_OPERATION_LABEL');
    this.itemDialog = this.itemSelect;

    // LABELS FORM
  }

  updateItem(item) {
    this.methodDelete.emit(item);
  }

}
