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

@Component({
  selector: 'app-table-crud-payment',
  templateUrl: './table-crud-payment.component.html',
  styles: [],
  providers: [ConfirmationService],
})
export class TableCrudPaymentComponent implements OnInit {
  @Input() payments: Payment[];
  @Input() headers: any[];
  @Input() labels: any[];
  @Input() categories: Category[];

  itemSelect: Payment;
  displayDialog: boolean;
  titleDialog: string;
  buttonAction: string;
  buttonCancel: string;
  itemDialog: FormGroup;
  newElement: boolean;

  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;

  constructor(
    private translate: TranslateService,
    private paymentService: PaymentService,
    private router: Router
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
    this.initForm();
  }

  initForm() {
    this.itemDialog = new FormGroup({
      category: new FormControl('', Validators.required),
      quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
      period: new FormControl('', Validators.required),
    });
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
      Number(
        this.LiteralClass.getLiterals(['COMMONS.NATURE_GAIN_KEY']).get(
          'COMMONS.NATURE_GAIN_KEY'
        )
      ),
      this.LiteralClass.getLiterals(['COMMONS.NATURE_GAIN']).get(
        'COMMONS.NATURE_GAIN'
      )
    );
    mapNature.set(
      Number(
        this.LiteralClass.getLiterals(['COMMONS.NATURE_EXPENDITURE_KEY']).get(
          'COMMONS.NATURE_EXPENDITURE_KEY'
        )
      ),
      this.LiteralClass.getLiterals(['COMMONS.NATURE_EXPENDITURE']).get(
        'COMMONS.NATURE_EXPENDITURE'
      )
    );

    // TYPE
    mapType.set(
      Number(
        this.LiteralClass.getLiterals(['COMMONS.TYPE_PERSONAL_KEY']).get(
          'COMMONS.TYPE_PERSONAL_KEY'
        )
      ),
      this.LiteralClass.getLiterals(['COMMONS.TYPE_PERSONAL']).get(
        'COMMONS.TYPE_PERSONAL'
      )
    );
    mapType.set(
      Number(
        this.LiteralClass.getLiterals(['COMMONS.TYPE_PERMANENT_KEY']).get(
          'COMMONS.TYPE_PERMANENT_KEY'
        )
      ),
      this.LiteralClass.getLiterals(['COMMONS.TYPE_PERMANENT']).get(
        'COMMONS.TYPE_PERMANENT'
      )
    );

    return column === 'nature' ? mapNature.get(key) : mapType.get(key);
  }

  hiddenDialog() {
    this.displayDialog = false;
    this.buttonAction = '';
    this.titleDialog = '';
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
  }

  // #### CRUD PAYMENT ####
  addPayment(payment: FormGroup) {
    console.log('ADD PAYMENT');
  }

  /**
   * Get new period select in input datapicker
   * @param period
   */
  changePeriod(period: string) {
    this.itemDialog.patchValue({
      period: period
    });
  }

  updatePayment(payment: FormGroup) {
    console.log('UPDATE PAYMENT');
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

  setValuesForm() {
    this.itemDialog.patchValue({
      period: this.itemSelect.period,
      category: this.categories.filter(
        (category) => category.description === this.itemSelect.description && category.nature === this.itemSelect.nature
      )[0],
      quantity: this.itemSelect.quantity
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
}
