import {Component, Input, OnInit} from '@angular/core';
import {RulesService} from '../rules.service';

@Component({
  selector: 'app-rules-list',
  templateUrl: './rules-list.component.html',
  styleUrls: ['./rules-list.component.css']
})
export class RulesListComponent implements OnInit {

  constructor(public rulesService: RulesService) {
  }

  ngOnInit() {
  }

}
