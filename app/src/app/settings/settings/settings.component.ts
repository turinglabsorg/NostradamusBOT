import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {ApiService} from '../../api/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  virtualWallet = 'y'; /* get from user */

  constructor(private router: Router,
              public authService: AuthService,
              private apiService: ApiService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  saveSettings() {
    this.apiService.saveSettings(this.virtualWallet).subscribe(
      (rawResponse) => {
      if (this.apiService.isSuccessfull(rawResponse)) {

      } else {
        console.log('errore');
      }
    });
  }

  askAccountDeletingConfirm(deleteAccountModal) {

    this.modalService.open(deleteAccountModal).result.then((result) => {
      this.deleteAccount();
    }, (reason) => {
      console.log('modal closed negative');
    });
  }

  deleteAccount() {
    this.authService.deleteUser().subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          this.authService.signOut();
          this.router.navigate(['signin']);
        } else {
          console.log('errore');
        }
      }
    );
  }

}
