import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { PagePathService } from '../page-path.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page-path-mini-program',
  templateUrl: './page-path-mini-program.component.html',
  styleUrls: ['./page-path-mini-program.component.less']
})
export class PagePathMiniProgramComponent implements OnInit, OnChanges, OnDestroy {
  pagePathFilter: any;
  _allFilter: any;
  subscription: Subscription;

  constructor(private service: PagePathService) {
    this.subscription = service.missionConfirmed$.subscribe(allFilter => {
      this._allFilter = allFilter;
      this.initHeatmapFilter();
    });
  }

  initHeatmapFilter() {
    this.pagePathFilter = this._allFilter;
    this.pagePathFilter.sourceid = 'miniprogram';
  }

  ngOnChanges() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {}
}
