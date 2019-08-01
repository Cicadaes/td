import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import * as reducer from './../../../ngrx/reducer';
import { Observable } from 'rxjs/Observable';
import { parseBreadcrumbConfig } from './../../../constants/breadcrumb-config';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './app-breadcrumb.component.html',
  styleUrls: ['./app-breadcrumb.component.less']
})
export class AppBreadcrumbComponent implements OnInit {
  @Input()
  itemList: any[];

  location: Location;

  guard$: Observable<any>;

  private _firstLevelName: string = '';
  private _firstLevelUrl: string = '';
  private _secondLevelName: string = '';
  private _secondLevelId: any;
  private _breadcrumbItems: any[] = [];

  constructor(
    private router: Router, 
    location: Location, 
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private store$: Store<reducer.State>
  ) {
    this.location = location;
    this.guard$ = store$.select('guard');
  }

  ngOnInit() {
    this.store$.select('secondLevel').subscribe((result: any) => {
      this._secondLevelName = result.secondLevelName;
      this._secondLevelId = result.secondLevelId;
    })
    
    this.initialBreadCrumbItems();
  }

  initialBreadCrumbItems() {
    this.store$.select('global').subscribe((result: any) => {
      let routerUrl = result.routerUrl;
      this._breadcrumbItems = parseBreadcrumbConfig(routerUrl);
      let max = this._breadcrumbItems[this._breadcrumbItems.length - 1].max;
      this._breadcrumbItems = this._breadcrumbItems.slice(this._breadcrumbItems.length - max, this._breadcrumbItems.length);
    })
  }

  navigate(item: any) {
    let commands = [item.back];
    if (item.backname) {
      commands.push(this._secondLevelName);
    }
    if (item.backid && this._secondLevelId) {
      commands.push(this._secondLevelId);
    }
    if (item.back) {
      this.router.navigate(commands);
    }
  }
}
