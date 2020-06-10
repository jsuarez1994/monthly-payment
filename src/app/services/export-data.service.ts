import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExportDataService {
  constructor() {}

  exportExcelData(dataList: any[], titleExcel: string) {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(dataList);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      import('file-saver').then((FileSaver) => {
        let EXCEL_TYPE =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const data: Blob = new Blob([excelBuffer], {
          type: EXCEL_TYPE,
        });
        FileSaver.saveAs(data, titleExcel);
      });
    });
  }

  exportPdfData(dataList: any[], headers: any[], titlePDF: string) {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.getHeaderPDF(headers), dataList);
        doc.save(titlePDF);
      });
    });
  }

  private getHeaderPDF(list: any[]) {
    return list.map(col => ({title: col.header, dataKey: col.field}));
  }

}
