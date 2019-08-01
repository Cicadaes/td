import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { StylePanel } from '../style.panel';

@Component({
    selector: 'color-style',
    templateUrl: './color-style.component.html',
    styleUrls: ['./color-style.component.less'],
})
export class colorStyleComponent implements OnInit {

    corLen: number = 10;
    colorStyle: any = {};                          //颜色对应数据
    _cmPosition: string = 'left';
    _cmPositionOffset: string = "0%";

    mode: any = "queue";

    colorsInit: string[] = [];
    colorOptions: string[] = [];
    _cmPresetColors: string[] = ['#ffffff', '#000000', '#2d8cf0', '#2de2c5', '#fcc45f', '#ff8454', '#db425a', '#34508c', '#5bb6fd', '#56d08b', '#b3e768', '#71808f'];
    color: string[];
    // 暖 color: string[] = ['#2d8cf0', '#2de2c5', '#fcc45f', '#ff8454', '#db425a', '#34508c', '#5bb6fd', '#56d08b', '#b3e768', '#71808f'];
    //冷 color: string[] = ['#34508C', '#2B85E4', '#1CB6FB', '#1BDBF5', '#80F2DA', '#C1F9D6', '#FCF4AE', '#FBE790', '#FFBD6E', '#FB7B49'];

    initData: any = {
        mode: this.mode,
        colors: []
    };
    @Input()
    set colors(data: any) {
        if (data) {
            this.color = data
        } else {
            this.color = ['#2d8cf0', '#2de2c5', '#fcc45f', '#ff8454', '#db425a', '#34508c', '#5bb6fd', '#56d08b', '#b3e768', '#71808f'];

        }
    }
    @Input()
    set layoutData(data: any) {
        if (data) {
            this.mode = data['mode'];
            this.colorOptions = data['colors'];
            for (let i = data['colors'].length; i < this.corLen; i++) {
                this.colorOptions.push(this.color[i]);
            }
            Object.assign(this.colorsInit, this.colorOptions);
            Object.assign(this.colorStyle, data);
        } else {
            this.colorsInit = this.color;
            Object.assign(this.colorOptions, this.color);

            this.initData.colors = this.colorOptions;
            Object.assign(this.colorStyle, this.initData);
        }
        this.OptionChange();
    }
    @Output() provinceOut = new EventEmitter();

    constructor(public configApi: ConfigApi) {

    }
   
    ngOnInit() {
        this.provinceOut.emit(this.colorStyle);
    }

    _colorPicker(index: number) {
        if (0 == index) {
            return true;
        }
        if (this.colorStyle.mode == "queue") {
            if (index < this.corLen) {
                return true;
            } else {
                return false;
            }
        } else if (this.colorStyle.mode == "single") {
            return false;
        } else {

        }
        return false;
    }

    colorChange(color: string, index: number) {
        this.colorOptions[index] = color;
        this.OptionChange();
    }

    OptionChange(event?: Event) {
        let barData = {};
        let corlen = this.colorStyle.mode == 'single' ? 1 : this.corLen;
        barData['colors'] = this.colorOptions.slice(0, corlen);
        Object.assign(this.colorStyle, barData);
        this.provinceOut.emit(this.colorStyle);
    }



}
