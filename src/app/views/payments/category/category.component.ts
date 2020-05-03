import { Component, OnInit } from '@angular/core';
// MODELS
import { Category } from '../../../models/category.model';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
// NGRX
import { Store } from '@ngrx/store';
import { AppState } from '../../../redux/app.reducers';
// SERVICES
import { CategoryService } from '../../../services/category.service';
// CONSTANTS
import { Constants } from '../../../shared/Utils/constants';
// SWEETALERT
import * as sweetAlert from '../../../shared/Utils/sweetalert';
import Swal from 'sweetalert2';
// ROUTER
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: [],
})
export class CategoryComponent implements OnInit {
  //CATEGORIES
  categories: Category[];
  // HEADERS
  headers: any[];
  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getHeaders();
    this.getAllCategories();
  }

  /**
   * Get Headers
   */
  getHeaders() {
    const headersValue = this.LiteralClass.getLiterals([
      'CATEGORY.HEADER_NATURE',
      'CATEGORY.HEADER_TYPE',
      'CATEGORY.HEADER_DESCRIPTION',
    ]);
    this.headers = [
      { key: 'nature', value: headersValue.get('CATEGORY.HEADER_NATURE') },
      { key: 'type', value: headersValue.get('CATEGORY.HEADER_TYPE') },
      {
        key: 'description',
        value: headersValue.get('CATEGORY.HEADER_DESCRIPTION'),
      },
      { key: 'operations', value: '' },
    ];
  }

  /**
   * Get all payments by filters
   */
  getAllCategories() {
    this.store.select('categories').subscribe((items) => {
      // GET ALL CATEGORIES
      this.categories = items.categories;
    });
  }

  /**
   * Delete category select
   * @param category
   */
  deleteCategory(category: Category) {
    console.log(' ### DELETE CATEGORY ### ');
    console.log(category);

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
          this.categoryService.deleteCategory(object);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          sweetAlert.toastMessage(
            map.get('messageOpCanceled'),
            Constants.ICON_ERROR
          );
        }
      });
  }

  /**
   * Update category select
   * @param category
   */
  updateCategory(category: Category) {
    console.log(' ### UPDATE CATEGORY ### ');
    console.log(category);
    // NAVIGATO TO UPDATE PAYMENT
    this.router.navigate(['/'.concat(Constants.UPDATE_CATEGORIES_PATH), { uid: category.uid }]);
  }
}
