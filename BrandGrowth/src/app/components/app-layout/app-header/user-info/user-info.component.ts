import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Store } from '@ngrx/store';
import * as reducer from './../../../../ngrx/reducer';
import * as disabled from './../../../../ngrx/action/disabled';
import * as global from './../../../../ngrx/action/global';
import { Observable } from 'rxjs/Observable';

const _ = require('lodash');

// import Services
import { UserSourceService } from '../../../../services/source/user.source.service';


@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class UserInfoComponent implements OnInit {
  userData$: Observable<any>

  private _userData: any = {
    "developer": {
      "id": 1,
      "email": "undefined",
      "companyName": null,
      "qq": null,
      "name": null,
      "telephone": null,
      "state": 0,
      "flow": 1,
      "flowEndTime": new Date(),
      "denyLoginTime": null,
      "registerTime": new Date()
    },
    "leftFlow": 0,
    "leftDay": 0,
    "totalDay": 0
  }

  constructor(
    private userSourceService: UserSourceService,
    private store: Store<reducer.State>
  ) {
    this.userData$ = this.userSourceService.getUserData();
  }

  ngOnInit() {
    this.userData$.subscribe(data => {
      if (data && data.result) {
        this._userData = data.result;
        this.store.dispatch({
          type: disabled.SET_DISABLED_TIME,
          startDisabledTime: data.result.developer && new Date(data.result.developer.registerTime).getTime(),
          endDisabledTime: data.result.developer && new Date(data.result.developer.flowEndTime).getTime()
        })
        this.store.dispatch({
          type: global.SET_GLOBAL_AUTH_DATA_ACTION,
          email: data.result.developer && data.result.developer.email
        })
      }
    })
  }

}
