import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { PaymentService } from '../../../services/payment.service';
import { CategoryService } from '../../../services/category.service';
import {MenuItem} from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import * as literals from '../../../shared/Utils/literals';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [],
})
export class NavbarComponent implements OnInit {

  submenu: MenuItem[];
  LiteralClass: literals.Literals;
  logOut: string;

  constructor(
    private userService: UserService,
    private paymentService: PaymentService,
    private categoryService: CategoryService,
    private translate: TranslateService
  ) {
    this.LiteralClass = new literals.Literals(this.translate);
  }

  ngOnInit(): void {
    this.logOut = this.getTranslate('NAVBAR.SIGN_OUT');
    this.getSubMenu();
  }

  /**
   * 
   */
  getSubMenu(){
    this.submenu = [
      {
        label: this.getTranslate('NAVBAR.PAYMENTS'),
        icon: 'fas fa-wallet',
        routerLink: '/',
        routerLinkActiveOptions: {exact: true}
      },
      {
        label: this.getTranslate('NAVBAR.STATISTICS'),
        icon: 'pi pi-chart-line',
        routerLink: '/statistics',
        routerLinkActiveOptions: {exact: true}
      },
      {
        label: this.getTranslate('NAVBAR.SETTINGS'),
        icon: 'pi pi-sliders-h',
        routerLink: '/config-user',
        routerLinkActiveOptions: {exact: true}
      }
    ];
  }

  getTranslate(label: string) {
    return this.LiteralClass.getLiterals([label]).get(label);
  }

  signOut() {
    this.userService.logOutService();
    this.paymentService.cancelSubs();
    this.categoryService.cancelSubs();
  }
}
