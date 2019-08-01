import { RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { ReportMoveListService } from './report-move-list.service';
import { ReportMoveService } from '../report-move.service';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { msg } from '../../../../../../config/config.msg';
import { ReportlistService } from '../../report-list/report-list.service';

@Component({
    selector: 'report-move-list',
    templateUrl: './report-move-list.component.html',
    styleUrls: ['./report-move-list.component.less'],
    providers: [FormBuilder]
})

export class ReportMoveListComponent implements OnInit, OnDestroy {
    _value = '';
    _dataSet: any = [];
    _total: number;
    check: boolean = false;
    subscription: Subscription;//重复订阅问题
    grabble: any[];
    moveId: number;//移动文件的id
    arr:any;
    queryParam: any = {
        page:1,
        pageSize: 10,
        nameOperator: "like",
        orderBy: "createTime",
        order: "desc"
    };//查询条件

    constructor(
        private reportMoveListService: ReportMoveListService,
        private route: ActivatedRoute,
        private reportMoveService: ReportMoveService,
        private _notification: CmNotificationService,
        private reportlistService: ReportlistService
    ) {
        this.subscription = this.reportlistService.missionGrabble$.subscribe((obj: any) => {
            this.grabble = obj.data;
            this._total = this.grabble.length;
            this._dataSet = this.grabble.slice(0, 10);
            this.moveId = obj.id;
        });
    }

    ngOnInit() {

    }

    pageIndexChange(pageIndex: number) {
        if(this.arr){
            this._dataSet = this.arr.slice((pageIndex - 1) * 10, pageIndex * 10);
        }else{
            this._dataSet = this.grabble.slice((pageIndex - 1) * 10, pageIndex * 10);
        }
    }

    onSearch(grabble: string): void {
        this.queryParam['page'] = 1;
        if (grabble) {
            let text = grabble.replace(/\s/g, "");
            let arr: any[] = [];
            for (let i = 0; i < this.grabble.length; i++) {
                if (this.grabble[i].name.indexOf(text) >= 0) {
                    arr.push(this.grabble[i])
                }
            }
            this.arr = arr;
            this._dataSet = arr;
            this._total = arr.length;
        } else {
            this.arr = null;
            this._dataSet = this.grabble.slice(0, 10);
            this._total = this.grabble.length;
        }
    }
 
    // 过滤
    filterData(arr: any) {
        let index = -1;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == this.moveId) {
                index = i;
                arr.splice(index, 1);
            }
        }
        this._dataSet = arr;
        this._total = arr.length;
    }
    // searchMissHandler(grabble: any) {
    //     // console.log(grabble)     
    //     if (grabble) {
    //         this.queryParam['name'] = `%25${grabble}%25`;
    //     } else {
    //         delete this.queryParam['name'];
    //     }
    //     this.refreshData();
    // }
    // refreshData() {
    //     // console.log(this.queryParam);
    //     this.queryParam['page'] =1;
    //     this.reportMoveListService.query(this.queryParam).then((response: any) => {
    //         this._dataSet = response.data;
    //         console.log(this._dataSet);
    //         if(this.queryParam.name){
    //             let index = -1;
    //             for(let i=0;i<this._dataSet.length;i++){
    //                 if(this._dataSet[i].id == this.moveId){
    //                     index = i;
    //                 }
    //             }
    //             this._dataSet.splice(index,1);
    //             this._total = this._dataSet.length;
    //         }else{
    //             this._total = response.total-1;
    //         }
    //     }).catch((err) => {
    //         return this._notification.error(err, "", msg['notification']['error'])
    //     })
    // }
    print(data: any) {
        // console.log(data)
        this.reportMoveService.homeValue(data);
    }
    checkRadio() {
        this.check = true;
        this.reportMoveListService.changeCheck(this.check)
    }

    ngOnDestroy() {

    }


}

