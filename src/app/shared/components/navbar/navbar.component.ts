import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {

  constructor(private userService: UserService, private paymentService: PaymentService) { }

  ngOnInit(): void {
  }


  signOut(){
    console.log('### CLOSE SESION ###');
    this.userService.logOutService();
    this.paymentService.cancelSubs();
  }
}
