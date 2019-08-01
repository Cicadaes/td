import { TableProcedureService } from './../table-style-content/table-style-content.service'
import { ConfigApi } from './../../../../../../sdk-ui/api/config-api';
import { DataStore } from 'cosmos-td-sdk';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { CmModalService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { ReportConfigService } from '../../../../../../sdk-ui/service/report-config.service';

@Component({
    selector: 'table-style',
    templateUrl: './table-style-help.component.html',
    styleUrls: ['./table-style-help.component.less']
})
export class TableStyleHelpComponent implements OnInit, OnDestroy {
    private _cubeId: number;
    private _queryId: string;
    private grids: any;
    private grid: any;
    private value: any;
    private _data: any;
    private subscription: Subscription;
    constructor(
        private TableProcedureService: TableProcedureService,
        public configApi: ConfigApi,
        private reportConfigService: ReportConfigService,

    ) {
        this.subscription = this.TableProcedureService.missionisSave$.subscribe((data: any) => {
            this.ongridConfig.emit(data);
            // this.Table(data);
        });
        this.subscription = this.TableProcedureService.missionshowSource$.subscribe((data: any) => {
            // this.Table();
        })
    }
    @Output() ongridConfig = new EventEmitter<any>();
    ngOnInit() {
        // this.Table();
    }
    ngOnDestroy() {

    }
    show() {
        this.TableProcedureService.showSourceOK();
    }
    // Table(data?: any) {
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