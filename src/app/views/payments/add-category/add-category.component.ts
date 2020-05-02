import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: []
})
export class AddCategoryComponent implements OnInit {

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
  subs: Subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private categoryService: CategoryService ,
    private store: Store<AppState>
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.getAllTypes();
    this.getAllNature();
    // Init form
    this.initForm();
  }

  /**
   * Get all types to combo
   */
  getAllTypes() {
    const mapLiterals = this.LiteralClass.getLiterals([
      'ADD-CATEGORY.TYPE_PERSONAL',
      'ADD-CATEGORY.TYPE_PERMANENT',
    ]);
    this.types = [
      mapLiterals.get('ADD-CATEGORY.TYPE_PERSONAL'),
      mapLiterals.get('ADD-CATEGORY.TYPE_PERMANENT'),
    ];
  }

  /**
   * Get all Natures to combo
   */
  getAllNature() {
    const mapLiterals = this.LiteralClass.getLiterals([
      'ADD-CATEGORY.NATURE_GAIN',
      'ADD-CATEGORY.NATURE_EXPENDITURE',
    ]);
    this.natures = [
      mapLiterals.get('ADD-CATEGORY.NATURE_GAIN'),
      mapLiterals.get('ADD-CATEGORY.NATURE_EXPENDITURE'),
    ];
  }

  /**
   * Init form
   */
  initForm() {
    this.form = new FormGroup({
      nature: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });

    this.subs = this.store.select('categories').subscribe( response => {
      this.loaded = response.loaded;
    });
  }

  /**
   * Submit form
   */
  onSubmit() {
    this.categoryService.addCategory({...this.form.value});
    this.form.reset();
  }

}
