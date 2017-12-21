import {Component, OnInit} from '@angular/core';
import {LangService} from '../../lang/lang.service';
import {ApiService} from '../../api/api.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
  privacyPolicyID: string = '74888565'; // default in english
  policyHtlm;

  constructor(public langService: LangService,
              private apiService: ApiService) {
  }

  ngOnInit() {

    if (this.langService.getCurrentLocale() === LangService.LOCALE_IT) {
      this.privacyPolicyID = '50239380';
    }

    this.apiService.getPrivacyPolicy(this.privacyPolicyID).subscribe(
      (rawResponse) => {
        this.policyHtlm = this.apiService.getIubendaContent(rawResponse);
      }
    );
  }

}
