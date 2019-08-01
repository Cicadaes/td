import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.less']
})
export class ReportComponent implements OnInit, OnDestroy {

    date = new Date();
    
    constructor(
    ) {     
    }   
    ngOnInit() {        
    }
    ngOnDestroy() {

    }

}

