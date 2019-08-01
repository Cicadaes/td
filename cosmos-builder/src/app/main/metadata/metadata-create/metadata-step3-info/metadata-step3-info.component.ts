import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
  } from '@angular/forms';
import { MetadataCreateService } from '../metadata-create.service';
import { StoreModule, Store } from 'ng-cosmos-td-common';
interface AppState {
    metadata: any;
}

@Component({
    selector: 'metadata-step3-info',
    templateUrl: './metadata-step3-info.component.html',
    styleUrls: ['./metadata-step3-info.component.less'],
    providers: [ FormBuilder]
})
export class MetadataStep3InfoComponent implements OnInit, OnDestroy {
    inputValue: string;

    _checked = true;

    metadataStep3Form: FormGroup;
    metadataStep3FormText: FormGroup;
    //下拉菜单的
    options:any = [];
    selectedOption:string;
    metaObjectTypeList:any[] = []
    datasourceInfo:any;
    status:boolean = true;
    isRestApi:boolean = false;
    metadataTypeValue:number = 1;;
    nameValidator:any;
    errorInfo:any;
    metaObjectDescription:any;
    metadataName:any;
    metaObjectTypeDisabled:boolean;
    currentStepSubscribe:any;
    
    constructor(
        private store: Store<AppState>,
        private fb: FormBuilder,
        private metadataCreateService: MetadataCreateService
    ) {
        this.datasourceInfo = this.metadataCreateService._metadataStep3Obj;

        if(metadataCreateService.metadataObjId){
            this.datasourceInfo['dataSourceId'] = metadataCreateService.metadataObj['dataSourceId'];
            this.datasourceInfo['dataSourceName'] = metadataCreateService.metadataObj['dataSourceName'];
            this.datasourceInfo['dataSourceType'] = metadataCreateService.metadataObj['dataSourceType'];
            this.datasourceInfo['physicalMetaObjectName'] = metadataCreateService.metadataObj['physicalMetaObjectName'];
            this.datasourceInfo['datasourceUrl'] = metadataCreateService.metadataObj['dataSourceUrl'];
            this.metadataTypeValue = metadataCreateService.metadataObj['metaObjectType'] || 1;
            this.metadataName = metadataCreateService.metadataObj['metaObjectName'];
            this.status = metadataCreateService.metadataObj['status'] == 1? true : false;
            this.metaObjectDescription = metadataCreateService.metadataObj["description"];
        }else{
            this.datasourceInfo['dataSourceId'] = metadataCreateService._metadataStep1Obj['id']; 
            this.datasourceInfo['dataSourceName'] = metadataCreateService._metadataStep1Obj['name'];
            this.datasourceInfo['dataSourceType'] = metadataCreateService._metadataStep1Obj['type'];
            this.datasourceInfo['physicalMetaObjectName'] = metadataCreateService._metadataStep2Obj['physicalMetaObjectName']
            this.status = metadataCreateService._metadataStep3Obj['status'] === 0 ? false : true;
            this.metaObjectDescription =  metadataCreateService._metadataStep3Obj['metaObjectDescription'];
            this.datasourceInfo['datasourceUrl'] = metadataCreateService._metadataStep1Obj['url'];
            this.metadataTypeValue = metadataCreateService._metadataStep3Obj['metaObjectType'] || (this.datasourceInfo['dataSourceType'] == "SPARK" ? 2 : 1);
            this.metadataName = metadataCreateService._metadataStep3Obj['metaObjectName'];
        }

        this.isRestApi = this.datasourceInfo['dataSourceType'] == "RESTAPI" ? true : false;
        this.metaObjectTypeList = this.datasourceInfo['dataSourceType'] == "SPARK" ? (metadataCreateService.dictionaryData['metaObjectType']).slice(1) : metadataCreateService.dictionaryData['metaObjectType'];
        

        this.nameValidator = (control: FormControl): { [s: string]: boolean } => {
            const REGEXP = new RegExp(metadataCreateService.formValidator['name']['regexp']);
            if (!control.value) {
                return { required: true };
            }else if(REGEXP.test(control.value)){
                return { rightful: true, error: true };
            }else if(control.value.length < 2){
                return { minlength: true, error: true };
            }else if(control.value.length > 225){
                return { maxlength: true, error: true };
            } else {
                return null;
            }
        };
        this.errorInfo = {
            required: metadataCreateService.formValidator['name']['errorInfo']['emptyInfo'],
            rightful: metadataCreateService.formValidator['name']['errorInfo']['errorInfo'],
            minlength: metadataCreateService.formValidator['name']['errorInfo']['lengthInfo'],
            maxlength: '元数据对象名称不能超过225个字符'
        }

        //监听step
        this.currentStepSubscribe = metadataCreateService.missionCurrentStep$.subscribe((step:any) => {
            if(step == 2 || step == -1){
                this.datasourceInfo['status'] = this.status ? 1 : 0;
                this.datasourceInfo['metaObjectDescription'] = this.metaObjectDescription;
                this.datasourceInfo['metaObjectType'] = this.metadataTypeValue;
                this.datasourceInfo['metaObjectName'] = this.metadataName;
                if(metadataCreateService.metadataObjId){
                    metadataCreateService.metadataObj['status'] = this.status ? 1 : 0;
                    metadataCreateService.metadataObj['description'] = this.metaObjectDescription;
                    metadataCreateService.metadataObj['metaObjectType'] = this.metadataTypeValue;
                    metadataCreateService.metadataObj['metaObjectName'] = this.metadataName;
                    metadataCreateService.metadataObj["attributes"] = this.datasourceInfo["attributes"];
                }
                
                for(let key in metadataCreateService._metadataStep3Obj){
                    metadataCreateService._metadataStep3Obj[key] = this.datasourceInfo[key];
                }
                this.submitForm();
                if(step == -1){
                    if(this.datasourceInfo['metaObjectName'] && this.datasourceInfo['metaObjectType']){
                        this.store.dispatch({ type: 'step3InfoIsTrue'})
                    }else{
                        this.store.dispatch({ type: 'step3InfoIsFalse' })
                    }
                }
               

            }
        })
    }

    ngOnInit() {
        
        this.metadataStep3Form = this.fb.group({
            restApiUrl: '',
            httpMethod: 'POST',
            metadataName: ['', [ Validators.required, this.nameValidator ]],
            metadataType: ['1', [Validators.required]],
            metadataDescripe: '',
            switch: this.status
          });

          this.metadataStep3FormText = this.fb.group({
            selectedDatasourceName: this.datasourceInfo['dataSourceName'],
            selectedDatasourceType: this.datasourceInfo['dataSourceType'],
            datasourceUrl: '',

          });

          if(this.metadataCreateService.metadataObjId) this.metaObjectTypeDisabled = true;
    }

    metadataTypeChange(metadataType:number){
        if(metadataType){
            this.metadataCreateService.metaObjectTypeMission(metadataType);
        }
    }

    submitForm(){
        for (const i in this.metadataStep3Form.controls) {
            this.metadataStep3Form.controls[ i ].markAsDirty();
          }
    }

    getFormControl(name:any) {
        return this.metadataStep3Form.controls[ name ];
    }

    ngOnDestroy() {
        this.currentStepSubscribe.unsubscribe()
    }
}