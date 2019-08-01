import { Component, OnInit, OnDestroy } from '@angular/core';
@Component({
    selector: 'datasource-operate',
    templateUrl: './datasource-operate.component.html',
    styleUrls: ['./datasource-operate.component.less']
})
export class DatasourceOperateComponent implements OnInit, OnDestroy {
    _dataSet: any = [];

    ngOnInit() {
    }
    constructor(
    ) {     
    }   
    ngOnDestroy() {

    }

}