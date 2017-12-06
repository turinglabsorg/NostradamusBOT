import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {RulesService} from '../../rules/rules.service';
import {ActionsService} from '../actions.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions-list.component.html',
  styleUrls: ['./actions-list.component.css']
})
export class ActionsComponent implements OnInit {
  actionsReady = false;
  rulesReady = false;

  isLoading = false;

  constructor(private apiService: ApiService,
              private rulesService: RulesService,
              public actionsService: ActionsService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.getActions();
    this.getRules();
  }

  getActions() {
    this.apiService.getActions().subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          this.actionsService.setActions(this.apiService.parseAPIResponse(rawResponse));
          this.actionsReady = true;
          this.showContent();
        } else {
          console.log('errore');
        }
      }
    );
  }

  getRules() {
    this.apiService.getRules().subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          this.rulesService.setRules(this.apiService.parseAPIResponse(rawResponse));
          this.rulesReady = true;
          this.showContent();
        } else {
          console.log('errore');
        }
      }
    );
  }

  showContent() {
    if (this.actionsReady && this.rulesReady) {
      this.actionsService.initActionsList();
      this.isLoading = false;
    }
  }

}
