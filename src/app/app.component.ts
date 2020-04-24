import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'monthly-payment';

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    // HACER MANUAL TRASNLATE
    this.getConfigTranslate();
  }
  
  getConfigTranslate() {
    this.translate.addLangs(['es']);
    this.translate.setDefaultLang('es');
    const browserLang = this.translate.getBrowserLang().toUpperCase();
    this.translate.use(browserLang.match(/es/) ? browserLang : 'es');
  }
}
