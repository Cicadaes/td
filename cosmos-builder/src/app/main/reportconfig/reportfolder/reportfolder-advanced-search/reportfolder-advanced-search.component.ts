import { AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportfolderAdvancedSearchService } from './reportfolder-advanced-search.service';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';


@Component({
    selector: 'reportfolder-advanced-search',
    templateUrl: './reportfolder-advanced-search.component.html',
    styleUrls: ['./reportfolder-advanced-search.component.less'],
    providers: [FormBuilder]
})
export class ReportfolderAdvancedSearchComponent implements OnInit {


    validateForm: FormGroup;
    folderName:any;
    user:any;
    createTime:any;

    getFormControl(name: any) {
        return this.validateForm.controls[name];
    }


    constructor(
        private fb: FormBuilder,
        private reportfolderAdvancedSearchService: ReportfolderAdvancedSearchService
    ) {
        this.validateForm = this.fb.group({
            folderName: [''],
            founder: [''],
            createTime: ['',''],
        });
        this.folderName = '';
        this.user = '';
    }

    searchHandler() {
        this.reportfolderAdvancedSearchService.homeValue(this.validateForm.value);
    }

    ngOnInit() {
    }


}

