import { StageService } from './../../../../services/stage.service';
import { ConfigChartBase } from './../../config-base.model';
/**
 * Created by lamph on 2017/1/13.
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
    selector: 'tconfig-radio',
    templateUrl: 'tconfig-radio.component.html'
})

export class TconfigRadioComponent implements OnInit {
    @Input() tconfig: ConfigChartBase
    @Output() onRender = new EventEmitter<any>()
    constructor() {

    }
    ngOnInit() {


    }

    onSelect(e: any) {
        this.onRender.emit(StageService.transformInput(this.tconfig.code, e))
    }



}