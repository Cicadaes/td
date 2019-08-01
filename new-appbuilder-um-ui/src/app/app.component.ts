import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
// import { Observable, Subject, asapScheduler, pipe, of, from,
//   interval, merge, fromEvent, filter } from 'rxjs';
import { filter } from 'rxjs/operator/filter';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppService } from './app.service';
import { Location } from '@angular/common';

import { AppCommunicationService } from './@themes/communication-service/app-communication.service';

import {NzTreeService} from 'ng-cosmos-ui';

interface ActiveRouteSetting {
  innerMenu: boolean;
  label: string;
  params: Params;
  url: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  // 是否显示收缩图标
  private showTrigger: any = null;
  isCollapsed = false;
  containerStyle: any;
  appConfig: any;
  appLogo: any = {};
  isShowInnerMenu = false;
  tenantId = '';
  firstUrl = '';
  public activeRouteSettings: ActiveRouteSetting[];

  @ViewChild('containersss') containersss: ElementRef;
  constructor(
    private appComService: AppCommunicationService,
    private location: Location,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: AppService,
  ) {
    // 开始模拟数据
    // this.mockService.mock();
    this.service.getAppConfig().then((response: any) => {
      window['appConfig'] = this.appConfig = response || {};
      window['appConfig']['apiCode'] = '/console-api';
      this.appComService.userInfo = response;
      this.goDefaultRouteByAppConfig();
      this.listenerRouterChange();
    }).catch((err: any) => {
      console.log(err);
    });
  }



  getUrlByMenu(menu: any) {
    let url = '';
    if (!menu.children || !menu.children.length) {
      url = menu.uri || menu.authorizationUri;
    }
    if (menu && menu.children && menu.children.length > 0) {
      url = menu.children[0].uri || menu.children[0].authorizationUri;
    }
    return url;
  }

  goDefaultRouteByAppConfig() {
    if (!this.appConfig.rolecode) {
      this.router.navigateByUrl('/nopermission');
    }
    const path = this.location.path();
    if (!path && this.appConfig && this.appConfig.menu && this.appConfig.menu.length > 0) {
      const menus = this.appConfig.menu;
      let url = '';
      if (menus && menus.length > 0) {
        for (let i = 0; i < menus.length; i++) {
          const menu = menus[i];
          url = this.getUrlByMenu(menu);
          if (url) {
            break;
          }
        }
      }
      if (url) {
        this.firstUrl = url;
        this.router.navigate([url]);
      }
    }



  }

  menuCollapsed(value: any) {
    this.isCollapsed = value;
  }

  calContainerStyle(): void {
    this.containerStyle = {
      height: window.innerHeight - 64 + 'px',
    };
  }

  // setPageTitle() {
  //   this.router.events
  //     .filter(event => event instanceof NavigationEnd)
  //     .map(() => this.activatedRoute)
  //     .map(route => {
  //       while (route.firstChild) route = route.firstChild;
  //       return route;
  //     })
  //     .filter(route => route.outlet === 'primary')
  //     .mergeMap(route => route.data)
  //     .subscribe((event) => this.titleService.setTitle(event['title']));
  // }

  listenerWindownResize() {
    fromEvent(window, 'resize').pipe(debounceTime(100))
      .subscribe((event) => {
        this.calContainerStyle();
      });
  }

  private getActiveRouteSettings(route: ActivatedRoute, url: string = '', activeRouteSettings: ActiveRouteSetting[] = []): ActiveRouteSetting[] {
    const ROUTE_DATA_INNERMENU = 'innerMenu';
    const ROUTE_DATA_TITLE = 'title';

    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return activeRouteSettings;
    }

    for (const child of children) {
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_TITLE)) {
        return this.getActiveRouteSettings(child, url, activeRouteSettings);
      }

      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      url += `/${routeURL}`;


      const activeRouteSetting: ActiveRouteSetting = {
        innerMenu: child.snapshot.data[ROUTE_DATA_INNERMENU] || false,
        label: child.snapshot.data[ROUTE_DATA_TITLE],
        params: child.snapshot.params,
        url: url
      };
      activeRouteSettings.push(activeRouteSetting);

      return this.getActiveRouteSettings(child, url, activeRouteSettings);
    }
    return activeRouteSettings;
  }

  getIsShowInnerMenu() {
    let isShow = false;
    if (this.appConfig && this.appConfig.rolecode === 'UM_OPER_ADMIN') {
      if (this.activeRouteSettings && this.activeRouteSettings.length > 0) {
        for (let i = 0; i < this.activeRouteSettings.length; i++) {
          if (this.activeRouteSettings[i].innerMenu) {
            isShow = true;
            break;
          }
        }
      }
    }
    return isShow;
  }

  setTenantId() {
    if (this.activeRouteSettings && this.activeRouteSettings.length > 0) {
      this.tenantId = this.activeRouteSettings[this.activeRouteSettings.length - 1].params['tenantId'];
    }
  }

  listenerRouterChange() {
    // 升级前的方法 暂时保留
    // this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
    //   const fullPa: any = this.router.url.split('?')[1];
    //   const deCodeparam: any = fullPa && fullPa.split('=')[0];
    //   try {
    //     const type: any = deCodeparam && JSON.parse(decodeURI(deCodeparam)).type;
    //     if (type && type !== 'search') {
    //       this.containersss.nativeElement.scrollTo(0, 0);
    //     }
    //   } catch (e) {

    //   }
    //   const root: ActivatedRoute = this.activatedRoute.root;
    //   this.activeRouteSettings = this.getActiveRouteSettings(root);
    //   this.activeRouteSettings = this.activeRouteSettings.reduce((x, y) => x.findIndex(e => e.label === y.label) < 0 ? [...x, y] : x, []);
    //   this.setTenantId();
    //   this.isShowInnerMenu = this.getIsShowInnerMenu();
    //   if (this.isShowInnerMenu) {
    //     this.showTrigger = '';
    //     this.isCollapsed = true;
    //   } else {
    //     this.showTrigger = null;
    //     this.isCollapsed = false;
    //   }
    // });
    this.router.events.subscribe(Event => {
      if (Event instanceof NavigationEnd) {
        const fullPa: any = this.router.url.split('?')[1];
        const deCodeparam: any = fullPa && fullPa.split('=')[0];
        try {
          const type: any = deCodeparam && JSON.parse(decodeURI(deCodeparam)).type;
          if (type && type !== 'search') {
            this.containersss.nativeElement.scrollTo(0, 0);
          }
        } catch (e) {

        }
        const root: ActivatedRoute = this.activatedRoute.root;
        this.activeRouteSettings = this.getActiveRouteSettings(root);
        this.activeRouteSettings = this.activeRouteSettings.reduce((x, y) => x.findIndex(e => e.label === y.label) < 0 ? [...x, y] : x, []);
        this.setTenantId();
        this.isShowInnerMenu = this.getIsShowInnerMenu();
        if (this.isShowInnerMenu) {
          this.showTrigger = '';
          this.isCollapsed = true;
        } else {
          this.showTrigger = null;
          this.isCollapsed = false;
        }
      }
    });
  }

  initAppLogo() {
    this.appLogo = {
      logo: './assets/images/tdlogo2.png',
      name: '后台系统'
    };
  }

  ngOnInit() {

    NzTreeService.prototype.resetNodeLevel = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
      if(!node){
        return;
      }
      if (node.getParentNode()) {
        node.level = node.getParentNode().level + 1;
      }
      else {
        node.level = 0;
      }
      for (var _i = 0, _a = node.getChildren(); _i < _a.length; _i++) {
        var child = _a[_i];
        this.resetNodeLevel(child);
      }
    };

    this.initAppLogo();
    // this.setPageTitle();
    this.calContainerStyle();
    this.listenerWindownResize();
  }

  ngOnDestroy() {

  }

}
