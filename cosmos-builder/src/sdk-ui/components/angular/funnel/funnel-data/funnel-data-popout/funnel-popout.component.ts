import { funnelProcedureService } from './../funnel-data-procedure/funnel-procedure.service'
import { ConfigApi } from './../../../../../../sdk-ui/api/config-api';
import { DataStore } from 'cosmos-td-sdk';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { CmModalService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { ReportConfigService } from '../../../../../../sdk-ui/service/report-config.service';
import { DataStoreUtil, dataType } from "./../../../../../api/data-store-util";


@Component({
    selector: 'funnel-popout',
    templateUrl: './funnel-popout.component.html',
    styleUrls: ['./funnel-popout.component.less']
})
export class FunnelPopoutComponent implements OnInit, OnDestroy {
    private _cubeId: number;
    private _queryId: string;
    private Funnels: any;
    private funnel: any;
    private value: any;
    private _data: any;
    private subscription: Subscription;
    constructor(
        private funnelProcedureService: funnelProcedureService,
        public configApi: ConfigApi,
        private reportConfigService: ReportConfigService,

    ) {
        //保存
        this.subscription = this.funnelProcedureService.missionisSave$.subscribe((data: any) => {
            let label = {}
            label[this._queryId] = data
            DataStoreUtil.saveData2ConfigData(this.configApi.scope, dataType.FUNNELSTEPDATA, label);
            this.onFunnelConfig.emit(DataStoreUtil.getDataFromConfigData(this.configApi.scope, dataType.FUNNELSTEPDATA));
            this.Funnel(data);
        });
        //显示
        this.subscription = this.funnelProcedureService.missionshowSource$.subscribe((data: any) => {
            this.Funnel();
        })
    }
    @Output() onFunnelConfig = new EventEmitter<any>();
    ngOnInit() {
        this.Funnel();
    }
    ngOnDestroy() {

    }
    show() {
        this.funnel = DataStoreUtil.getDataFromConfigData(this.configApi.scope, dataType.FUNNELSTEPDATA);
        if (this.funnel && this.funnel[this._queryId] && this.funnel[this._queryId].length > 0) {
            let data = this.funnel[this._queryId]
            this.funnelProcedureService.showSourceOK(data);
        } else {
            this.funnelProcedureService.showSourceOK();
        }
        if (this._cubeId && this._queryId) {
            this.funnelProcedureService.UpdateFunnel(this._cubeId, this._queryId)
        }
    }
    ;
    Funnel(data?: any) {
        this.Funnels = [];
        if (data) {
            for (let k = 0; k < data.length; k++) {
                this.Funnels.push(data[k])
            }
        } else {
            this.funnel = DataStoreUtil.getDataFromConfigData(this.configApi.scope, dataType.FUNNELSTEPDATA);
            
            if (this.funnel&&this.funnel[this._queryId]) {
                for (let j = 0; j < this.funnel[this._queryId].length; j++) {
                    this.Funnels.push(this.funnel[this._queryId][j])
                }

            }
        }
    }
    @Input()
    set cube(cube: any) {
        this._cubeId = cube;
    }
    @Input()
    set query(query: any) {
        if (this._queryId !== query) {
            if (this._queryId) {
                let inspect = DataStoreUtil.getDataFromConfigData(this.configApi.scope, dataType.FUNNELSTEPDATA);
                if (inspect) {
                    inspect = {};
                    DataStoreUtil.saveData2ConfigData(this.configApi.scope, dataType.FUNNELSTEPDATA, inspect);
                }
            }
            this._queryId = query;
            this.Funnel();
        } else {
            this._queryId = query;
        }
    }
}