import { Component, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { MetadataStep1ListService } from './metadata-step1-list.service';
import { MetadataCreateService } from '../metadata-create.service';
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
interface AppState {
    metadata: any;
}

@Component({
    selector: 'metadata-step1-list',
    templateUrl: './metadata-step1-list.component.html',
    styleUrls: ['./metadata-step1-list.component.less']
})

export class MetadataStep1ListComponent implements OnInit, OnDestroy {
    datasourceList:any[] = [];
    pageSize:number = 10;
    pageIndex:number;
    params: Object;
    total:number = 0;
    selectedDatasource:number;
    step1IsFalse:boolean = false;
    searchSubscribe:any;
    currentStepSubscribe:any;
    isInit:boolean = true;

    @Output() onDatasourceChange = new EventEmitter<any>();

    constructor(
        private store: Store<AppState>,
        private metadataStep1ListService: MetadataStep1ListService,
        private metadataCreateService: MetadataCreateService,
        private _notification: CmNotificationService
    ) {
        this.pageIndex = metadataCreateService._metadataStepInfo['step1']['pageIndex'];
        this.params = {
            "page":this.pageIndex, 
            "pageSize":this.pageSize, 
            "name": "", 
            "nameOperator":"like",
            "type":"",
            "status":1,
            "order":"desc",
            "orderBy": "createTime"
        };

        // this.getTableData(this.params);
        
        this.selectedDatasource = metadataCreateService._metadataStep1Obj['id'] || -1;
        this.pageIndex = metadataCreateService._metadataStepInfo['step1']['pageIndex'];

        //订阅搜索条件
        this.searchSubscribe = metadataCreateService.missionSearchObj$.subscribe(searchObj => {
            // this.datasourceList = [];
            this.params['name'] = searchObj['datasourceName'] ? `%25${searchObj['datasourceName']}%25` : null;
            this.params['type'] = searchObj['datasourceType'];
            if(this.isInit){
                this.isInit = false;
                this.pageIndex = this.params['page'] = metadataCreateService._metadataStepInfo['step1']['pageIndex'];
            }else{
                this.pageIndex = this.params['page'] = metadataCreateService._metadataStepInfo['step1']['pageIndex'] = 1;
            }
            this.params['pageSize'] = 10;
            this.getTableData(this.params);
        
        })

         //监听step
        this.currentStepSubscribe = metadataCreateService.missionCurrentStep$.subscribe(step => {
            if(step == 0){
                this.metadataCreateService._metadataStepInfo['step1']['pageIndex'] = this.pageIndex;
                if(metadataCreateService._metadataStep1Obj['id']){
                    this.store.dispatch({ type: 'step1IsTrue'});
                }else{
                    this.step1IsFalse = true;
                    this.store.dispatch({ type: 'step1IsFalse'});
                }
            }
        })


    }
    //获取数据
    getTableData(params:any){
        this.metadataStep1ListService.query(params).then(data =>{
            this.total = data['total'];
            this.datasourceList = data['data'];
            
        }).catch(err => {
            this._notification.error("错误",err);
        });
    }

    //选择数据源
    selectDatasource(datasource:Object){
        if(datasource['id'] != this.metadataCreateService._metadataStep1Obj['id']){
            this.onDatasourceChange.emit(datasource);
            
            //清空所有数据
            this.metadataCreateService.resetModel();
            this.metadataCreateService._metadataStepInfo['step2']={
                searchText:''
            };
            this.metadataCreateService._metadataStepInfo['step3']={
                    pageIndex:1,
                    pageSize: 10
            }
            //保存step1数据
            this.metadataCreateService._metadataStep1Obj = datasource;
            this.step1IsFalse = false;
        }
        
    }

    pageIndexChange(index:any){
        this.pageIndex = this.params['page'] = index;
        this.getTableData(this.params);
        
    }

    pageSizeChange(pageSize:any){
        this.params['pageSize'] = pageSize;
        this.getTableData(this.params);
    }

    ngOnInit() {
        
    }
    ngOnDestroy() {
        this.searchSubscribe.unsubscribe();
    }
}