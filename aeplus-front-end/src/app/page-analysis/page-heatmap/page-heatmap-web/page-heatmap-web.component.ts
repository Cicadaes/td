import {Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PageHeatmapService} from '../page-heatmap.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-page-heatmap-web',
    templateUrl: './page-heatmap-web.component.html',
    styleUrls: ['./page-heatmap-web.component.less']
})
export class PageHeatmapWebComponent implements OnInit, OnChanges, OnDestroy {
    @Input() dateRange: any[];
    heatmapFilter: any;
    _dateRange: any;
    subscription: Subscription;

    constructor(private service: PageHeatmapService) {
        this.subscription = service.missionConfirmed$.subscribe(
            _dateRange => {
                this._dateRange = _dateRange;
                this.initHeatmapFilter();
            });
    }

    initHeatmapFilter() {
        this.heatmapFilter = {
            sourceid: 1,
            starttime_day: this._dateRange
        };
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    ngOnInit() {
    }
}
