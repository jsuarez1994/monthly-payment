import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// LITERALS
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../Utils/literals';
import { map } from 'rxjs/operators';
import { Literals } from '../../Utils/literals';
import { ConfirmationService } from 'primeng/api';
import { Payment } from '../../../models/payment.model';
import { Constants } from '../../Utils/constants';
import * as sweetAlert from '../../Utils/sweetalert';
import Swal from 'sweetalert2';
import { SweetAlertIcon } from 'sweetalert2';
import { PaymentService } from '../../../services/payment.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '../../../models/category.model';
// UTILS
import * as utils from '../../../shared/Utils/utils';
import { ExportDataService } from '../../../services/export-data.service';

@Component({
  selector: 'app-table-crud-payment',
  templateUrl: './table-crud-payment.component.html',
  styles: [],
  providers: [ConfirmationService],
})
export class TableCrudPaymentComponent implements OnInit {
  @Input() payments: Payment[];
  @Input() headers: any[];
  @Input() categories: Category[];

  itemSelect: Payment;
  displayDialog: boolean;
  titleDialog: string;
  buttonAction: string;
  buttonCancel: string;
  itemDialog: FormGroup;
  newElement: boolean;

  placeholderFinder: string;

  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;

  constructor(
    private translate: TranslateService,
    private paymentService: PaymentService,
    private router: Router,
    private exportDataService: ExportDataService
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.newElement = false;
    this.displayDialog = false;
    this.buttonCancel = this.LiteralClass.getLiterals([
      'COMMONS.CANCEL_OPERATION_LABEL',
    ]).get('COMMONS.CANCEL_OPERATION_LABEL');
    this.buttonAction = '';
    this.placeholderFinder = this.LiteralClass.getLiterals([
      'COMMONS.FIND_BY_DESCRIPTION_OR_QUANTITY',
    ]).get('COMMONS.FIND_BY_DESCRIPTION_OR_QUANTITY');
    this.initForm();
  }

  initForm() {
    this.itemDialog = new FormGroup({
      category: new FormControl('', Validators.required),
      quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
      period: new FormControl(utils.currentDate(), Validators.required),
    });
  }

  /**
   * Translate values
   * @param key
   * @param column
   */
  translateColumn(key: number, column: string) {
    return this.exportDataService.translateColumn(key, column);
  }

  hiddenDialog() {
    this.displayDialog = false;
    this.buttonAction = '';
    this.titleDialog = '';
  }

  onRowSelect() {
    this.newElement = false;
    this.setValuesForm();
    this.displayDialog = true;
    this.titleDialog = this.LiteralClass.getLiterals([
      'COMMONS.UPDATE_OPERATION_TITLE',
    ]).get('COMMONS.UPDATE_OPERATION_TITLE');
    this.buttonAction = this.LiteralClass.getLiterals([
      'COMMONS.UPDATE_OPERATION_LABEL',
    ]).get('COMMONS.UPDATE_OPERATION_LABEL');
  }

  showDialogToAdd() {
    this.newElement = true;
    this.displayDialog = true;

    this.titleDialog = this.LiteralClass.getLiterals([
      'COMMONS.ADD_OPERATION_TITLE',
    ]).get('COMMONS.ADD_OPERATION_TITLE');

    this.buttonAction = this.LiteralClass.getLiterals([
      'COMMONS.ADD_OPERATION_LABEL',
    ]).get('COMMONS.ADD_OPERATION_LABEL');

    this.itemDialog.reset();
    this.itemDialog.patchValue({
      period: utils.currentDate()
    });
  }

  actionDialog() {
    const mapLiterals = this.LiteralClass.getLiterals([
      'COMMONS.ADD_OPERATION_TITLE',
      'COMMONS.UPDATE_OPERATION_TITLE',
    ]);

    if (this.titleDialog === mapLiterals.get('COMMONS.ADD_OPERATION_TITLE')) {
      this.addPayment(this.itemDialog);
    } else if (
      this.titleDialog === mapLiterals.get('COMMONS.UPDATE_OPERATION_TITLE')
    ) {
      this.updatePayment(this.itemDialog);
    }
  }

  // #### CRUD PAYMENT ####
  addPayment(paymentDialog: FormGroup) {
    const category: Category = paymentDialog.controls['category'].value;
    const payment: Payment = {
      uid: '',
      description: category.description,
      type: category.type,
      nature: category.nature,
      quantity: paymentDialog.controls['quantity'].value,
      period: paymentDialog.controls['period'].value,
    };

    // VALIDATE ELEMENT NOT REPEAT
    if (
      this.paymentService.elementNotRepeat(
        this.paymentService.getPayments(),
        payment
      )
    ) {
      this.paymentService.addPayment(payment);
      this.itemDialog.reset();
      this.itemDialog.patchValue({
        period: utils.currentDate()
      });
      this.hiddenDialog();
    } else {
      const map = this.LiteralClass.getLiterals([
        'OPERATION-PAYMENT.TOAST_TITLE_REPEAT',
      ]);
      let toast = map.get('OPERATION-PAYMENT.TOAST_TITLE_REPEAT');
      toast = toast
        .replace('<PERIOD>', utils.periodToDate([payment.period])[0])
        .replace('<CATEGORY>', payment.description);
      sweetAlert.toastMessage(toast, Constants.ICON_ERROR);
    }
  }

  updatePayment(paymentDialog: FormGroup) {
    const payment: Payment = this.itemSelect;
    payment.period = paymentDialog.controls['period'].value;
    payment.quantity = paymentDialog.controls['quantity'].value;

    this.paymentService
      .updatePayment(payment)
      .then(() => {
        this.messagesLiteralsToast(
          ['OPERATION-PAYMENT.TOAST_TITLE_SUCCESS'],
          Constants.ICON_SUCCESS
        );
        this.itemDialog.reset();
        this.itemDialog.patchValue({
          period: utils.currentDate()
        });
        this.hiddenDialog();
      })
      .catch(() => {
        this.messagesLiteralsToast(
          ['OPERATION-PAYMENT.TOAST_TITLE_FAIL'],
          Constants.ICON_ERROR
        );
      });
  }

  /**
   * Delete payment
   * @param payment
   */
  deletePayment(payment: Payment) {
    this.modalDelete(this.LiteralClass.getMapModalDelete(), payment);
  }

  /**
   * Get new period select in input datapicker
   * @param period
   */
  changePeriod(period: string) {
    this.itemDialog.patchValue({
      period: period,
    });
  }

  setValuesForm() {
    this.itemDialog.patchValue({
      period: this.itemSelect.period,
      category: this.categories.filter(
        (category) =>
          category.description === this.itemSelect.description &&
          category.nature === this.itemSelect.nature
      )[0],
      quantity: this.itemSelect.quantity,
    });
  }

  /**
   * MODAL TO ACTION DELETE
   * @param map
   * @param object
   */
  private modalDelete(map: Map<string, string>, object) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: map.get('title'),
        text: map.get('message'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: map.get('textButtonYes'),
        cancelButtonText: map.get('textButtonNo'),
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.paymentService
            .deletePayment(object)
            .then(() => {
              this.messagesLiteralsToast(
                ['PAYMENT.DELETE_SUCCESS'],
                Constants.ICON_SUCCESS
              );
            })
            .catch(() => {
              this.messagesLiteralsToast(
                ['PAYMENT.DELETE_FAIL'],
                Constants.ICON_ERROR
              );
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          sweetAlert.toastMessage(
            map.get('messageOpCanceled'),
            Constants.ICON_ERROR
          );
        }
      });
  }

  /**
   * Find payment all others period this year
   * @param payment
   */
  findAllPeriodsByPayment(payment: Payment) {
    console.log('### FIN ALL PERIODS SAME YEAR PAYMENT ###');
    console.log(payment);

    // NAVIGATO TO UPDATE PAYMENT
    this.router.navigate([
      '/'.concat(Constants.HISTORY_PAYMENT_PATH),
      { description: payment.description },
    ]);
  }

  /** Show message by literals
   * @param literals
   */
  private messagesLiteralsToast(literals: string[], icon: SweetAlertIcon) {
    const mapLiterals = this.LiteralClass.getLiterals(literals);
    sweetAlert.toastMessage(mapLiterals.get(literals[0]), icon);
  }


  /**EXPORTS DATA*/
  exportPdf() {
    const period = this.payments[0].period;
    const startTitlePDF = this.LiteralClass.getLiterals(['COMMONS.EXPORT_PAYMENTS_TITLE']).get('COMMONS.EXPORT_PAYMENTS_TITLE');
    const titlePDF = startTitlePDF.concat(period).concat('.pdf');
    this.exportDataService.exportPdfData(this.payments, this.headers, titlePDF, Constants.MODEL_PAYMENT);
  }

  exportExcel() {
      const period = this.payments[0].period;
      const startTitleExcel = this.LiteralClass.getLiterals(['COMMONS.EXPORT_PAYMENTS_TITLE']).get('COMMONS.EXPORT_PAYMENTS_TITLE');
      const titleExcel = startTitleExcel.concat(period).concat('.xlsx');
      this.exportDataService.exportExcelData(this.payments, titleExcel, Constants.MODEL_PAYMENT);
  }
}
