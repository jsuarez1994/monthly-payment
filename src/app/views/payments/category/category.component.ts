import { Component, OnInit } from '@angular/core';
// MODELS
import { Category } from '../../../models/category.model';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
// NGRX
import { Store } from '@ngrx/store';
import { AppState } from '../../../redux/app.reducers';

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
    private translate: TranslateService
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
}
