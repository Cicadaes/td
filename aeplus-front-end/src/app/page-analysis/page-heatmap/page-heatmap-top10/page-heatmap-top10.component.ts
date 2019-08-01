import {Component, Input, SimpleChanges, Injector, OnInit, OnChanges} from '@angular/core';
import {PageHeatmapService} from '../page-heatmap.service';
import {BaseComponent} from '../../../common/base-component';

@Component({
    selector: 'app-page-heatmap-top10',
    templateUrl: './page-heatmap-top10.component.html',
    styleUrls: ['./page-heatmap-top10.component.less']
})
export class PageHeatmapTop10Component extends BaseComponent implements OnInit, OnChanges {
    @Input() queryParam: any;
    @Input() datas: any[];
    _datas: any[] = [];
    _isShowTopLink: boolean;
    _queryParam: any;
    urlParams: any;

    constructor(private service: PageHeatmapService,
                private injector: Injector) {
        super(injector);
        this.urlParams = {};
    }

    goPage(hash: string) {
        this.commonService.goPage(hash);
    }

    toggleShowTopLink() {
        this._isShowTopLink = !this._isShowTopLink;
        if (this._isShowTopLink) {
            this.addEventHandler(document, 'mousedown', this.bindAsEventListener(this, this.hideSearchPanel));
        }
    }

    checkIsSelectByPath(path) {
        let is = false;
        if (path && path.length > 0) {
            for (let i = 0; i < path.length; i++) {
                if (path[i].className && path[i].className.indexOf('td-heat-map-ranking') !== -1) {
                    is = true;
                }
            }
        }
        return is;
    }

    hideSearchPanel($event) {
        if (this.checkIsSelectByPath($event.path)) {
            return false;
        }
        this._isShowTopLink = false;
        this.removeEventHandler(document, 'mousedown', this.bindAsEventListener(this, null));
    }

    bindAsEventListener = function (object, fun) {
        return function (event) {
            return fun.call(object, (event || window.event));
        };
    };

    addEventHandler(oTarget, sEventType, fnHandler) {
        if (oTarget.addEventListener) {
            oTarget.addEventListener(sEventType, fnHandler, true);
        } else if (oTarget.attachEvent) {
            oTarget.attachEvent('on' + sEventType, fnHandler);
        } else {
            oTarget['on' + sEventType] = fnHandler;
        }
    }

    removeEventHandler(oTarget, sEventType, fnHandler) {
        if (oTarget.removeEventListener) {
            oTarget.removeEventListener(sEventType, fnHandler, true);
        } else if (oTarget.detachEvent) {
            oTarget.detachEvent('on' + sEventType, fnHandler);
        } else {
            oTarget['on' + sEventType] = null;
        }
    }

    downloadAllLinkData() {
        let title = '';
        const dateRange = this.globals.dateFormat(this._queryParam.starttime_day[0], '') + '至'
            + this.globals.dateFormat(this._queryParam.starttime_day[1], '');
        if (this._queryParam && this._queryParam.sourceid === 1) {
            title = '页面分析-页面热力图-Web页面-链接点击图-数据导出-' + dateRange;
        } else if (this._queryParam && this._queryParam.sourceid === 2) {
            title = '页面分析-页面热力图-H5页面-链接点击图-数据导出-' + dateRange;
        }
        const param = {
            productid: this.productId,
            title: title,
            param: this._queryParam || {}
        };
        this.service.downloadHeatmapData(param).subscribe((response: any) => {
            // todo
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.datas) {
            this._datas = changes.datas.currentValue;
        }
        if (changes.queryParam) {
            this._queryParam = changes.queryParam.currentValue;
        }
    }

    ngOnInit() {
    }

}
