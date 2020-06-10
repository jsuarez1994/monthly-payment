import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// LITERALS
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../Utils/literals';
import { map } from 'rxjs/operators';
import { Literals } from '../../Utils/literals';
import { ConfirmationService } from 'primeng/api';
import { Constants } from '../../Utils/constants';
import * as sweetAlert from '../../Utils/sweetalert';
import Swal from 'sweetalert2';
import { SweetAlertIcon } from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { ExportDataService } from '../../../services/export-data.service';

@Component({
  selector: 'app-table-crud-category',
  templateUrl: './table-crud-category.component.html',
  styles: [],
  providers: [ConfirmationService],
})
export class TableCrudCategoryComponent implements OnInit {
  @Input() categories: Category[];
  @Input() headers: any[];

  itemSelect: Category;
  displayDialog: boolean;
  titleDialog: string;
  buttonAction: string;
  buttonCancel: string;
  itemDialog: FormGroup;
  newElement: boolean;

  natures: any[];
  types: any[];

  placeholderFinder: string;

  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;

  constructor(
    private translate: TranslateService,
    private categoryService: CategoryService,
    private router: Router,
    private exportDataService: ExportDataService
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getAllNatures();
    this.getAllTypes();
    this.newElement = false;
    this.displayDialog = false;
    this.buttonCancel = this.LiteralClass.getLiterals([
      'COMMONS.CANCEL_OPERATION_LABEL',
    ]).get('COMMONS.CANCEL_OPERATION_LABEL');
    this.buttonAction = '';
    this.placeholderFinder = this.LiteralClass.getLiterals([
      'COMMONS.FIND_BY_DESCRIPTION',
    ]).get('COMMONS.FIND_BY_DESCRIPTION');
    this.initForm();
  }

  getAllNatures() {

    const natureGainKey = Number(this.LiteralClass.getLiterals(['COMMONS.NATURE_GAIN_KEY']).get('COMMONS.NATURE_GAIN_KEY'));
    const natureGainLabel = this.LiteralClass.getLiterals(['COMMONS.NATURE_GAIN']).get('COMMONS.NATURE_GAIN');

    const natureExpenditureKey = Number(this.LiteralClass.getLiterals(['COMMONS.NATURE_EXPENDITURE_KEY']).get('COMMONS.NATURE_EXPENDITURE_KEY'));
    const natureExpenditureLabel = this.LiteralClass.getLiterals(['COMMONS.NATURE_EXPENDITURE']).get('COMMONS.NATURE_EXPENDITURE');

    this.natures = [  {key: natureGainKey, value: natureGainLabel},
                      {key: natureExpenditureKey, value: natureExpenditureLabel}];
  }

  getAllTypes() {

    const typePersonalKey = Number(this.LiteralClass.getLiterals(['COMMONS.TYPE_PERSONAL_KEY']).get('COMMONS.TYPE_PERSONAL_KEY'));
    const typePersonalLabel = this.LiteralClass.getLiterals(['COMMONS.TYPE_PERSONAL']).get('COMMONS.TYPE_PERSONAL');

    const typePermanentKey = Number(this.LiteralClass.getLiterals(['COMMONS.TYPE_PERMANENT_KEY']).get('COMMONS.TYPE_PERMANENT_KEY'));
    const typePermanentLabel = this.LiteralClass.getLiterals(['COMMONS.TYPE_PERMANENT']).get('COMMONS.TYPE_PERMANENT');

    this.types = [  {key: typePersonalKey, value: typePersonalLabel},
                    {key: typePermanentKey, value: typePermanentLabel}];
  }

  initForm() {
    this.itemDialog = new FormGroup({
      nature: new FormControl(0, Validators.required),
      type: new FormControl(0, [Validators.required]),
      description: new FormControl('', Validators.required),
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

  actionDialog() {
    const mapLiterals = this.LiteralClass.getLiterals([
      'COMMONS.ADD_OPERATION_TITLE',
      'COMMONS.UPDATE_OPERATION_TITLE',
    ]);

    if (this.titleDialog === mapLiterals.get('COMMONS.ADD_OPERATION_TITLE')) {
      this.addCategory(this.itemDialog);
    } else if (
      this.titleDialog === mapLiterals.get('COMMONS.UPDATE_OPERATION_TITLE')
    ) {
      this.updateCategory(this.itemDialog);
    }
  }

  // #### CRUD PAYMENT ####
  addCategory(categoryDialog: FormGroup) {
    const category: Category = new Category();
    category.nature = Number(categoryDialog.value.nature);
    category.type = Number(categoryDialog.value.type);
    const description: string = categoryDialog.value.description;
    category.description = description.trim();

    // VALIDATE ELEMENT NOT REPEAT
    if (this.categoryService.elementNotRepeat(this.categoryService.getCategories(), category)) {
      this.categoryService.addCategory(category);
      this.itemDialog.reset();
      this.hiddenDialog();
    } else {
      const mapToast = this.LiteralClass.getLiterals(['OPERATION-CATEGORY.TOAST_TITLE_REPEAT']);
      let toast: string = mapToast.get('OPERATION-CATEGORY.TOAST_TITLE_REPEAT');
      toast = toast.replace('<CATEGORY>', category.description);
      sweetAlert.toastMessage(toast, Constants.ICON_ERROR);
    }
  }

  updateCategory(categoryDialog: FormGroup) {
    const descriptionValue = String(categoryDialog.controls['description'].value).trim();
    categoryDialog.patchValue({description: descriptionValue});
    this.categoryService.updateCategory({...categoryDialog.value, uid: this.itemSelect.uid}, this.itemSelect);
    this.itemDialog.reset();
    this.hiddenDialog();
  }

  setValuesForm() {
    this.itemDialog.patchValue({
      nature: this.itemSelect.nature,
      type: this.itemSelect.type,
      description: this.itemSelect.description
    });
  }

  /**
   * Delete payment
   * @param payment
   */
  deleteCategory(category: Category) {
    this.modalDelete(this.LiteralClass.getMapModalDelete(), category);
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
          this.categoryService
            .deleteCategory(object);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          sweetAlert.toastMessage(
            map.get('messageOpCanceled'),
            Constants.ICON_ERROR
          );
        }
      });
  }


  /**EXPORTS DATA*/
  exportPdf() {
    const startTitlePDF = this.LiteralClass.getLiterals(['COMMONS.EXPORT_CATEGORIES_TITLE']).get('COMMONS.EXPORT_CATEGORIES_TITLE');
    const titlePDF = startTitlePDF.concat('.pdf');
    this.exportDataService.exportPdfData(this.categories, this.headers, titlePDF, Constants.MODEL_CATEGORY);
  }

  exportExcel() {
      const startTitleExcel = this.LiteralClass.getLiterals(['COMMONS.EXPORT_CATEGORIES_TITLE']).get('COMMONS.EXPORT_CATEGORIES_TITLE');
      const titleExcel = startTitleExcel.concat('.xlsx');
      this.exportDataService.exportExcelData(this.categories, titleExcel, Constants.MODEL_CATEGORY);
  }

}
