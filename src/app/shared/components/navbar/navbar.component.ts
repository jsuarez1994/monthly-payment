import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }


  signOut(){
    console.log('### CLOSE SESION ###');
    this.userService.logOutService();
  }
}
