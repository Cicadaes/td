import { Injectable } from '@angular/core';
import {
  CanActivate, // 守卫，处理导航到某路由的情况。
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild // 守卫，处理导航到子路由的情况
} from '@angular/router';

import { Store } from '@ngrx/store';
import * as reducer from './../../ngrx/reducer';
import * as guard from './../../ngrx/action/guard';

@Injectable()
export class ShowTimeService implements CanActivate { // 显示选择活动时间范围
  constructor(private store: Store<reducer.State>) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.store.dispatch(new guard.ShowTimeAction());
    return true;
  }
}
