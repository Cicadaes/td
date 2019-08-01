import { TitleProcedureService } from './../title-style-content/title-style-content.service'
import { ConfigApi } from './../../../../../../sdk-ui/api/config-api';
import { DataStore } from 'cosmos-td-sdk';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { CmModalService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { ReportConfigService } from '../../../../../../sdk-ui/service/report-config.service';

@Component({
    selector: 'title-style',
    templateUrl: './title-style-help.component.html',
    styleUrls: ['./title-style-help.component.less']
})
export class TitleComponent implements OnInit, OnDestroy {
    private _cubeId: number;
    private _queryId: string;
    private grids: any;
    private grid: any;
    private value: any;
    private _data: any;
    private subscription: Subscription;
    constructor(
        private TitleProcedureService: TitleProcedureService,
        public configApi: ConfigApi,
        private reportConfigService: ReportConfigService,

    ) {
        this.subscription = this.TitleProcedureService.missionisSave$.subscribe((data: any) => {
            this.ontitleConfig.emit(data);
            // this.Grid(data);
        });
        this.subscription = this.TitleProcedureService.missionshowSource$.subscribe((data: any) => {
            // this.Grid();
        })
    }
    @Output() ontitleConfig = new EventEmitter<any>();
    ngOnInit() {
        // this.Grid();
    }
    ngOnDestroy() {

    }
    show() {
        this.TitleProcedureService.showSourceOK();
    }
    // Grid(data?: any) {
    //     this.grids = [];
    //     if (data) {
    //         for (let k = 0; k < data.length; k++) {
    //             this.grids.push(data[k])
    //         }
    //     } else {
    //         this.grid = DataStore.getConfigData(this.configApi.scope);
    //         if (this.grid) {
    //             for (let j = 0; j < this.grid.length; j++) {
    //                 this.grids.push(this.grid[j])
    //             }

    //         }
    //     }
    // }
}