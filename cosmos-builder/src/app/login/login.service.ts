import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from "@angular/router";
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

interface AppState {
    loginValidator: any;
}

@Injectable()
export class LoginService implements CanActivate {
    userModel = {
        isLogin: true,　// 判断是否登录
        
    };
    loginValidator$: any;
    isLogin:boolean;
      

    constructor(
        private router: Router,
        private store: Store<AppState>
    ) { 
        this.loginValidator$ = store.select('loginValidator');
        this.loginValidator$.subscribe((data:any)=> {
            this.isLogin = data;
        });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // 返回值 true: 跳转到当前路由 false: 不跳转到当前路由
        // 当前路由名称
        var path = route.routeConfig.path;
        // nextRoute: 设置需要路由守卫的路由集合
        const nextRoute = ['main'];
        let isLogin = this.isLogin;  // 是否登录
        // 当前路由是nextRoute指定页时
        if (nextRoute.indexOf(path) >= 0) {
            if (!isLogin) {
                // 未登录，跳转到login
                this.router.navigate(['login']);
                return false;
            } else {
                // 已登录，跳转到当前路由
                return true;
            }
        }
        // 当前路由是login时 
        if (path === 'login') {
            if (!isLogin) {
                // 未登录，跳转到当前路由
                return true;
            } else {
                // 已登录，跳转到main
                this.router.navigate(['main']);
                return false;
            }
        }
    }

}
  

