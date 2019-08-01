import {Component, Injector, OnInit, OnChanges} from '@angular/core';
import {BaseComponent} from '../../common/base-component';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {debounceTime} from 'rxjs/operators/debounceTime';

@Component({
    selector: 'app-manage-system',
    templateUrl: './manage-system.component.html',
    styleUrls: ['./manage-system.component.less']
})

export class ManageSystemComponent extends BaseComponent implements OnInit, OnChanges {

    tabList: any = [
        {
            url: '/manage/manage-system/event-mgt',
            name: '事件管理'
        }, {
            url: '/manage/manage-system/event-attribute',
            name: '事件属性管理'
        }, {
            url: '/manage/manage-system/user-attribute',
            name: '用户属性管理'
        }, {
            url: '/manage/manage-system/source-mgt',
            name: '来源管理'
        }, {
            url: '/manage/manage-system/activity-mgt',
            name: '活动管理'
        }, {
            url: '/manage/manage-system/page-mgt',
            name: '页面管理'
        }, {
            url: '/manage/manage-system/user-click-map',
            name: '页面点击图管理'
        }, {
            url: '/manage/manage-system/app-info',
            name: '应用信息'
        }
    ];

    _containerStyle = {
        height: '',
        overflow: 'auto'
    };

    isAutoMNP: boolean = false;

    constructor(private injector: Injector) {

        super(injector);
        this.initRouterList('系统管理');

        this.listenerWindownResize();

        const that = this;
        window.parent.postMessage(JSON.stringify({eventType: 'transfer'}), '*');
        window.addEventListener('message', function (event: any) {
            if (event.data && typeof event.data === 'string') {
                const data = JSON.parse(event.data);
                if (data && data.eventInfo && data.eventType === 'transfer') {
                    const list = data.eventInfo.data;
                    const length = list.length;
                    for (let i = 0; i < length; i++) {
                        if (list[i].code === 'miniprogram') {
                            that.isAutoMNP = true;

                            // 在 7 的位置加入一条
                            if (that.tabList[7] && that.tabList[7].url === '/manage/manage-system/qrcode') {
                                break;
                            } else {
                                const obj = that.tabList[7];
                                that.tabList[7] = {
                                    url: '/manage/manage-system/qrcode',
                                    name: '小程序二维码管理',
                                    show: false
                                };
                                that.tabList.push(obj);
                                break;
                            }
                        }
                    }
                }
            }
        });
    }

    calContainerStyle(): void {
        setTimeout(() => {
            const maxHeight = window.innerHeight - 110;
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
