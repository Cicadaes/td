import {Component, Injector, OnInit, OnChanges} from '@angular/core';
import {BaseComponent} from '../common/base-component';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {debounceTime} from 'rxjs/operators/debounceTime';

@Component({
    selector: 'app-product-center',
    templateUrl: './product-center.component.html',
    styleUrls: ['./product-center.component.less']
})
export class ProductCenterComponent extends BaseComponent implements OnInit, OnChanges {

    _containerStyle = {
        height: '',
        overflow: 'auto'
    };

    constructor(private injector: Injector) {
        super(injector);
        this.initRouterList('产品中心');

        this.listenerWindownResize();
    }

    calContainerStyle(): void {
        setTimeout(() => {
            const page_custom_header = document.getElementById('page-custom-header');
            let headHg = 90;
            if (page_custom_header) {
                headHg = page_custom_header.offsetHeight + 40;
            }
            const maxHeight = window.innerHeight - headHg;
            this._containerStyle = {
                height: maxHeight.toString() + 'px',
                overflow: 'auto'
            };
        }, 200);
    }

    listenerWindownResize() {
        this.calContainerStyle();
        fromEvent(window, 'resize').pipe(
            debounceTime(100)
        ).subscribe((event) => {
            this.calContainerStyle();
        });
    }

    ngOnInit() {
    }

}
