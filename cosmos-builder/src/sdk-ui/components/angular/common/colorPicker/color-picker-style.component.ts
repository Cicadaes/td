import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { StylePanel } from '../style.panel';

@Component({
    selector: 'color-picker-style',
    templateUrl: './color-picker-style.component.html',
    styleUrls: ['./color-picker-style.component.less'],
})
export class colorPickStyleComponent implements OnInit {
    toggle: boolean = false;
    cpPresetColors: string[];//要在颜色选择器对话框中显示的预设颜色数组。
    color: any;
    cpOutputFormat: any;//颜色格式
    widths:any;//宽
    heights:any//高
    @ViewChild('colorpick') colorpick: any;

    @Input()
    set colors(data: any) {
        if (data) {
            this.cpPresetColors = data;
        } else {
            this.cpPresetColors = ['#ffffff', '#000000', '#2d8cf0', '#2de2c5', '#fcc45f', '#ff8454', '#db425a', '#34508c', '#5bb6fd', '#56d08b', '#b3e768', '#71808f'];

        }
    }
    @Input()
    set cmcolor(data: any) {
        if (data) {
            this.color = data;
        } else {
            this.color = "#ffffff";
        }
    }
    @Input()
    set cmType(data: any) {
        if (data) {
            this.cpOutputFormat = data;
        } else {
            this.cpOutputFormat = 'hex';
        }
    }
    @Input()
    set height(data: any) {
        if (data) {
            this.heights = data+"px";
        } else {
            this.heights = '16px';
        }
    }
    @Input()
    set width(data: any) {
        if (data) {
            this.widths = data+"px";
        } else {
            this.widths = '16px';
        }
    }
    @Output() provinceOut = new EventEmitter();

    colorChange(data: any) {
        this.provinceOut.emit(data);
    }

    constructor(public configApi: ConfigApi) {

    }

    ngOnInit() {
    }
}
