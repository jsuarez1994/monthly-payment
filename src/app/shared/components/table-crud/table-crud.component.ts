import { Component, OnInit, Input } from '@angular/core';
// LITERALS
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';

@Component({
  selector: 'app-table-crud',
  templateUrl: './table-crud.component.html',
  styles: [],
})
export class TableCrudComponent implements OnInit {
  @Input() list: any[];
  @Input() headers: any[];
  ItemSelect: any;

  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;

  constructor(private translate: TranslateService) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {}

  onRowSelect(event) {
    console.log(event.data);
  }

  showDialogToAdd() {
    console.log('ABRE MODAL AÑADIR');
  }

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
}
