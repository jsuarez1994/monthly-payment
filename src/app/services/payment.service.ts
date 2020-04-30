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
import { error } from 'protractor';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

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
    this.storeUnsetPayments();
  }


  addPayment(payment: Payment):void {
    this.storeAddPayment();
    const user: User = this.userService.getUser();
    this.firebaseService.doc(`${user.uid}/payments`).collection('items').add({...payment}).
    then(() => {
      this.storeAddPaymentSuccess(payment);
      this.messagesLiteralsToast(['ADD-PAYMENT.TOAST_TITLE_SUCCESS'], Constants.ICON_SUCCESS);
    })
    .catch(error => {
      this.storeAddPaymentFail(error);
      this.messagesLiteralsToast(['ADD-PAYMENT.TOAST_TITLE_FAIL'], Constants.ICON_ERROR);
    });
  }

  getAllPayments():void {
    this.storeGetAllPayments();
    /*const user: User = this.userService.getUser();
    this.subs = this.firebaseService.collection(`${user.uid}/payments/items`)
    .snapshotChanges()
    .pipe(map(items => {
      return items.map( item => {
        return {
          uid: item.payload.doc.id,
          ...item.payload.doc['data']
        };
      });
    })
    ).subscribe( payments => {
      this.storeGetAllPaymentsSuccess(payments);
    });*/
    
    
    // MOCK
    let list: Payment[] = [];
    list.push(new Payment('202001', 450, 'Alquiler','Fijo', 'Gasto'));
    list.push(new Payment('202001', 100, 'Coche','Fijo', 'Gasto'));
    list.push(new Payment('202001', 1300, 'Sueldo','Fijo', 'Ganancia'));
    list.push(new Payment('202001', 75, 'Cumpleaños amigo','Personal', 'Gasto'));
    list.push(new Payment('202002', 80, 'Restaurantes','Personal', 'Gasto'));
    list.push(new Payment('202002', 200, 'Cumpleaños','Fijo', 'Ganancia'));
    list.push(new Payment('202002', 1300, 'Sueldo','Fijo', 'Ganancia'));
    list.push(new Payment('202004', 80, 'Restaurantes','Personal', 'Gasto'));
    list.push(new Payment('202004', 200, 'Cumpleaños','Fijo', 'Ganancia'));
    list.push(new Payment('202004', 1300, 'Sueldo','Fijo', 'Ganancia'));

    this.storeGetAllPaymentsSuccess(list);

  }

  /**
   * Show message by literals
   * @param literals
   */
  private messagesLiteralsToast(literals: string[], icon:SweetAlertIcon ) {
    const mapLiterals = this.LiteralClass.getLiterals(literals);

    sweetAlert.toastMessage(
      mapLiterals.get(literals[0]),
      icon
    );
  }

  /**
   * Call store Add Payment
   */
  private storeAddPayment(){
    this.store.dispatch(new paymentsActions.AddPayment());
  }

  /**
   * Call store Add Payment Success
   */
  private storeAddPaymentSuccess(payload: Payment){
    this.store.dispatch(new paymentsActions.AddPaymentSuccess(payload));
  }

  /**
   * Call store Add Payment Fail
   */
  private storeAddPaymentFail(payload: any){
    this.store.dispatch(new paymentsActions.AddPaymentFail(payload));
  }

  /**
   * Call store get all Payment
   */
  private storeGetAllPayments(){
    this.store.dispatch(new paymentsActions.GetAllPayments());
  }

  /**
   * Call store get all Payment success
   */
  private storeGetAllPaymentsSuccess(payload){
    this.store.dispatch(new paymentsActions.GetAllPaymentsSuccess(payload));
  }

  /**
   * Call store get all Payment success
   */
  private storeGetAllPaymentsFail(payload){
    this.store.dispatch(new paymentsActions.GetAllPaymentsFail(payload));
  }

  /**
   * Call store get all Payment success
   */
  private storeUnsetPayments(){
    this.store.dispatch(new paymentsActions.UnsetPayments());
  }

}
