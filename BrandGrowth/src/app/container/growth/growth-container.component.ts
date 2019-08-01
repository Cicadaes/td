import { Component, OnInit, ChangeDetectorRef, OnDestroy, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as reducer from './../../ngrx/reducer';
import * as global from '../../ngrx/action/global';
import * as secondLevel from '../../ngrx/action/secondLevel';
import * as moment from 'moment';
import { Router } from "@angular/router"
import { AsyncPipe } from '@angular/common';

const _ = require("lodash");


@Component({
  selector: 'growth-container',
  templateUrl: './growth-container.component.html',
  styleUrls: ['./growth-container.component.less'],
  providers: [
    AsyncPipe
  ]
})
export class GrowthContainerComponent implements OnInit {

  constructor(
    private router: Router,
    private store$: Store<reducer.State>,
    private asyncPipe: AsyncPipe,
  ) {
    
  }             

  ngOnInit() {    

  }

}
