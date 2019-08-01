import { Component, OnInit, OnDestroy } from '@angular/core';
import {  ReportfolderCreateComponent } from '../reportfolder-create/reportfolder-create.component';
import { AfterViewInit, ViewChild } from '@angular/core';

@Component({
    selector: 'reportfolder-operate',
    templateUrl: './reportfolder-operate.component.html',
    styleUrls: ['./reportfolder-operate.component.less']
})
export class ReportfolderOperateComponent implements OnInit, OnDestroy {

    @ViewChild(ReportfolderCreateComponent)
    private create:ReportfolderCreateComponent;

    constructor(
    ) {     
    }  

    show(){
         this.create.showModalMiddle()
    }

    ngOnInit() {
    }
    
    ngOnDestroy() {

    }

}

