import { StageService } from './../../../../services/stage.service';
import { ConfigChartBase } from './../../config-base.model';

/**
 * Created by lamph on 2017/1/13.
 */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ColorPickerService } from 'angular2-dw-color-picker';


@Component({
    selector: 'tconfig-color-picker',
    templateUrl: 'tconfig-color-picker.component.html',
    styles: [`
       
        .color-picker {
            margin-left: -35px;
            margin-top: 10px;
        }
    `]
})

export class TconfigColorPickerComponent implements OnInit {
    @Input() tconfig: ConfigChartBase
    @Output() onRender = new EventEmitter<any>()


    constructor(  private cpService: ColorPickerService) {

    }
    ngOnInit() {
       !this.tconfig.value && (this.tconfig.value = '#000')
    }


    onChangeColor(e: any) {
       this.onRender.emit(StageService.transformInput(this.tconfig.code, e))
    }





}