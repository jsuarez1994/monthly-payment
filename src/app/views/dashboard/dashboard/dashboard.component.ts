import { Component, OnDestroy, OnInit } from '@angular/core';
// ROUTER
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
// RXJS
import { Subscription } from 'rxjs';
// NGRX
import { AppState } from '../../../redux/app.reducers';
// CONSTANTS
import { Constants } from '../../../shared/Utils/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  sub: Subscription = new Subscription();

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    // IF USER IS AUTHENTICATED
    this.sub = this.store.select('user').subscribe((response) => {
      if (!response.authenticated) {
        console.log(' ### NOT AUTHENTICATED ### ');
        // NAVIGATO TO UPDATE PAYMENT
        this.router.navigate(['/'.concat(Constants.LOGIN_PATH)]);
      }
    });
  }
}
