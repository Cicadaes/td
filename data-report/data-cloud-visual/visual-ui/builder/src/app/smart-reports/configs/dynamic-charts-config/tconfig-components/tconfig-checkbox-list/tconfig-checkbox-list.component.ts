import { ConfigChartBase } from './../../config-base.model';
/**
 * Created by lamph on 2017/1/13.
 */
import { Component, Input, OnInit, Output, EventEmitter  } from '@angular/core';


@Component({
    selector: 'tconfig-checkbox-list',
    templateUrl: 'tconfig-checkbox-list.component.html'
})

export class TconfigCheckboxListComponent implements OnInit {
    @Input() tconfig: ConfigChartBase
    @Output() onRender = new EventEmitter<any>();


    constructor() {

    }
    ngOnInit() {


    }

    onRenderFa(e:any) {
        this.onRender.emit(e)
    }


}