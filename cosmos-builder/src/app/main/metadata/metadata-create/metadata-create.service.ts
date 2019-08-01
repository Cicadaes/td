import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { CRUDService } from "../../../service/crud.service";

import { Http } from '@angular/http';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { Observable } from 'rxjs/Observable';

import { 
        metadataObj,
        _metadataStep1Obj,
        _metadataStep2Obj,
        _metadataStep3Obj,
        _metadataStepInfo
    } from './metadata-create.model';
interface AppState {
    dictionary: any;
    formValidator: any;
    msg: any;
}

@Injectable()
export class MetadataCreateService {

    metadataObjId: number;//修改时的元数据对象的id;
    beforMetadataTable: string;//修改前的元数据表
    metadataObj: any = null;//元数据对象，修改时使用
    hadModify: boolean = false;//修改元数据 改变选择表以后当做标识使用

    hasSaved: boolean = false;
    _metadataStep1Obj: Object;
    _metadataStep2Obj: Object;
    _metadataStep3Obj: Object;
    _metadataStepInfo: Object;
    dictionaryData: Object;
    dictionary$: any;

    formValidator: Object;
    formValidator$: any;

    msg: Object;
    msg$: any;

    currentStep$: Observable<number>;

    searchObj: Object;
    datasourceObj: Object;
    metaObjectType: number;
    metadataStore:Object;
    
    // Observable string sources
    private searchObjSource = new Subject<Object>();
    private metaObjectTypeSource = new Subject<number>();
    private  currentStepSource = new Subject<number>();


    // Observable string streams
    missionSearchObj$ = this.searchObjSource.asObservable();
    missionMetaObjectType$ = this.metaObjectTypeSource.asObservable();
    missionCurrentStep$ = this.currentStepSource.asObservable();
    // Service message commands
    //搜索
    searchObjMission(searchObj: Object) {
        this.searchObjSource.next(searchObj);
    }

    //选择元数据对象类型
    metaObjectTypeMission(metaObjectType: number){
        this.metaObjectTypeSource.next(metaObjectType);
    }

    //step
    currentStepMisson(currentStep:number){
        this.currentStepSource.next(currentStep);
    }

    constructor(
        public http: Http,
        private store: Store<AppState>,
    ){
        this._metadataStep1Obj = _metadataStep1Obj;
        this._metadataStep2Obj = _metadataStep2Obj;
        this._metadataStep3Obj = _metadataStep3Obj
        this._metadataStepInfo = _metadataStepInfo;

        this.dictionary$ = store.select('dictionary');
        this.dictionary$.subscribe((data:any) => {
            this.dictionaryData = data;
        });

        this.formValidator$ = store.select('formValidator');
        this.formValidator$.subscribe((data:any) => {
            this.formValidator = data;
        })

        this.msg$ = store.select('msg');
        this.msg$.subscribe((data:any) => {
            this.msg = data;
        })
    }

    resetModel(){
        this._metadataStep1Obj = {};
        this.metadataObjId = null;
        this.metadataObj = null;
        this.hasSaved = false;
        this.resetObj(this._metadataStep2Obj);
        this.resetObj(this._metadataStep3Obj);
        this.hasSaved = false;
    }

    resetObj(obj:Object){
        for(let key in obj){
            obj[key] = '';
        }
    }

}