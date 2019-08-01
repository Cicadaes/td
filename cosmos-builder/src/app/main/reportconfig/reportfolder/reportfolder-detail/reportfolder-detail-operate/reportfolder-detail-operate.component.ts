import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, ActivatedRoute,ParamMap } from '@angular/router';
import {  ReportfolderDetailNewreportComponent } from '../reportfolder-detail-newreport/reportfolder-detail-newreport.component';
import { AfterViewInit, ViewChild } from '@angular/core';

@Component({
    selector: 'reportfolder-detail-operate',
    templateUrl: './reportfolder-detail-operate.component.html',
    styleUrls: ['./reportfolder-detail-operate.component.less']
})
export class ReportfolderDetailOperateComponent implements OnInit, OnDestroy {

    constructor() {

    }

    @ViewChild(ReportfolderDetailNewreportComponent)
    private create:ReportfolderDetailNewreportComponent;
    
    show(){
        this.create.showModalMiddle()
    } 

    ngOnInit() {
        
    }
    ngOnDestroy() {

    }

}

