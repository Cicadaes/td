import { RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportAdvancedSearchService } from './report-advanced-search.service';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { dictionary } from '../../../../../config/config.dictionary';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'report-advanced-search',
    templateUrl: './report-advanced-search.component.html',
    styleUrls: ['./report-advanced-search.component.less'],
    providers: [FormBuilder]
})
export class ReportAdvancedSearchComponent implements OnInit {
    isCollapse = false;
    validateForm: FormGroup;
    Name: any;
    status: any;//状态
    reportStatus: any;//状态默认
    folder: any;
    founder: any;
    createTime: any;
    subscription: Subscription;//重复订阅问题

    constructor(
        private fb: FormBuilder,
        private reportAdvancedSearchService: ReportAdvancedSearchService
    ) {
        // 移动成功后再次执行搜索
        this.subscription = this.reportAdvancedSearchService.missionMoveReport$.subscribe(() => {
            this.searchHandler();
        });
        this.validateForm = this.fb.group({
            Name: ['', [Validators.required]],
            reportStatus: [''],
            folder: ['', [Validators.required]],
            founder: [''],
            createTime: [''],
        });
        this.Name = '';
        this.status = dictionary.statusReportSearch;
        this.reportStatus = '';
        this.folder = '';
        this.founder = '';
        this.createTime = '';
    }

    searchHandler() {
        this.reportAdvancedSearchService.homeValue(this.validateForm.value);
    }


    ngOnInit() {

    }

    toggleCollapse() {
        this.isCollapse = !this.isCollapse;
    }

    getFormControl(name: any) {
        return this.validateForm.controls[name];
    }

    resetForm($event: MouseEvent) {
        $event.preventDefault();
        this.validateForm.reset();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsPristine();
        }
    }

}

