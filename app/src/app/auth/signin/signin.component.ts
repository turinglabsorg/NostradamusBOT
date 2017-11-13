import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  coinbaseAuthCodeRequestURL: string;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.coinbaseAuthCodeRequestURL = this.authService.getCoinbaseAuthCodeRequestURL();
  }
}
