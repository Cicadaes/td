import { Component, Input, Output, OnInit, OnDestroy, EventEmitter} from '@angular/core';
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
    selector: 'metadata-step2-info',
    templateUrl: './metadata-step2-info.component.html',
    styleUrls: ['./metadata-step2-info.component.less'],
    providers: [ FormBuilder]
})
export class MetadataStep2InfoComponent implements OnInit, OnDestroy {
    metadataStep2Form: FormGroup;
    _isRestApi:boolean = false;
    tableType:string = '表';
    datasourceObj:Object = {
        "name":'',
        "type":''
    };
    urlValidator:any;
    errorInfo:any;
    database:string;
    restApiUrl:string;

    @Output() onDatasource = new EventEmitter<any>();
    constructor(
        private store: Store<AppState>,
        private fb: FormBuilder,
        private metadataCreateService: MetadataCreateService
    ) {
        if(metadataCreateService.metadataObjId){
            this.datasourceObj['name'] = metadataCreateService.metadataObj['dataSourceName'];
            this.datasourceObj['type'] = metadataCreateService.metadataObj['dataSourceType'];
            this.datasourceObj['url'] = metadataCreateService.metadataObj['dataSourceUrl'];
        }else{
            this.datasourceObj['name'] = metadataCreateService._metadataStep1Obj['name'];
            this.datasourceObj['type'] = metadataCreateService._metadataStep1Obj['type'];
            this.datasourceObj['url'] = metadataCreateService._metadataStep1Obj['url'];
            this.database = metadataCreateService._metadataStep1Obj['database'] || '';
        }

        this._isRestApi =  this.datasourceObj['type'] == "RESTAPI" ? true : false;

    }

    submitForm(){
        for (const i in this.metadataStep2Form.controls) {
            this.metadataStep2Form.controls[ i ].markAsDirty();
          }
    }

    resetForm() {
        this.metadataStep2Form.reset();
    }

    ngOnInit() {
        this.metadataStep2Form = this.fb.group({
            selectedDatasourceName: '',
            selectedDatasourceType: '',
            datasourceUrl: ''
          });
    }

    ngAfterViewInit(){
        this.onDatasource.emit(this.datasourceObj);
    }

    getFormControl(name:any) {
        return this.metadataStep2Form.controls[ name ];
      }
    ngOnDestroy() {

    }

}