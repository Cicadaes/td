import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
  } from '@angular/forms';
import { MetadataCreateService } from '../metadata-create.service';


@Component({
    selector: 'metadata-step1-info',
    templateUrl: './metadata-step1-info.component.html',
    styleUrls: ['./metadata-step1-info.component.less'],
    providers: [ FormBuilder ]
})
export class MetadataStep1InfoComponent implements OnInit, OnDestroy {
    validateForm: FormGroup;
    dataSourceList:any[] = [];
    datasourceType:any = '';
    datasourceName:string;
    constructor(
        private fb: FormBuilder,
        private metadataCreateService: MetadataCreateService
    ) {
        this.datasourceName = metadataCreateService._metadataStepInfo['step1']['datasourceName'];
        this.datasourceType = metadataCreateService._metadataStepInfo['step1']['datasourceType'];
        this.dataSourceList = metadataCreateService.dictionaryData['dataSourceTypeSearch'];
    }
    ngOnInit() {
        
        this.validateForm = this.fb.group({
            datasourceName: this.datasourceName,
            datasourceType: this.datasourceType
          });
        setTimeout(() => {
            this.metadataCreateService.searchObjMission(this.validateForm.value);
        }, 0);
       
    }

    ngOnDestroy() {

    }

    searchDatasource(){
        this.metadataCreateService.searchObjMission(this.validateForm.value);
        this.metadataCreateService._metadataStepInfo['step1']['datasourceName'] =  this.validateForm.value['datasourceName'];
        this.metadataCreateService._metadataStepInfo['step1']['datasourceType'] =  this.validateForm.value['datasourceType'];
    }

    resetForm() {
        this.datasourceType = '';
        this.validateForm.value['datasourceType']= '';
        this.metadataCreateService.searchObjMission(this.validateForm.value);
    }

}