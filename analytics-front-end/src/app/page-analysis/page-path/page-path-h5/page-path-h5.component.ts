import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { PagePathService } from '../page-path.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page-path-h5',
  templateUrl: './page-path-h5.component.html',
  styleUrls: ['./page-path-h5.component.less']
})
export class PagePathH5Component implements OnInit, OnChanges, OnDestroy {
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
    this.pagePathFilter.sourceid = 'H5';
  }

  ngOnChanges() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {}
}
