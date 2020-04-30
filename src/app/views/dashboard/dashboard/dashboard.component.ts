import { Component, OnInit } from '@angular/core';
// SERVICES
import { PaymentService } from '../../../services/payment.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit {
  constructor(
    private paymentService: PaymentService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.paymentService.getAllPayments();
    this.categoryService.getAllCategories();
  }
}
