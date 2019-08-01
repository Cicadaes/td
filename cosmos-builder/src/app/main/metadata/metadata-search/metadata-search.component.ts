import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
  } from '@angular/forms';
import { MetadataCommunicationService } from '../metadata.service';
import { dictionary } from '../../../../config/config.dictionary';

@Component({
    selector: 'metadata-search',
    templateUrl: './metadata-search.component.html',
    styleUrls: ['./metadata-search.component.less'],
    providers: [ FormBuilder]
})
export class MetadataSearchComponent implements OnInit, OnDestroy {
    validateForm: FormGroup;
    isCollapse = false;

    constructor(
        private fb: FormBuilder,
        private metadataCommunicationService: MetadataCommunicationService
    ) {

    }

    ngOnInit() {
        this.initForm();
    }
    
    ngOnDestroy() {

    }
    
    /**
     * 初始化表单
     */
    initForm(){
        this.validateForm = this.fb.group({
            name: '',
            type: '',
            dataSourceName: '',
            dataSourceType: '',
            creator: '',
            createTime: ['',''],
            status: ''
        });
    }

    submitForm(value: any){
        this.metadataCommunicationService.searchMetaListMission(value);
    }

    resetForm() {
        this.initForm();
        this.metadataCommunicationService.searchMetaListMission({});
    }

    toggleCollapse() {
        this.isCollapse = !this.isCollapse;
    }

}