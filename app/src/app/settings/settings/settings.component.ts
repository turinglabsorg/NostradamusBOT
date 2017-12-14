import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {ApiService} from '../../api/api.service';
import {Subscription} from 'rxjs/Subscription';
import {LangService} from '../../lang/lang.service';
import {Console} from '../../console';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  authMessageSubscription: Subscription;

  settingsLoading = false;
  userValid = false;
  disconnectWalletLoading = false;

  virtualWallet;

  walletCurrencyToDisconnect = '';

  constructor(public langService: LangService,
              private router: Router,
              public authService: AuthService,
              private apiService: ApiService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.virtualWallet = this.authService.getCurrentUser()['virtual_wallet'];
    this.checkUserValidation();
    this.authMessageSubscription = this.authService.getMessage().subscribe(message => {
      if (message === AuthService.MSG_USER_READY) {
        Console.log(AuthService.MSG_USER_READY);
        this.virtualWallet = this.authService.getCurrentUser()['virtual_wallet'];
        this.checkUserValidation();
      }
    });
  }

  ngOnDestroy() {
    this.authMessageSubscription.unsubscribe();
  }

  onVirtualWalletSettingChange(virtualWalletValue) {
    this.virtualWallet = virtualWalletValue;
  }

  checkUserValidation() {
    this.userValid = this.virtualWallet === 'y' || this.virtualWallet === 'n';
  }

  saveSettings() {
    this.settingsLoading = true;
    if (this.userValid) {
      this.apiService.saveSettings(this.virtualWallet).subscribe(
        (rawResponse) => {
          if (this.apiService.isSuccessfull(rawResponse)) {
            const response = this.apiService.parseAPIResponse(rawResponse);
            this.authService.setCurrentUser(response);
            this.authService.setCoinbaseTokens(response);
            this.settingsLoading = false;
          } else {
            Console.log('errore');
            this.settingsLoading = false;
          }
        });
    }
  }

  askAccountDeletingConfirm(deleteAccountModal) {

    this.modalService.open(deleteAccountModal).result.then((result) => {
      this.deleteAccount();
    }, (reason) => {
      Console.log('modal closed negative');
    });
  }

  deleteAccount() {
    this.authService.deleteUser().subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          this.authService.signOut();
          this.router.navigate(['signin']);
        } else {
          Console.log('errore');
        }
      }
    );
  }

  askWalletDeletingConfirm(deleteWalletModal, currencyCode) {
    this.walletCurrencyToDisconnect = currencyCode;
    if (this.walletCurrencyToDisconnect != null && this.walletCurrencyToDisconnect !== '') {
      this.modalService.open(deleteWalletModal).result.then((result) => {
        this.deleteWallet();
      }, (reason) => {
        Console.log('modal closed negative');
      });
    }
  }

  deleteWallet() {
    this.disconnectWalletLoading = true;
    this.apiService.removeWallet(this.walletCurrencyToDisconnect).subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          this.authService.setCoinbaseToken('access', this.walletCurrencyToDisconnect, '');
          this.authService.setCoinbaseToken('refresh', this.walletCurrencyToDisconnect, '');
          this.disconnectWalletLoading = false;
        } else {
          Console.log('errore');
          this.disconnectWalletLoading = false;
        }
      }
    );
  }

}
