import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from '../../main.service';
import { DatasourceListService } from './datasource-list.service'
import { DatasourceHomeService } from '../datasource-home/datasource-home.service';
import { Subscription } from 'rxjs/Subscription';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
@Component({
    selector: 'datasource-list',
    templateUrl: './datasource-list.component.html',
    styleUrls: ['./datasource-list.component.less'],
    providers: [DatasourceListService]
})
export class DatasourceListComponent implements OnInit, OnDestroy {
    _dataSet:any= [];//必须在此声明,下面声明会从新为空
    _total: number;
    subscription: Subscription;//重复订阅问题
    queryParam: any = {
        page: 1,
        pageSize: 10,
        nameOperator: "like",
        orderBy: "createTime",
        order: "desc"
    }//初始请求数据
    constructor(
        private mainService: MainService, 
        private datasourceListService: DatasourceListService, 
        private datasourceHomeService: DatasourceHomeService,
        private _notification: CmNotificationService
    ) {
        this.subscription = this.datasourceHomeService.missionGrabble$.subscribe((grabble: any) => {
            this.queryParam.page = 1;
            this.queryParam.pageSize = 10;
            this.searchMissHandler(grabble);
        });
    };

    searchMissHandler(grabble: any) {
        if (grabble.datasourceName) {
            this.queryParam['name'] = `%25${grabble.datasourceName}%25`;
        } else {
            delete this.queryParam['name'];
        }
        if (grabble.metadataStatus == 1) {
            this.queryParam['status'] = grabble.metadataStatus;
        }
        else if (grabble.metadataStatus == 0) {
            this.queryParam['status'] = grabble.metadataStatus;
        }
        else {
            delete this.queryParam['status'];
        }

        if (grabble.datasourceType) {
            this.queryParam['type'] = grabble.datasourceType;
        } else {
            delete this.queryParam['type'];
        }

        this.refreshData();
    }//查询条件

    pageIndexChange(pageIndex: number) {
        this.queryParam.page = pageIndex;
        this.refreshData();
    }

    changePageSize(event: any) {
        this.queryParam.pageSize = event;
        this.refreshData();
    }

    refreshData() {
        this.datasourceListService.query(this.queryParam).then((response: any) => {
            this._total = response.total;
            this._dataSet = response.data;
        }).catch((err:any) => {
            // this._notification.error("错误",err);
        });
    }
    ngOnInit() {
        this.refreshData();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}