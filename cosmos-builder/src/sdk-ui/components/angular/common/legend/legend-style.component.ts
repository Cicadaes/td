import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';


@Component({
    selector: 'legend-style',
    templateUrl: './legend-style.html',
    styleUrls: ['./legend-style.less'],
})

export class LegendStyleComponent implements OnInit {

    _layout: string;         //排布默认
    alignmentValue: string = "right";      //排布选择默认
    upleft: any;                            //排布上/左
    lowright: any;                          //排布下/右
    legend: any = {};                       //图例数据
    character: Number;                       //字符数

    _cmcolor: string = "#515A6E";           //标签默认色
    _cmPosition: string = "left";
    _cmPositionOffset: string = "0%";
    _cmPresetColors: string[] = ['#ffffff', '#000000', '#2889e9', '#e920e9', '#00afc4', '#fff500', '#ff6530', '#00a150', '#fbc9ef', '#b28850', '#00ffff', 'rgb(236,64,64)'];

    /* 图例文字大小 */
    fontSizesArr: number[] = [8, 9, 10, 11, 12, 14, 18, 24, 28, 30, 32, 36, 48, 60, 72, 96];
    fontSizeOptions: any[] = [{ label: "自动", value: 12 }].concat(this.fontSizesArr.map(item => { return { label: item + "px", value: item } }));

    /* 字体设置 */
    typefaces = [
        {
            value: "PingFangSC-Medium",
            label: "苹方中号"
        },
        {
            value: "Microsoft YaHei",
            label: "微软雅黑"
        },
        {
            value: "SimHei",
            label: "黑体"
        },
        {
            value: "SimSun",
            label: "宋体"
        },
        {
            value: "FangSong",
            label: "仿宋"
        },
        {
            value: "KaiTi",
            label: "楷体"
        },
    ];

    @Input()
    set legendPosition(data: any) {
        if (data) {
            this._layout = data;
        } else {
            this._layout = "flushTop";
        }
    }
    @Input()
    set layoutData(data: any) {
        if (data) {
            this._cmcolor = data['color'] || this._cmcolor;
            this._layout = data['layout']['type'] || this._layout;
            this.alignmentValue = data['layout']['orientation'] || this.alignmentValue;
            Object.assign(this.legend, data);
        } else {
            this.legend = {
                color: this._cmcolor,
                fontSize: this.fontSizeOptions[0].value,
                fontFamily: this.typefaces[0].value,
                character: 10,
                layout: {
                    type: this._layout,
                    orientation: this.alignmentValue
                }
            };
        }
        this.optionChange();
    }

    @Output() legendOut = new EventEmitter();
    constructor(private configApi: ConfigApi) {
        configApi;
    }

    ngOnInit() {

    }

    highlightIcon() {

    }

    colorChange(color: string) {
        this.legend.color = color;
        this.legendOut.emit(this.legend);
    }

    layoutChange(event?: Event) {
        if (this._layout === "none") {
            this.alignmentValue = "";
        }
        if (this._layout === "flushRight") {
            this.alignmentValue = "middle";
        }
        if (this._layout === "flushTop") {
            this.alignmentValue = "right";
        }
        if (this._layout === "flushBottom") {
            this.alignmentValue = "center";
        }

        this.optionChange();
    }

    optionChange(event?: Event) {
        this.legend['layout'] = { type: this._layout, orientation: this.alignmentValue };
        this.legendOut.emit(this.legend);
    }


    OptionChange(data: any) {
        if (typeof (data) !== 'boolean') {
            let cont = Number(this.legend.character)
            if (cont < 0) {
                this.legend.character = 10;
            }
        }
        this.optionChange();
    }
    inputNumberChange(data: any) {
    }
}