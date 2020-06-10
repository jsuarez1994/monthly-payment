import { Injectable } from '@angular/core';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../shared/Utils/literals';
import * as utils from '../shared/Utils/utils';
import { Payment } from '../models/payment.model';
import { Category } from '../models/category.model';
import { Constants } from '../shared/Utils/constants';

@Injectable({
  providedIn: 'root',
})
export class ExportDataService {

  LiteralClass: literals.Literals;

  constructor(private translate: TranslateService) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  /**
   * Export Excel
   * @param dataList 
   * @param titleExcel 
   */
  exportExcelData(dataList: any[], titleExcel: string, model: string) {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.mapperListObject(dataList, model, Constants.FILE_EXCEL));
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      import('file-saver').then((FileSaver) => {
        const EXCEL_TYPE =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const data: Blob = new Blob([excelBuffer], {
          type: EXCEL_TYPE,
        });
        FileSaver.saveAs(data, titleExcel);
      });
    });
  }

  /**
   * Export to PDF
   * @param dataList
   * @param headers
   * @param titlePDF
   */
  exportPdfData(dataList: any[], headers: any[], titlePDF: string, model: string) {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.getHeaderPDF(headers), this.mapperListObject(dataList, model, Constants.FILE_PDF));
        doc.save(titlePDF);
      });
    });
  }

  /**
   * Export header to pdf
   * @param list
   */
  private getHeaderPDF(list: any[]) {
    return list.map(col => ({title: col.header, dataKey: col.field}));
  }

  /**
   * Mapper to Export
   * @param list
   */
  private mapperListObject(list: any[], model: string, file: string) {

    let listExport: any[] = [];

    list.forEach(item => {
      if (model === Constants.MODEL_PAYMENT) {
        listExport.push(this.mapperPaymentToExport(item, file));
      } else if (model === Constants.MODEL_CATEGORY) {
        listExport.push(this.mapperCategoryToExport(item, file));
      }
    });

    return listExport;
  }

  /**
   * Export model to view exported
   * @param item 
   */
  private mapperPaymentToExport(item: Payment, file: string) {

    if (file === Constants.FILE_EXCEL) {
      return {
        Period: utils.getMonthByPeriod(item.period).concat('/').concat(utils.getYearByPeriod(item.period)),
        TypeMove: this.translateColumn(item.nature, 'nature'),
        Type: this.translateColumn(item.type, 'type'),
        Description: item.description,
        Quantity: item.quantity
      };
    } else {
      return {
        nature: this.translateColumn(item.nature, 'nature'),
        type: this.translateColumn(item.type, 'type'),
        description: item.description,
        quantity: item.quantity
      };
    }

  }

  /**
   * Export model to view exported
   * @param item 
   */
  private mapperCategoryToExport(item: Category, file: string) {

    if (file === Constants.FILE_EXCEL) {
      return {
        TypeMove: this.translateColumn(item.nature, 'nature'),
        Type: this.translateColumn(item.type, 'type'),
        Description: item.description
      };
    } else {
      return {
        nature: this.translateColumn(item.nature, 'nature'),
        type: this.translateColumn(item.type, 'type'),
        description: item.description
      };
    }

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
    mapNature.set(
      Number(this.LiteralClass.getLiterals(['COMMONS.NATURE_GAIN_KEY'])
                                          .get('COMMONS.NATURE_GAIN_KEY')),
      this.LiteralClass.getLiterals(['COMMONS.NATURE_GAIN']).get('COMMONS.NATURE_GAIN')
    );

    mapNature.set(
      Number(this.LiteralClass.getLiterals(['COMMONS.NATURE_EXPENDITURE_KEY'])
                              .get('COMMONS.NATURE_EXPENDITURE_KEY')),
      this.LiteralClass.getLiterals(['COMMONS.NATURE_EXPENDITURE']).get('COMMONS.NATURE_EXPENDITURE')
    );

    // TYPE
    mapType.set(
      Number(this.LiteralClass.getLiterals(['COMMONS.TYPE_PERSONAL_KEY'])
                              .get('COMMONS.TYPE_PERSONAL_KEY')),
      this.LiteralClass.getLiterals(['COMMONS.TYPE_PERSONAL']).get('COMMONS.TYPE_PERSONAL')
    );
    mapType.set(Number(
        this.LiteralClass.getLiterals(['COMMONS.TYPE_PERMANENT_KEY'])
                        .get('COMMONS.TYPE_PERMANENT_KEY')),
      this.LiteralClass.getLiterals(['COMMONS.TYPE_PERMANENT']).get('COMMONS.TYPE_PERMANENT')
    );

    return column === 'nature' ? mapNature.get(key) : mapType.get(key);
  }

}
