import { StageService } from './../../../../services/stage.service';
import { ConfigChartBase } from './../../config-base.model';
import { Observable } from 'rxjs/Rx';
/**
 * Created by lamph on 2017/1/13.
 */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ColorPickerService } from 'angular2-dw-color-picker';


@Component({
    selector: 'tconfig-color-block',
    templateUrl: 'tconfig-color-block.component.html',
    // styleUrls: ['tconfig-color-block.component.css']
    styles:[`
        .color_group{
            border: 1px solid #bdbdbd;
            cursor: pointer;
            display: inline-block;
            height: 18px;
            margin-right: 4px;
            width: 18px;
            background: #f5f5f5;
            border-radius: 2px;
        }
        .color-picker {
            margin-left: -35px;
            margin-top: 10px;
        }
    `]
})

export class TconfigColorBlockComponent implements OnInit {
    @Input() tconfig: ConfigChartBase
    @Output() onRender = new EventEmitter<any>()

    private arrayColors: any = {};
    private selectedColor: string = 'color';
    private color: string = "#000"

    constructor(
        private cpService: ColorPickerService) {
        this.arrayColors['color'] = '#2883e9';
        this.arrayColors['color2'] = '#e920e9';
        this.arrayColors['color3'] = 'rgb(255,245,0)';
        this.arrayColors['color4'] = 'rgb(236,64,64)';
        this.arrayColors['color5'] = 'rgba(45,208,45,1)';
    }

    ngOnInit() {

    }

    onChangeColor(e: any) {
        this.onRender.emit(StageService.transformInput(this.tconfig.code, e))
    }

    onColorPickerShow(e: any, cp: any) {
        // let ev = e || window.event;
        // let eTargetName = e.target.parentNode.previousElementSibling.lastElementChild
        // console.log(e,eTargetName)
        // if(eTargetName.className == "color-picker"){
        //     eTargetName.style.display = 'block';
        // }
    }


}