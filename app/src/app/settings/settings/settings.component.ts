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

  settingsLoading = false;

  virtualWallet;

  constructor(private router: Router,
              public authService: AuthService,
              private apiService: ApiService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.virtualWallet = this.authService.getCurrentUser()['virtual_wallet'];
  }

  saveSettings() {
    this.settingsLoading = true;
    this.apiService.saveSettings(this.virtualWallet).subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          const response = this.apiService.parseAPIResponse(rawResponse);
          this.authService.setCurrentUser(response);
          this.authService.setCoinbaseTokens(response);
          this.settingsLoading = false;
        } else {
          console.log('errore');
          this.settingsLoading = false;
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
