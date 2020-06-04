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
import { PaymentService } from './payment.service';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
// NGRX
import { AppState } from '../redux/app.reducers';
import { Store } from '@ngrx/store';
import * as categoriesActions from '../redux/actions/categories/categories.actions';
// MODELS
import { Category } from '../models/category.model';
import { User } from '../models/user.model';
import { Payment } from '../models/payment.model';
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

  categories: Category[] = [];

  constructor(
    private userService: UserService,
    private firebaseService: AngularFirestore,
    private translate: TranslateService,
    private store: Store<AppState>,
    private paymentService: PaymentService
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
      .then((itemSave) => {
        this.addItemList({ ...category, uid: itemSave.id });
        this.storeAddCategorySuccess({ ...category, uid: itemSave.id });
        this.messagesLiteralsToast(
          ['OPERATION-CATEGORY.TOAST_TITLE_SUCCESS'],
          Constants.ICON_SUCCESS
        );
      })
      .catch((error) => {
        this.storeAddCategoryFail(error);
        this.messagesLiteralsToast(
          ['OPERATION-CATEGORY.TOAST_TITLE_FAIL'],
          Constants.ICON_ERROR
        );
      });
  }

  /**
   * Valid if element not in list
   * @param list
   * @param element
   */
  elementNotRepeat(list: Category[], element: Category) {
    let noRepeat: boolean = true;
    list.forEach((item) => {
      if (  item.description.trim() === element.description.trim()
          && item.type === element.type
          && item.nature === element.nature) {
        noRepeat = false;
      }
    });
    return noRepeat || list.length === 0;
  }

  /**
   * Add new payment
   * @param payment
   */
  updateCategory(category: Category, oldCategory: Category): void {
    this.storeUpdateCategory();
    this.getCollection()
      .doc(category.uid)
      .update({
        nature: category.nature,
        type: category.type,
        description: category.description,
      })
      .then(() => {
        this.updateItemList(category);
        this.storeUpdateCategorySuccess(category);
        // UPDATE PAYMENTS WITH THIS CATEGORY
        this.updatePaymentsNewCategory(category, oldCategory);
        this.messagesLiteralsToast(
          ['OPERATION-CATEGORY.TOAST_TITLE_SUCCESS'],
          Constants.ICON_SUCCESS
        );
      })
      .catch((error) => {
        this.storeUpdateCategoryFail(error);
        this.messagesLiteralsToast(
          ['OPERATION-CATEGORY.TOAST_TITLE_FAIL'],
          Constants.ICON_ERROR
        );
      });
  }

  /**
   * Update all payments that implements this category
   * @param categoryNew 
   * @param oldCategory 
   */
  private updatePaymentsNewCategory(newCategory: Category, oldCategory:Category) {
    let list: Payment[] = this.paymentService.getPayments();
    let listPayments:Payment[] = list.filter(payment => payment.description === oldCategory.description);

    if(listPayments.length > 0) {
      console.log(' ### UPDATE PAYMENTS BY CATEGORY ### ');
      listPayments.forEach(payment => {
        payment = {...newCategory, quantity:payment.quantity, period: payment.period, uid: payment.uid};
        this.paymentService.updatePayment(payment);
      });
    }

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
        this.deleteItemList(category);
        this.storeDeleteCategorySuccess(category);
        // UPDATE PAYMENTS WITH THIS CATEGORY
        this.deletePaymentsCategory(category);
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

  /**
   * Delete all payments by category
   * @param category 
   */
  private deletePaymentsCategory(category: Category) {
    let list: Payment[] = this.paymentService.getPayments();
    let listPayments:Payment[] = list.filter(payment => payment.description === category.description);

    if(listPayments.length > 0) {
      console.log(' ### DELETE PAYMENTS BY CATEGORY ### ');
      listPayments.forEach( payment => this.paymentService.deletePayment(payment));
    }
  }

  /**
   * Get all categories
   */
  getAllCategories(): void {
    this.storeGetAllCategories();
    this.subs = this.getCollection()
      .snapshotChanges()
      .pipe(
        map((items) => {
          return items.map((item) => {
            return {
              uid: item.payload.doc.id,
            };
          });
        })
      )
      .subscribe((categories) => {
        if (categories.length === 0) {
          this.storeGetAllCategoriesSuccess([]);
        } else {
          this.getAllItemsByUid(categories);
        }
      });

    // MOCK
    /*let list: Category[] = [];

    let cat1: Category = new Category('UID1', 'Alquiler', 'Fijo', 'Gasto');
    let cat2: Category = new Category('UID2', 'Coche', 'Personal', 'Gasto');
    let cat3: Category = new Category('UID3', 'Luz', 'Fijo', 'Gasto');
    let cat4: Category = new Category('UID4', 'Sueldo', 'Fijo', 'Ganancia');

    list.push(cat1);
    list.push(cat2);
    list.push(cat3);
    list.push(cat4);

    this.storeGetAllCategoriesSuccess(list);*/
  }

  /**
   * Mapped values
   * @param list
   */
  private getAllItemsByUid(list: any[]) {
    const user: User = this.userService.getUser();
    let listItems: Category[] = [];
    list.forEach((it) => {
      this.firebaseService
        .doc(`${user.uid}/categories/items/${it.uid}`)
        .valueChanges()
        .pipe(
          map((item: Category) => {
            item.uid = it.uid;
            listItems.push(item);
          })
        )
        .subscribe(() => {
          this.categories = listItems;
          this.storeGetAllCategoriesSuccess(listItems);
        });
    });
  }

  /**
   * Return all categories
   */
  getCategories() {
    return this.categories;
  }

  /**
   * Delete item of list
   * @param item
   */
  deleteItemList(item: Category) {
    let index: number = this.categories.indexOf(item);
    if(index > 0){
      this.categories.splice(index);
    }
  }

  /**
   * Add item to list
   * @param item
   */
  addItemList(item: Category) {
    if (this.elementNotRepeat(this.categories, item)) {
      this.categories.push(item);
    }
  }

  /**
   * Update item to list
   * @param item
   * @param oldPeriod
   */
  updateItemList(item: Category) {
    // Index element to update
    let index: number = this.categories.indexOf(
      this.categories.filter(
        (category) =>
          category.description === item.description &&
          category.nature === item.nature &&
          category.type === item.type
      )[0]
    ); // find index item update

    this.categories[index] = item; // SAVE IN INDEX
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
