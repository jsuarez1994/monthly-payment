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

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  // TO TRADUCT LITERALS
  LiteralClass: literals.Literals;

  constructor(
    private userService: UserService,
    private firebaseService: AngularFirestore,
    private translate: TranslateService,
    private store: Store<AppState>
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
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
   * Call store Add Payment
   */
  private storeAddPaymentFail(payload: any){
    this.store.dispatch(new paymentsActions.AddPaymentFail(payload));
  }

}
