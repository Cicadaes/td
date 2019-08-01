import {Component, OnInit, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import {PagePathService} from '../page-path.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-page-path-app',
    templateUrl: './page-path-app.component.html',
    styleUrls: ['./page-path-app.component.less']
})
export class PagePathAppComponent implements OnInit, OnChanges, OnDestroy {
    pagePathFilter: any;
    _allFilter: any;
    subscription: Subscription;

    constructor(private service: PagePathService) {
        this.subscription = service.missionConfirmed$.subscribe(
            allFilter => {
                this._allFilter = allFilter;
                this.initHeatmapFilter();
            });
    }

    initHeatmapFilter() {
        this.pagePathFilter = this._allFilter;
        this.pagePathFilter.sourceid = 'App';
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    ngOnInit() {
    }

}
