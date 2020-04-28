import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.paymentService.getAllPayments();
  }

}
