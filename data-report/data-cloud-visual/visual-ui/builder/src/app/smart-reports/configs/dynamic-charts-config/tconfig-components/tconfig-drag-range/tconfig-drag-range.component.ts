import { StageService } from './../../../../services/stage.service';
import { ConfigChartBase } from './../../config-base.model';
import { Observable } from 'rxjs/Rx';
/**
 * Created by lamph on 2017/1/13.
 */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'tconfig-drag-range',
    templateUrl: 'tconfig-drag-range.component.html',
    // styleUrls: ['tconfig-drag-range.component.css']
    styles:[`
    :host /deep/ .range_hole{
    width: 150px;
    float: left;
    position: relative;
    top: 4px;
}

:host /deep/ .ui-slider-horizontal{
    height: 2px;
}

:host /deep/ .ui-widget-content {
    background-color:transparent;
    border: 0 none;
}

:host /deep/ .ui-slider {
    background-color: rgba(0,0,0,0.38);
    border-color: transparent;
    top: 5px;
}

:host /deep/ md-slider .md-thumb {
    z-index: 1;
    position: absolute;
    left: -10px;
    top: 14px;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    -webkit-transform: scale(.7);
    transform: scale(.7);
    -webkit-transition: all .4s cubic-bezier(.25,.8,.25,1);
    transition: all .4s cubic-bezier(.25,.8,.25,1);
}

:host /deep/ .ui-slider .ui-slider-handle{
    background-color: rgb(238,238,238);
    border: 2px solid rgba(0,0,0,0.38);
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transition: all .4s cubic-bezier(.25,.8,.25,1);
    transition: all .4s cubic-bezier(.25,.8,.25,1);
}

:host /deep/ .ui-slider .ui-slider-handle:hover{
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
    border-color: rgb(68,138,255);
    background-color: rgb(68,138,255);
}

:host /deep/ .ui-slider.ui-slider-horizontal .ui-slider-handle {
    top: -6px;
}

:host /deep/ .ui-slider .ui-slider-handle {
    width: 15px;
    height: 15px;
}
    `]
})

export class TconfigDragRangeComponent implements OnInit {
    @Input() tconfig: ConfigChartBase
    @Output() onRender = new EventEmitter<any>();

    constructor() {

    }
    ngOnInit() {


    }

    handleChange(e: any) {
        //e.value is the new value
        this.onRender.emit(StageService.transformInput(this.tconfig.code, e.value))
    }





}