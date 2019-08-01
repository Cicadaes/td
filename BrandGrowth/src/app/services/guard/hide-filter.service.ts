import { Injectable } from '@angular/core';
import {
  CanActivate, // 守卫，处理导航到某路由的情况。
  CanDeactivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild // 守卫，处理导航到子路由的情况
} from '@angular/router';

import { Store } from '@ngrx/store';
import * as reducer from './../../ngrx/reducer';
import * as guard from './../../ngrx/action/guard';

@Injectable()
export class HideFilterService { // 隐藏filter-bar
  constructor(private store: Store<reducer.State>) {

  }

  canDeactivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.store.dispatch(new guard.HideFilterAction());
    return true;
  }
}
