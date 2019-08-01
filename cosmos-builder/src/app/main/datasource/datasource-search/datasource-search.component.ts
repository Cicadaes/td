import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DatasourceHomeService } from '../datasource-home/datasource-home.service';
import { dictionary } from '../../../../config/config.dictionary';
@Component({
    selector: 'datasource-search',
    templateUrl: './datasource-search.component.html',
    styleUrls: ['./datasource-search.component.less'],
    providers: [FormBuilder]
})
export class DatasourceSearchComponent implements OnInit, OnDestroy {
    validateForm: FormGroup;
    status: any;//状态
    metadataStatus: any;//状态默认
    types: any;//类型
    datasourceType: any;//类型默认
    constructor(private fb: FormBuilder, private datasourceHomeService: DatasourceHomeService) {
        this.information();
    }
    information(){
        this.validateForm = this.fb.group({
            datasourceName: [''],
            datasourceType: [''],
            metadataStatus: [''],
        });
        this.status = dictionary.statusSearch;
        this.metadataStatus ="";
        this.types = dictionary.dataSourceTypeSearch;
        this.datasourceType = '';
    }//初始数据
    searchHandler() {
        this.datasourceHomeService.homeValue(this.validateForm.value);
    }//查询
    ngOnInit() {
    }
    resetForm() {
        this.validateForm.reset();
        setTimeout(() => {
            this.information();
        }, 0);
        this.datasourceHomeService.homeValue(this.validateForm.value);
    }//重置
    submitForm = ($event: any, value: any) => {
        $event.preventDefault();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
        }
    };

    getFormControl(name: any) {
        return this.validateForm.controls[name];
    }


    ngOnDestroy() {

    }

}