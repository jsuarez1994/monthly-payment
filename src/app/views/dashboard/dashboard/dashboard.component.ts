import { Component, OnInit, OnDestroy } from '@angular/core';
// SERVICES
import { PaymentService } from '../../../services/payment.service';
import { CategoryService } from '../../../services/category.service';
// NGRX
import { AppState } from '../../../redux/app.reducers';
import { Store } from '@ngrx/store';
// RXJS
import { Subscription } from 'rxjs';
// ROUTER
import { Router } from '@angular/router';
// CONSTANTS
import { Constants } from '../../../shared/Utils/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {

  sub: Subscription = new Subscription();

  constructor(
    private paymentService: PaymentService,
    private categoryService: CategoryService,
    private store:Store<AppState>,
    private router: Router
  ) {}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    // IF USER IS AUTHENTICATED
    this.sub = this.store.select('user').subscribe( response => {
      if(response.authenticated){
        console.log(' ### AUTHENTICATED ### ');
        this.paymentService.getAllPayments();
        this.categoryService.getAllCategories();
      } else {
        console.log(' ### NOT AUTHENTICATED ### ');
        // NAVIGATO TO UPDATE PAYMENT
        this.router.navigate(['/'.concat(Constants.LOGIN_PATH)]);
      }
    });
  }
}
