import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { MetadataCreateService } from '../metadata-create.service';
import { MetadataStep2ListService } from './metadata-step2-list.service';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
  } from '@angular/forms';
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { Subscription } from 'rxjs/Subscription';
interface AppState {
    metadata: any;
}

@Component({
    selector: 'metadata-step2-list',
    templateUrl: './metadata-step2-list.component.html',
    styleUrls: ['./metadata-step2-list.component.less'],
    providers: [ FormBuilder]
})
export class MetadataStep2ListComponent implements OnInit, OnDestroy {
    _dataSet: any = [];
    _isRestApi:boolean = false;
    database:string;
    physicalType:string;
    physicalList:any[] = [];
    physicalDetail:any[] = [];
    physicalDetailAll:any[] = [];
    datasourceId:any;
    metadataStep2ListForm: FormGroup;
    tableName:string;
    searchText:string;
    supportsLimit:boolean;
    isChangeTabel: boolean = false;//修改时改变原有的table
    step2IsFalse:boolean = false;
    selectedTable:string;
    urlValidator:any;
    errorInfo:any;

    @Output() onRestapiBtnChange = new EventEmitter<any>();

    stepSubscription: Subscription;//步奏的页监控

    constructor(
        private store: Store<AppState>,
        private fb: FormBuilder,
        private metadataCreateService: MetadataCreateService,
        private metadataStep2ListService: MetadataStep2ListService,
        private _notification: CmNotificationService
    ) {
        this._isRestApi = (metadataCreateService._metadataStep1Obj['type'] == "RESTAPI" || (metadataCreateService.metadataObj && metadataCreateService.metadataObj['dataSourceType'] == "RESTAPI")) ? true : false;
        this.searchText = metadataCreateService._metadataStepInfo['step2']['searchText'];

        if(metadataCreateService.metadataObjId){//修改
            this.database = metadataCreateService.metadataObj['database'] || '';
            this.physicalType = metadataCreateService.metadataObj['dataSourceType'] == "ELASTICSEARCH" ? "索引" : (metadataCreateService.metadataObj['dataSourceType'] == "RESTAPI" ? "参数" : "表");
            this.datasourceId = metadataCreateService.metadataObj['dataSourceId'];
            this.tableName = metadataCreateService.metadataObj['physicalMetaObjectName'];
            this.metadataCreateService._metadataStep2Obj['physicalMetaObjectName'] = this.tableName;
            if(!this._isRestApi){
                this.getPhysicalTable();
                this.getPhyAttribute(this.tableName);
            }else{
                this.getPhyAttribute(this.tableName);
            }
        }else{
            this.database = metadataCreateService._metadataStep1Obj['database'] || '';
            this.physicalType = metadataCreateService._metadataStep1Obj['type'] == "ELASTICSEARCH" ? "索引" : (metadataCreateService._metadataStep1Obj['type'] == "RESTAPI" ? "参数" : "表");
            this.datasourceId = metadataCreateService._metadataStep1Obj['id'];
            if(metadataCreateService._metadataStep2Obj['physicalMetaObjectTable'].length > 0){
                // this.physicalList = this.handlerPhysicalTable(metadataCreateService._metadataStep2Obj['physicalMetaObjectTable']);
                this.onSearch('');
                this.setSelectedByTableName(metadataCreateService._metadataStep2Obj['physicalMetaObjectName']);
            }else if(!this._isRestApi && metadataCreateService._metadataStep2Obj['physicalMetaObjectTable'].length <= 0){
                this.getPhysicalTable();
            }

            if(!this._isRestApi && metadataCreateService._metadataStep2Obj['physicalMetaObjectAttributeTable'].length > 0){
                this.physicalDetail = metadataCreateService._metadataStep2Obj['physicalMetaObjectAttributeTable'];
            }else if(this._isRestApi && this.metadataCreateService._metadataStep2Obj['physicalMetaObjectAttributeTable']['parameter']){
                this.physicalDetail = this.metadataCreateService._metadataStep2Obj['physicalMetaObjectAttributeTable']['parameter'];
                this.supportsLimit = this.metadataCreateService._metadataStep2Obj['physicalMetaObjectAttributeTable']['supportsLimit'];
                this.onRestapiBtnChange.emit(false);
            }
        }

        //监听step
        this.stepSubscription = metadataCreateService.missionCurrentStep$.subscribe(step => {
            if(step == 1){
                if(!this._isRestApi){
                    metadataCreateService._metadataStepInfo['step2']['searchText'] = this.searchText;
                    // this.submitForm();

                    if(this.tableName && this.physicalList.length > 0 && this.physicalDetail.length > 0){
                        this.store.dispatch({ type: 'step2ListIsTrue'});
                        this.step2IsFalse = false;
                    }else{
                        this.store.dispatch({ type: 'step2ListIsFalse'});
                        this.step2IsFalse = true;
                    }
                }else{
                    metadataCreateService._metadataStep2Obj['physicalMetaObjectName'] = this.tableName;
                    this.submitForm();

                    if(this.physicalDetail.length > 0 && this.metadataStep2ListForm.valid){
                        this.store.dispatch({ type: 'step2ListIsTrue'});
                        this.step2IsFalse = false;
                    }else if(this.metadataStep2ListForm.valid && this.physicalDetail.length <= 0){
                        this.store.dispatch({ type: 'step2ListIsFalse'});
                        this.step2IsFalse = true;
                    }else{
                        this.store.dispatch({ type: 'step2ListIsFalse'});
                        this.step2IsFalse = false;
                    }
                }
            }
        });

        this.urlValidator = (control: FormControl): { [s: string]: boolean } => {
            const REGEXP = new RegExp(metadataCreateService.formValidator['url']['regexp']);
            if (!control.value) {
                return { required: true, error: true };
            }
            // else if(REGEXP.test(control.value)){
            //     return { rightful: true, error: true };
            // }else if(control.value.length < 10){
            //     return { minlength: true, error: true };
            // } 
            else {
                return null;
            }
        };

        this.errorInfo = {
            required: metadataCreateService.formValidator['url']['errorInfo']['emptyInfo'],
            rightful: metadataCreateService.formValidator['url']['errorInfo']['errorInfo'],
            minlength: metadataCreateService.formValidator['url']['errorInfo']['lengthInfo']
        }
    }

    ngOnInit() {
        if(this._isRestApi){
            this.metadataStep2ListForm = this.fb.group({
                restapiUrl: [ null, [ Validators.required, this.urlValidator ] ],
                httpMethod: 'POST'
              });
        }
        
          this.tableName = this.metadataCreateService._metadataStep2Obj['physicalMetaObjectName'];
          if(this.tableName.trim().length > 0){
              this.submitForm();
          }
    }

    ngOnDestroy() {
        this.stepSubscription.unsubscribe();
    }

    submitForm(){
        if(this.metadataStep2ListForm){
            for (const i in this.metadataStep2ListForm.controls) {
                this.metadataStep2ListForm.controls[ i ].markAsDirty();
            }
        }
    }

    restapiUrlChange(){
        setTimeout(() => {
            this.metadataCreateService._metadataStep2Obj['physicalMetaObjectName'] = this.tableName;
            if(this.metadataCreateService.metadataObjId){
                this.metadataCreateService.metadataObj["physicalMetaObjectName"] = this.tableName;
            }
            this.step2IsFalse = false;
        }, 0);

        this.physicalDetail = [];
        this.metadataCreateService._metadataStep2Obj['physicalMetaObjectAttributeTable'] = [];
        //如果是修改，在改变表的时候修改原来的数据
        if(this.metadataCreateService.metadataObjId){
            this.metadataCreateService.metadataObj["attributes"] = [];
            this.isChangeTabel = true;
        }
        this.onRestapiBtnChange.emit(true);
    }

    /**
     * 根据数据库id获取所有的物理表
     */
    getPhysicalTable(){
        this.metadataStep2ListService.getPhysicalTable(this.datasourceId).then((data:any) => {
            if(data.success){
                this.metadataCreateService._metadataStep2Obj['physicalMetaObjectTable'] = Object.assign([],data['data']);
                this.physicalList = this.handlerPhysicalTable(data['data']);
                // this.metadataCreateService._metadataStep2Obj['physicalMetaObjectTable'] = this.physicalList;
                if(this.tableName){
                    this.setSelectedByTableName(this.tableName);
                    if(this.searchText){
                        this.onSearch();
                    }
                }else{
                    if(this.physicalList.length > 0 && this.physicalList[0]['tableName']){
                        this.tableName = this.physicalList[0]['tableName'];
                        this.physicalList[0]['isSelected'] = true;
                        this.metadataCreateService._metadataStep2Obj['physicalMetaObjectName'] = this.tableName;
                        this.getPhyAttribute(this.tableName);
                    }
                }
            }else{
                this._notification.error("错误",data["msg"]);
            }
        }).catch((err:any) =>{
            this._notification.error("错误",err);
        })
    }

    handlerPhysicalTable(data:any[]){
        let physicalTable:any[] = [];
        if(data){
            let len = data.length;
            for(let i = 0; i < len; i++){
                physicalTable[i] = {
                    tableName: data[i],
                    isSelected: false
                }
            }
        }
        return physicalTable;
    }

    //选择表,获取表信息
    selectDataTable($event:any,table:Object){
        // if(this.tableName != table['tableName']){
            this.tableName = table["tableName"];
           
            //还原step3的表格数据
            this.metadataCreateService._metadataStep3Obj['attributes'] = '';
            this.metadataCreateService._metadataStepInfo['step3'] = {
                pageIndex:1,
                pageSize: 10
            }

            //重新请求数据
            this.getPhyAttribute(table["tableName"]);

            this.tableName = table['tableName'];
            this.metadataCreateService._metadataStep2Obj['physicalMetaObjectName'] = table['tableName'];

            //如果是修改，在改变表的时候修改原来的数据
            this.isChangeTabel = true;
            if(this.metadataCreateService.metadataObjId){
                this.metadataCreateService.metadataObj["physicalMetaObjectName"] = table['tableName'];
                this.metadataCreateService.hadModify = true;
            }
    
            this.setItemUnSelected();
            table['isSelected'] = true;
        }
    // }

    /**
     * 获取表的属性
     * @param tableName 
     */
    getPhyAttribute(tableName: string){
        // tableName = this._isRestApi ? 'queryMetadata' : tableName;
        this.metadataStep2ListService.getPhysicalAttribute(this.datasourceId, tableName).then(data => {
            if(data.success){
                data = data['data'];
                this.physicalDetail = this._isRestApi ? data['parameter'] : data;
                this.supportsLimit = data['supportsLimit'];
                this.metadataCreateService._metadataStep2Obj['physicalMetaObjectAttributeTable'] = data;
                //如果是修改，在改变表的时候修改原来的数据
                if(this.isChangeTabel && this.metadataCreateService.metadataObjId){
                    this.metadataCreateService.metadataObj["attributes"] = data;
                }
               if(this.physicalDetail.length > 0)this.onRestapiBtnChange.emit(false);
            }else{
                this._notification.error("错误",data.msg);
                this.onRestapiBtnChange.emit(true);
            }
        }).catch((err:any) => {
            this._notification.error("错误",err);
        });
    }

    /**
     * 将物理表都设置为未选中的状态
     */
    setItemUnSelected(){
        let len =  this.physicalList.length;
        for(let i = 0; i < len; i++){
            this.physicalList[i]['isSelected'] = false;
        }
    }

    /**
     * 根据tableName将表置为选中状态
     * @param tableName 
     */
    setSelectedByTableName(tableName: string){
        let len =  this.physicalList.length;
        for(let i = 0; i < len; i++){
            if(this.physicalList[i]['tableName'] == tableName){
                this.physicalList[i]['isSelected'] = true;
                break;
            }
        }
    }

    onSearch($event?: any){
        let newPhysicalList = [];
        let len = this.metadataCreateService._metadataStep2Obj['physicalMetaObjectTable'].length;
        let tableName = this.metadataCreateService._metadataStep2Obj['physicalMetaObjectName'];
        this.searchText = this.searchText.trim();
        for(let i = 0; i < len; i++){
            let physicalTable = this.metadataCreateService._metadataStep2Obj['physicalMetaObjectTable'][i];
            if((physicalTable.toLocaleLowerCase()).indexOf(this.searchText.toLocaleLowerCase()) >= 0){
                newPhysicalList.push({
                    tableName:physicalTable,
                    isSelected: false
                });
            }
        }
        this.physicalList = newPhysicalList;
        //选中物理表
        this.setSelectedByTableName(tableName);

    }

    getFormControl(name:any) {
        return this.metadataStep2ListForm.controls[ name ];
    }

    getParams(){
        this.submitForm();
        if(this.metadataStep2ListForm.valid){
            this.getPhyAttribute(this.tableName);
        }
        
        if(this.metadataCreateService.metadataObjId){
            this.metadataCreateService.metadataObj["physicalMetaObjectName"] = this.tableName;
        }else{
            this.metadataCreateService._metadataStep2Obj['physicalMetaObjectName'] = this.tableName;
        }

        if(this.metadataCreateService._metadataStep3Obj['attributes']){
            this.metadataCreateService._metadataStep3Obj['attributes'] = [];
        }
    }
}