import { Injectable } from '@angular/core';
// SERVICES
import { UserService } from './user.service';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
// MODELS
import { Payment } from '../models/payment.model';
import { User } from '../models/user.model';
// SWEET ALERT
import * as sweetAlert from '../shared/Utils/sweetalert';
import { SweetAlertIcon } from 'sweetalert2';
// TRANSLATE
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../shared/Utils/literals';
// CONSTANTS
import { Constants } from '../shared/Utils/constants';
// NGRX
import { Store } from '@ngrx/store';
import * as paymentsActions from '../redux/actions/payments/payments.actions';
import { AppState } from '../redux/app.reducers';
// RXJS
import { map } from 'rxjs/operators';
import { error, element } from 'protractor';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;

  subs: Subscription = new Subscription();

  payments: Payment[] = [];

  constructor(
    private userService: UserService,
    private firebaseService: AngularFirestore,
    private translate: TranslateService,
    private store: Store<AppState>
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  /**
   * Cancel subscription
   */
  cancelSubs() {
    this.subs.unsubscribe();
    this.storeUnsetPayments();
  }

  /**
   * Add new payment
   * @param payment
   */
  addPayment(payment: Payment): void {
    this.storeAddPayment();
    this.getCollection()
      .add({ ...payment })
      .then((itemSave) => {
        this.addItemList({ ...payment, uid: itemSave.id });
        this.storeAddPaymentSuccess({ ...payment, uid: itemSave.id });
        this.messagesLiteralsToast(
          ['UPDATE-PAYMENT.TOAST_TITLE_SUCCESS'],
          Constants.ICON_SUCCESS
        );
      })
      .catch((error) => {
        this.storeAddPaymentFail(error);
        this.messagesLiteralsToast(
          ['UPDATE-PAYMENT.TOAST_TITLE_FAIL'],
          Constants.ICON_ERROR
        );
      });
  }

  /**
   * Valid if element not in list
   * @param list
   * @param element
   */
  elementNotRepeat(list: Payment[], element: Payment) {
    let noRepeat: boolean = true;
    list.forEach( item => {
      if(item.period.trim() === element.period.trim() && item.description.trim() === element.description.trim()){
        noRepeat = false;
      }
    });
    return noRepeat || list.length === 0;
  }

  /**
   * Add new payment
   * @param payment
   */
  updatePayment(payment: Payment) {
    this.storeUpdatePayment();
    return this.getCollection()
      .doc(payment.uid)
      .update({
        quantity: payment.quantity,
        period: payment.period,
        type: payment.type,
        nature: payment.nature,
        description: payment.description
      })
      .then(() => {
        this.updateItemList(payment);
        this.storeUpdatePaymentSuccess(payment);
      })
      .catch((error) => {
        this.storeUpdatePaymentFail(error);
      });
  }

  /**
   * Delete paymeny by params
   * @param payment
   */
  deletePayment(payment: Payment) {
    console.log(' ### DELETE PAYMENT ### ');
    this.storeDeletePayment();
    return this.getCollection()
      .doc(payment.uid)
      .delete()
      .then(() => {
        this.deleteItemList(payment);
        this.storeDeletePaymentSuccess(payment);
      })
      .catch((error) => {
        this.storeDeletePaymentSuccess(error);
      });
  }

  /**
   * Get all payments
   */
  getAllPayments(): void {
    this.storeGetAllPayments();
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
      .subscribe((payments) => {
        if (payments.length === 0) {
          this.storeGetAllPaymentsSuccess([]);
        } else {
          this.getAllItemsByUid(payments);
        }
      });

    // MOCK
    /*let list: Payment[] = [];

    let item: Payment = new Payment('202001', 450, 'Alquiler','Fijo', 'Gasto');
    item.uid = 'UIDP1';
    let item2: Payment = new Payment('202001', 800, 'Luz','Fijo', 'Gasto');
    item2.uid = 'UIDP2';
    let item3: Payment = new Payment('202001', 100, 'Coche','Fijo', 'Gasto');
    item3.uid = 'UIDP3';
    let item4: Payment = new Payment('202001', 1100, 'Sueldo','Fijo', 'Ganancia');
    item4.uid = 'UIDP4';
    let item5: Payment = new Payment('202001', 75, 'Cumpleaños amigo','Personal', 'Gasto');
    item5.uid = 'UIDP5';
    let item6: Payment = new Payment('202002', 80, 'Restaurantes','Personal', 'Gasto');
    item6.uid = 'UIDP6';
    let item7: Payment = new Payment('202002', 200, 'Cumpleaños','Fijo', 'Ganancia');
    item7.uid = 'UIDP7';
    let item8: Payment = new Payment('202002', 1500, 'Sueldo','Fijo', 'Ganancia');
    item8.uid = 'UIDP8';
    let item9: Payment = new Payment('202004', 80, 'Restaurantes','Personal', 'Gasto');
    item9.uid = 'UIDP9';
    let item10: Payment = new Payment('202004', 200, 'Cumpleaños','Fijo', 'Ganancia');
    item10.uid = 'UIDP10';
    let item11: Payment = new Payment('202004', 1600, 'Sueldo','Fijo', 'Ganancia');
    item11.uid = 'UIDP11';
    let item12: Payment = new Payment('202005', 200, 'Cumpleaños','Fijo', 'Ganancia');
    item12.uid = 'UIDP12';
    let item13: Payment = new Payment('202005', 1300, 'Sueldo','Fijo', 'Ganancia');
    item13.uid = 'UIDP13';


    list.push(item);
    list.push(item2);
    list.push(item3);
    list.push(item4);
    list.push(item5);
    list.push(item6);
    list.push(item7);
    list.push(item8);
    list.push(item9);
    list.push(item10);
    list.push(item11);
    list.push(item12);
    list.push(item13);

    this.storeGetAllPaymentsSuccess(list);*/
  }

  /**
   * Mapped values
   * @param list
   */
  private getAllItemsByUid(list: any[]) {
    const user: User = this.userService.getUser();
    let listPayment: Payment[] = [];
    list.forEach((it) => {
      this.firebaseService
        .doc(`${user.uid}/payments/items/${it.uid}`)
        .valueChanges()
        .pipe(
          map((item: Payment) => {
            item.uid = it.uid;
            listPayment.push(item);
          })
        )
        .subscribe(() => {
          this.payments = listPayment;
          this.storeGetAllPaymentsSuccess(listPayment);
        });
    });
  }

  /**
   * Return list already
   */
  getPayments() {
    return this.payments;
  }

  /**
   * Delete item of list
   * @param item
   */
  deleteItemList(item: Payment) {
    let index:number = this.payments.indexOf(item);
    if(index > 0){
      this.payments.splice(index);
    }
  }

  /**
   * Add item to list
   * @param item
   */
  addItemList(item: Payment) {
    if(this.elementNotRepeat(this.payments, item)) {
      this.payments.push(item);
    }
  }

  /**
   * Update item to list
   * @param item
   * @param oldPeriod
   */
  updateItemList(item: Payment) {
    // Index element to update
    let index: number = this.payments.indexOf(
      this.payments.filter(
        (payment) =>
          payment.uid === item.uid
      )[0]
    ); // find index item update

    this.payments[index] = item; // SAVE IN INDEX
  }

  /**
   * Get collection to manager payments
   */
  private getCollection() {
    const user: User = this.userService.getUser();
    return this.firebaseService.collection(`${user.uid}/payments/items`);
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
   * Call store Add Payment
   */
  private storeAddPayment() {
    this.store.dispatch(new paymentsActions.AddPayment());
  }

  /**
   * Call store Add Payment Success
   */
  private storeAddPaymentSuccess(payload: Payment) {
    this.store.dispatch(new paymentsActions.AddPaymentSuccess(payload));
  }

  /**
   * Call store Add Payment Fail
   */
  private storeAddPaymentFail(payload: any) {
    this.store.dispatch(new paymentsActions.AddPaymentFail(payload));
  }

  /**
   * Call store Add Payment
   */
  private storeUpdatePayment() {
    this.store.dispatch(new paymentsActions.UpdatePayment());
  }

  /**
   * Call store Add Payment Success
   */
  private storeUpdatePaymentSuccess(payload: Payment) {
    this.store.dispatch(
      new paymentsActions.UpdatePaymentSuccess(payload)
    );
  }

  /**
   * Call store Add Payment Fail
   */
  private storeUpdatePaymentFail(payload: any) {
    this.store.dispatch(new paymentsActions.UpdatePaymentFail(payload));
  }

  /**
   * Call store Delete Payment
   */
  private storeDeletePayment() {
    this.store.dispatch(new paymentsActions.DeletePayment());
  }

  /**
   * Call store Delete Payment Success
   */
  private storeDeletePaymentSuccess(payload: Payment) {
    this.store.dispatch(new paymentsActions.DeletePaymentSuccess(payload));
  }

  /**
   * Call store Delete Payment Fail
   */
  private storeDeletePaymentFail(payload: any) {
    this.store.dispatch(new paymentsActions.DeletePaymentFail(payload));
  }

  /**
   * Call store get all Payment
   */
  private storeGetAllPayments() {
    this.store.dispatch(new paymentsActions.GetAllPayments());
  }

  /**
   * Call store get all Payment success
   */
  private storeGetAllPaymentsSuccess(payload) {
    this.store.dispatch(new paymentsActions.GetAllPaymentsSuccess(payload));
  }

  /**
   * Call store get all Payment success
   */
  private storeGetAllPaymentsFail(payload) {
    this.store.dispatch(new paymentsActions.GetAllPaymentsFail(payload));
  }

  /**
   * Call store get all Payment success
   */
  private storeUnsetPayments() {
    this.store.dispatch(new paymentsActions.UnsetPayments());
  }
}
