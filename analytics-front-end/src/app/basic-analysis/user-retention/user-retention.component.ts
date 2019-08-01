import { Component, Injector, OnInit, OnChanges } from '@angular/core';
import { BaseComponent } from '../../common/base-component';

@Component({
  selector: 'app-user-retention',
  templateUrl: './user-retention.component.html',
  styleUrls: ['./user-retention.component.less']
})
export class UserRetentionComponent extends BaseComponent implements OnInit, OnChanges {
  _filter: any;

  constructor(private injector: Injector) {
    super(injector);
    this.initRouterList('留存分析');
  }

  onBackFilter(filter: any) {
    this._filter = filter;
    console.dir([this._filter]);
  }

  ngOnInit() {}
}
