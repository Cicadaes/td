import { StageService } from './../../../../services/stage.service';
import { ConfigChartBase } from './../../config-base.model';
/**
 * Created by lamph on 2017/1/13.
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
    selector: 'tconfig-select-list',
    templateUrl: 'tconfig-select-list.component.html'
})

export class TconfigSelectListComponent implements OnInit {
    @Input() tconfig: ConfigChartBase
    @Output() onRender = new EventEmitter<any>()

    constructor() {

    }
    ngOnInit() {

    }
    onRenderFa(e:any) {
        console.log(this.tconfig)
        this.onRender.emit(e)
    }

  


}