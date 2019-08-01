import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as reducer from './ngrx/reducer';
import * as secondLevel from './ngrx/action/secondLevel';
import * as global from './ngrx/action/global';

import { CAMPAIGN_ACTIVITY_ITEM_LIST } from './constants/campaign-activity';
import { MARKETING_CENTER_ITEM_LIST } from './constants/marketing-center';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  itemList: any[] = CAMPAIGN_ACTIVITY_ITEM_LIST;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private store$: Store<reducer.State>
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        window.scrollTo(0, 0);
      } else if (event instanceof NavigationEnd) {
        Observable.of(this.activatedRoute)
        .map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        })
        .filter(route => route.outlet === 'primary')
        .mergeMap((route: any) => {
          let selectItem = MARKETING_CENTER_ITEM_LIST.find((item: any) => item.link === '/' + this.router.url.split('/')[1]);
          this.store$.dispatch({
            type: global.SET_GLOBAL_CURRCENT_ITEM,
            selectItem
          });
          this.store$.dispatch({
            type: global.SET_GLOBAL_ROUTER_URL,
            routerUrl: this.router.url
          })
          return route.paramMap
        })
        .subscribe((event: ParamMap) => {
          if(event.get('id')) {
            this.store$.dispatch({
              type: secondLevel.SET_SECOND_LEVEL_ID,
              secondLevelId: event.get('id')
            })
          }

          if(event.get('name')) {
            this.store$.dispatch({
              type: secondLevel.SET_SECOND_LEVEL_NAME,
              secondLevelName: event.get('name')
            })
          }
        });
      }
    })    
  }
}
