import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PageHeatmapService } from '../page-heatmap.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page-heatmap-h5',
  templateUrl: './page-heatmap-h5.component.html',
  styleUrls: ['./page-heatmap-h5.component.less']
})
export class PageHeatmapH5Component implements OnInit, OnChanges, OnDestroy {
  @Input() dateRange: any[];
  heatmapFilter: any;
  _dateRange: any;
  subscription: Subscription;

  constructor(private service: PageHeatmapService) {
    this.subscription = service.missionConfirmed$.subscribe(_dateRange => {
      this._dateRange = _dateRange;
      this.initHeatmapFilter();
    });
  }

  initHeatmapFilter() {
    this.heatmapFilter = {
      sourceid: 2,
      starttime_day: this._dateRange
    };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit() {}
}
