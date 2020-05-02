import { Injectable } from '@angular/core';
// RXJS
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { error } from 'protractor';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../shared/Utils/literals';
// CONSTANTS
import { Constants } from '../shared/Utils/constants';
// SERVICES
import { UserService } from './user.service';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
// NGRX
import { AppState } from '../redux/app.reducers';
import { Store } from '@ngrx/store';
import * as categoriesActions from '../redux/actions/categories/categories.actions';
// MODELS
import { Category } from '../models/category.model';
import { User } from '../models/user.model';
// SWEET ALERT
import * as sweetAlert from '../shared/Utils/sweetalert';
import { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;

  subs: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private firebaseService: AngularFirestore,
    private translate: TranslateService,
    private store: Store<AppState>
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  cancelSubs() {
    this.subs.unsubscribe();
    this.storeUnsetCategories();
  }

  addCategory(category: Category): void {
    this.storeAddCategory();
    this.getCollection()
      .add({ ...category })
      .then(() => {
        this.storeAddCategorySuccess(category);
        this.messagesLiteralsToast(
          ['ADD-CATEGORY.TOAST_TITLE_SUCCESS'],
          Constants.ICON_SUCCESS
        );
      })
      .catch((error) => {
        this.storeAddCategoryFail(error);
        this.messagesLiteralsToast(
          ['ADD-CATEGORY.TOAST_TITLE_FAIL'],
          Constants.ICON_ERROR
        );
      });
  }

  /**
   * Add new payment
   * @param payment
   */
  updateCategory(category: Category): void {
    this.storeUpdateCategory();
    this.getCollection()
      .doc(category.uid)
      .update({
        nature: category.nature,
        type: category.type,
        description: category.description,
      })
      .then(() => {
        this.storeUpdateCategorySuccess(category);
        this.messagesLiteralsToast(
          ['UPDATE-CATEGORY.TOAST_TITLE_SUCCESS'],
          Constants.ICON_SUCCESS
        );
      })
      .catch((error) => {
        this.storeUpdateCategoryFail(error);
        this.messagesLiteralsToast(
          ['UPDATE-CATEGORY.TOAST_TITLE_FAIL'],
          Constants.ICON_ERROR
        );
      });
  }

  /**
   * Delete paymeny by params
   * @param payment
   */
  deleteCategory(category: Category): void {
    console.log(' ### DELETE Category ### ');
    this.storeDeleteCategory();
    this.getCollection()
      .doc(category.uid)
      .delete()
      .then(() => {
        this.storeDeleteCategorySuccess(category);
        this.messagesLiteralsToast(
          ['CATEGORY.DELETE_SUCCESS'],
          Constants.ICON_SUCCESS
        );
      })
      .catch((error) => {
        this.storeDeleteCategorySuccess(error);
        this.messagesLiteralsToast(
          ['CATEGORY.DELETE_FAIL'],
          Constants.ICON_ERROR
        );
      });
  }

  getAllCategories(): void {
    this.storeGetAllCategories();
    /*const user: User = this.userService.getUser();
    this.subs = this.firebaseService.collection(`${user.uid}/categories/items`)
    .snapshotChanges()
    .pipe(map(items => {
      return items.map( item => {
        return {
          uid: item.payload.doc.id,
          ...item.payload.doc['data']
        };
      });
    })
    ).subscribe( categories => {
      this.storeGetAllCategoriesSuccess(categories);
    });*/

    // MOCK
    let list: Category[] = [];

    let cat1: Category = new Category('Alquiler', 'Fijo', 'Gasto'); 
    cat1.uid = 'UID1';
    let cat2: Category = new Category('Coche', 'Personal', 'Gasto'); 
    cat2.uid = 'UID1';
    let cat3: Category = new Category('Luz', 'Fijo', 'Gasto'); 
    cat3.uid = 'UID1';
    let cat4: Category = new Category('Sueldo', 'Fijo', 'Ganancia'); 
    cat4.uid = 'UID1';
    
    list.push(cat1);
    list.push(cat2);
    list.push(cat3);
    list.push(cat4);

    this.storeGetAllCategoriesSuccess(list);
  }

  /**
   * Get collection to manager payments
   */
  private getCollection() {
    const user: User = this.userService.getUser();
    return this.firebaseService
      .doc(`${user.uid}/categories`)
      .collection('items');
  }

  /**
   * Show message by literals
   * @param literals
   */
  private messagesLiteralsToast(literals: string[], icon: SweetAlertIcon) {
    const mapLiterals = this.LiteralClass.getLiterals(literals);

    sweetAlert.toastMessage(mapLiterals.get(literals[0]), icon);
  }

  /**
   * Call store Add Category
   */
  private storeAddCategory() {
    this.store.dispatch(new categoriesActions.AddCategory());
  }

  /**
   * Call store Add Category Success
   */
  private storeAddCategorySuccess(payload: Category) {
    this.store.dispatch(new categoriesActions.AddCategorySuccess(payload));
  }

  /**
   * Call store Add Category Fail
   */
  private storeAddCategoryFail(payload: any) {
    this.store.dispatch(new categoriesActions.AddCategoryFail(payload));
  }

  /**
   * Call store Add Category
   */
  private storeUpdateCategory() {
    this.store.dispatch(new categoriesActions.UpdateCategory());
  }

  /**
   * Call store Add Payment Success
   */
  private storeUpdateCategorySuccess(payload: Category) {
    this.store.dispatch(new categoriesActions.UpdateCategorySuccess(payload));
  }

  /**
   * Call store Add Payment Fail
   */
  private storeUpdateCategoryFail(payload: any) {
    this.store.dispatch(new categoriesActions.UpdateCategoryFail(payload));
  }

  /**
   * Call store Delete Payment
   */
  private storeDeleteCategory() {
    this.store.dispatch(new categoriesActions.DeleteCategory());
  }

  /**
   * Call store Delete Payment Success
   */
  private storeDeleteCategorySuccess(payload: Category) {
    this.store.dispatch(new categoriesActions.DeleteCategorySuccess(payload));
  }

  /**
   * Call store Delete Payment Fail
   */
  private storeDeleteCategoryFail(payload: any) {
    this.store.dispatch(new categoriesActions.DeleteCategoryFail(payload));
  }

  /**
   * Call store get all Payment
   */
  private storeGetAllCategories() {
    this.store.dispatch(new categoriesActions.GetAllCategories());
  }

  /**
   * Call store get all Payment success
   */
  private storeGetAllCategoriesSuccess(payload) {
    this.store.dispatch(new categoriesActions.GetAllCategoriesSuccess(payload));
  }

  /**
   * Call store get all Payment success
   */
  private storeGetAllCategoriesFail(payload) {
    this.store.dispatch(new categoriesActions.GetAllCategoriesFail(payload));
  }

  /**
   * Call store get all Payment success
   */
  private storeUnsetCategories() {
    this.store.dispatch(new categoriesActions.UnsetCategories());
  }
}
