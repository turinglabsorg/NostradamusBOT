import {Component, OnInit} from '@angular/core';
import {LangService} from '../lang/lang.service';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  showFooter = false;

  constructor(public langService: LangService,
              private router: Router) {
  }

  ngOnInit() {
    this.router.events
      .subscribe(
        (e) => {
          if (e instanceof NavigationEnd) {
            if (e.url === '/signin') {
              this.showFooter = false;
            } else {
              this.showFooter = true;
            }
          }
        }
      );
  }

}
