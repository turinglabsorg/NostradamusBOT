import { Component, OnInit } from '@angular/core';
import {LangService} from '../../lang/lang.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  constructor(public langService: LangService) { }

  ngOnInit() {
  }

}
