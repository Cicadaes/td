import {Component, OnInit, Injector, OnChanges} from '@angular/core';
import {BaseComponent} from '../../common/base-component';
import {fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
    selector: 'app-apply-manage',
    templateUrl: './apply-manage.component.html',
    styleUrls: ['./apply-manage.component.less']
})
export class ApplyManageComponent extends BaseComponent implements OnInit, OnChanges {

    tabList: any = [
        {
            url: '/manage/apply-manage/app-push',
            name: '应用推送配置'
        },
        {
            url: '/manage/apply-manage/sms-edm',
            name: '短信邮件配置'
        }
    ];

    _containerStyle = {
        height: '',
        overflow: 'auto'
    };

    constructor(private injector: Injector) {

        super(injector);
        this.initRouterList('推送配置');

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
