import {  ReportfolderDetailNewreportComponent } from '../reportfolder-detail-newreport/reportfolder-detail-newreport.component';
import { RouterModule, ActivatedRoute,ParamMap } from '@angular/router';
import { AfterViewInit, ViewChild } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Observable } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ReportAdvancedSearchService } from '../../../report/report-advanced-search/report-advanced-search.service';

@Component({
    selector: 'reportfolder-detail-advanced-search',
    templateUrl: './reportfolder-detail-advanced-search.component.html',
    styleUrls: ['./reportfolder-detail-advanced-search.component.less']
})
export class ReportfolderDetailAdvancedSearchComponent implements OnInit {
    _value = '';
    constructor(
        private reportAdvancedSearchService: ReportAdvancedSearchService
    ) {

    }

    onSearch(val: string): void {
        this.reportAdvancedSearchService.homeValue({Name:val});
    }

    ngOnInit() {

    }

}

