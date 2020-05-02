import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { PaymentService } from '../../../services/payment.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [],
})
export class NavbarComponent implements OnInit {
  constructor(
    private userService: UserService,
    private paymentService: PaymentService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {}

  signOut() {
    console.log('### CLOSE SESION ###');
    this.userService.logOutService();
    this.paymentService.cancelSubs();
    this.categoryService.cancelSubs();
  }
}
