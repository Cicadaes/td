import { Component, OnInit, OnDestroy, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MainService } from '../../main.service';
import { MetadataCreateService } from './metadata-create.service';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';

import { MetadataRestapiTestComponent } from './metadata-restapi-test/metadata-restapi-test.component';

import { StoreModule, Store } from 'ng-cosmos-td-common';
import { Observable } from 'rxjs/Observable';
import { Router} from '@angular/router';
import { MetadataService } from '../metadata-list/metadata-list.service';


interface AppState {
    metadata: any;
}

@Component({
    selector: 'metadata-create',
    templateUrl: './metadata-create.component.html',
    styleUrls: ['./metadata-create.component.less']
})
export class MetadataCreateComponent implements OnInit, OnDestroy {
    title: Array<any>;
    current = 0;
    metadata$: any;
    msg$: Observable<any>;

    restapiTest:boolean = true;
    isNext:boolean = false;
    hasSaved:boolean = false;
    isRestApi:boolean = false; 
    step2Title:string = "选择对象";

    @ViewChild(MetadataRestapiTestComponent)
    private testModal: MetadataRestapiTestComponent;

    constructor(
        private route: ActivatedRoute,
        private mainService: MainService,
        private store: Store<AppState>,
        private metadataCreateService: MetadataCreateService,
        private _notification: CmNotificationService,
        private router: Router,
        private metadataService: MetadataService,
        private cdr: ChangeDetectorRef
    ) {
        metadataCreateService.metadataObjId = this.route.params['value']['id'];

        this.title = this.route.snapshot.data['title'];

        //是修改的时候，根据id去查询元数据信息；
        if(this.metadataCreateService.metadataObjId){
            this.title[1]['url'] = `metadata/detail/${this.metadataCreateService.metadataObjId}`;
            this.title[2]['url'] = `metadata/${this.route.snapshot.url[0]['path']}/${this.metadataCreateService.metadataObjId}`;
            this.current = 1;
            this.metadataService.get(this.metadataCreateService.metadataObjId).then(data => {
                this.metadataCreateService.metadataObj = data;
                this.isRestApi = data["dataSourceType"] == "RESTAPI" ? true : false;
                this.metadataCreateService.beforMetadataTable = data["physicalMetaObjectName"];
            }).catch(err => {
                // this._notification.error("错误",err);
            });
        }else{
            this.title[1]['url'] = `metadata/${this.route.snapshot.url[0]['path']}`;
        }

        this.metadata$ = store.select('metadata');

    }

    ngOnInit() {
        this.changeTitle(this.title);
    }

    ngOnDestroy() {
        this.metadataCreateService.resetModel();
        this.metadataCreateService._metadataStepInfo = {
            step1:{
                datasourceName:'',
                datasourceType:'',
                pageIndex:1
            },
            step2:{
                searchText:''
            },
            step3:{
                pageIndex:1,
                pageSize: 10
            }
        }
    
    }

    changeTitle(title: Array<any>) {
        setTimeout(() => {
            this.mainService.titleMission(title);
        }, 0);
    }

    showModal() {
        this.testModal.showModalMiddle();
    }

    pre() {
        this.isNext = false;
        this.metadataCreateService.currentStepMisson(this.current);
        this.current -= 1;
        
    }

    next() {
        this.isNext = true;
        this.metadataCreateService.currentStepMisson(this.current);
        this.metadata$.subscribe((metadata:any) => {
            if(this.current == 0 && metadata.action == "step1IsTrue"){
                this.current += 1;
            }else if (this.current == 1 && metadata.action == "step2ListIsTrue" && this.isNext){
                this.current += 1;
            }
        })
        if(this.metadataCreateService._metadataStep1Obj['type'] == "RESTAPI"){
            this.isRestApi = true;
        }
    }

    done() {
        this.metadataCreateService.currentStepMisson(-1);
    }

    restapiBtnChange($event:any){
        this.restapiTest = $event;
    }

    /**
     * 监听数据源切换
     */

    datasourceChange($event:any){
        switch($event.type){
            case "JDBC":
            this.step2Title = "选择表";
            break;
            case "SPARK":
            this.step2Title = "选择表";
            break;
            case "ELASTICSEARCH":
            this.step2Title = "选择索引";
            break;
            case "RESTAPI":
            this.step2Title = "选择参数";
            break;
            default:
            this.step2Title = "选择对象";
        }
        this.cdr.detectChanges();
    }
}