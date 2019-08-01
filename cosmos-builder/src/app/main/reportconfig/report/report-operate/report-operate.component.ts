import { Component, OnInit, OnDestroy } from '@angular/core';
import {  ReportCreateComponent } from '../report-create/report-create.component';
import { AfterViewInit, ViewChild } from '@angular/core';

@Component({
    selector: 'report-operate',
    templateUrl: './report-operate.component.html',
    styleUrls: ['./report-operate.component.less']
})
export class ReportOperateComponent implements OnInit, OnDestroy {
    
    constructor() {     
    }   
    
    @ViewChild(ReportCreateComponent)
    private create:ReportCreateComponent;

    show(){
        this.create.showModalMiddle()
    } 
    
    ngOnInit() {        
    }
    ngOnDestroy() {

    }

}

