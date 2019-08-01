import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { CmModalService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { filterFixedService } from '../../../../../app/main/reportconfig/report/report-detail/filter-fixed/filter-fixed.service';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore } from 'cosmos-td-sdk';
import { Subscription } from 'rxjs/Subscription';
import { ReportConfigService } from '../../../../../sdk-ui/service/report-config.service';
import { DataStoreUtil, dataType } from '../../../../../sdk-ui/api/data-store-util';
@Component({
    selector: 'cm-report-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.less'],
})

export class filterComponent implements OnInit {
    private subscription: Subscription;
    private filters: any;
    private _cubeId: number;

    @Input()
    set cube(cube: any) {
        this._cubeId = cube;
        this.filter("init");
    }

    @Output() onFilterConfig = new EventEmitter<any>();

    constructor(
        private confirmServ: CmModalService,
        private filterFixedService: filterFixedService,
        public configApi: ConfigApi,
        private reportConfigService: ReportConfigService,
    ) {
        this.subscription = this.filterFixedService.missionisSave$.subscribe(() => {
            this.filter();
        })
    }

    ngOnInit() {
        
    }

    // 过滤器
    filter(type?: string) {      
        let filter = DataStoreUtil.getFilterData(this.configApi.scope, this._cubeId);
        // let filter = DataStoreUtil.getDataFromConfigData(this.configApi.scope,dataType.FILTERDATA);
        if(filter && !type){
            this.onFilterConfig.emit(filter);
        }
        this.filters = [];
        for (var key in filter) {
            this.filters.push(key)
        }
    }

    showConfirm(filter: any) {
        let that = this;
        this.confirmServ.confirm({
            title: '您是否确认要删除这项过滤器',
            onOk() {
                DataStoreUtil.removeFilterData(that.configApi.scope, that._cubeId, filter);
                that.filter();
            },
            onCancel() {
            }
        });
    }

    isShow(value: boolean, type: string) {
        this.filterFixedService.showSource(value, type, this._cubeId)
    }

    updateFilter(filter: any) {
        this.filterFixedService.UpdateFilter(this._cubeId,filter);
    }
}