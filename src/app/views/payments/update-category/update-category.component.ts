import { Component, OnInit, OnDestroy } from '@angular/core';
// RXJS
import { Subscription } from 'rxjs';
// FORM
import { FormGroup, FormControl, Validators } from '@angular/forms';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
// SERVICES
import { CategoryService } from '../../../services/category.service';
// NGRX
import { Store } from '@ngrx/store';
import { AppState } from '../../../redux/app.reducers';
// MODELS
import { Category } from '../../../models/category.model';
// ROUTE
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: []
})
export class UpdateCategoryComponent implements OnInit, OnDestroy {

  // FORM
  form: FormGroup;
  // FLAG
  loaded: boolean;
  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;
  // TYPES
  types: string[];
  // NATURES
  natures: string[];
  // SUBSCRIBE
  subsCategory: Subscription = new Subscription();
  subsLoaded: Subscription = new Subscription();
  // CATEGORY
  category: Category;

  constructor(
    private translate: TranslateService,
    private categoryService: CategoryService ,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getCategoryByParams(this.route.snapshot.paramMap.get('uid'));
    this.getAllTypes();
    this.getAllNature();
    // Init form
    this.initForm();
  }

  ngOnDestroy() {
    this.subsCategory.unsubscribe();
    this.subsLoaded.unsubscribe();
  }

  /**
   * Get Category by param
   * @param uid 
   */
  getCategoryByParams(uid: string) {
      this.subsCategory = this.store.select('categories').subscribe((items) => {
        this.category = items.categories.filter(
          (item) => item.uid === uid
        )[0];
      });
  }

  /**
   * Get all types to combo
   */
  getAllTypes() {
    const mapLiterals = this.LiteralClass.getLiterals([
      'UPDATE-CATEGORY.TYPE_PERSONAL',
      'UPDATE-CATEGORY.TYPE_PERMANENT',
    ]);
    this.types = [
      mapLiterals.get('UPDATE-CATEGORY.TYPE_PERSONAL'),
      mapLiterals.get('UPDATE-CATEGORY.TYPE_PERMANENT'),
    ];
  }

  /**
   * Get all Natures to combo
   */
  getAllNature() {
    const mapLiterals = this.LiteralClass.getLiterals([
      'UPDATE-CATEGORY.NATURE_GAIN',
      'UPDATE-CATEGORY.NATURE_EXPENDITURE',
    ]);
    this.natures = [
      mapLiterals.get('UPDATE-CATEGORY.NATURE_GAIN'),
      mapLiterals.get('UPDATE-CATEGORY.NATURE_EXPENDITURE'),
    ];
  }

  /**
   * Init form
   */
  initForm() {
    this.form = new FormGroup({
      nature: new FormControl(this.category.nature, Validators.required),
      type: new FormControl(this.category.type, Validators.required),
      description: new FormControl(this.category.description, Validators.required)
    });

    this.subsLoaded = this.store.select('categories').subscribe( response => {
      this.loaded = response.loaded;
    });
  }

  /**
   * Submit form
   */
  onSubmit() {
    this.categoryService.updateCategory({...this.form.value});
    this.form.reset();
  }

}
