import {Component, Injector, OnInit, OnChanges} from '@angular/core';
import {BaseComponent} from '../../common/base-component';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {debounceTime} from 'rxjs/operators/debounceTime';

@Component({
    selector: 'app-marketing-manage',
    templateUrl: './marketing-manage.component.html',
    styleUrls: ['./marketing-manage.component.less']
})
export class MarketingManageComponent extends BaseComponent implements OnInit, OnChanges {

    tabList: any = [
        {
            url: '/manage/marketing-manage/crowd-manage',
            name: '人群维度配置'
        }, {
            url: '/manage/marketing-manage/index-manage',
            name: '指标相关配置'
        }, {
            url: '/manage/marketing-manage/event-manage',
            name: '事件相关配置'
        }, {
            url: '/manage/marketing-manage/ascribe-manage',
            name: '归因模型配置'
        }
    ];

    _containerStyle = {
        height: '',
        overflow: 'auto'
    };

    constructor(private injector: Injector) {

        super(injector);
        this.initRouterList('营销管理');

        this.listenerWindownResize();
    }

    calContainerStyle(): void {
        setTimeout(() => {
            const maxHeight = window.innerHeight - 105;
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
