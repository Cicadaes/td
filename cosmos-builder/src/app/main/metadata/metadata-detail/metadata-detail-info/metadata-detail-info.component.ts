import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';

@Component({
    selector: 'metadata-detail-info',
    templateUrl: './metadata-detail-info.component.html',
    styleUrls: ['./metadata-detail-info.component.less'],
    providers: [FormBuilder]
})
export class MetadataDetailInfoComponent implements OnInit, OnDestroy {
    inputValue: string;

    _checked = true;

    metadataForm: FormGroup;

    //下拉菜单的
    options:any = [];
    selectedOption:string;

    isCollapse = true;

    metadataInfo: any = {};//元数据详情

    @Input() set metadata(data: any){
        if(data){
            this.metadataInfo = data;
        }
    }

    constructor(private fb: FormBuilder) {

    }

    ngOnInit() {
        this.metadataForm = this.fb.group({
            selectedDatasourceName: '',
            selectedDatasourceType: '',
            datasourceUrl: '',
            restApiUrl: '',
            httpMethod: 'POST',
            metadataName: '',
            metadataType: 'CUBE类',
            metadataDescripe: '',
            switch: true
          });
    }

    ngOnDestroy() {

    }

    getFormControl(name:any) {
        return this.metadataForm.controls[ name ];
    }

    toggleCollapse() {
        this.isCollapse = !this.isCollapse;
    }
}