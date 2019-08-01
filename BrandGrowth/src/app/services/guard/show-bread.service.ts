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

// import Contants
import { CHAIN_DETAILS } from '../../constants/chain-details';

@Injectable()
export class ShowBreadService implements CanActivate { // 显示面包屑
  constructor(private store: Store<reducer.State>) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.store.dispatch({
      type: guard.SHOW_BREAD,
      navList: null
    })
    return true;
  }
}
