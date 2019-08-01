import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';

@Component({
    selector: 'background-border',
    templateUrl: './BgBd-style.html',
    styleUrls: ['./BgBd-style.less'],
})

export class BgBdStyleComponent implements OnInit {

    bgAndBorder: any = {};                          //背景与边框对应数据
    boxShadow: any = "none";
    /* 颜色组件 */
    cmcolorBg: string = "#FFFFFF";            //背景默认颜色
    cmcolorBd: string = "#FFFFFF";            //边框默认颜色
    _cmPosition: string = "left";
    _cmPositionOffset: string = "0%";
    _cmPositionOffsetcolor: string = "-1000%";       //颜色偏移量
    _cmPositionOffsetbackground: string = "-1000%";  //背景偏移量
    _cmPresetColors: string[] = ["#ffffff", "#000000", "#2889e9", "#e920e9", "#00afc4", "#fff500", "#ff6530", "#00a150", "#fbc9ef", "#b28850", "#00ffff", "rgb(236,64,64)"];

    /* 圆角半径 */
    radiusArr: number[] = [0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];
    filletRadius: any[] = [].concat(this.radiusArr.map(item => { return { label: item + "px", value: item + "px" } }));

    /* 边框宽度 */
    borderArr = [1, 2, 3, 4, 5];
    borderWidths: any[] = [{ label: "无", value: "0" }].concat(this.borderArr.map(item => { return { label: item + "px", value: item + "px" } }));
    /* 透明度 */
    transpArr: string[] = ["0", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];

    /* 边框样式 */
    borderStyles = [
        {
            value: 'solid',
            label: '实线'
        },
        {
            value: 'dashed',
            label: '虚线'
        },
        {
            value: 'dotted',
            label: '点线'
        },
        {
            value: 'double',
            label: '双框'
        }
    ];
    /*显示边框*/
    borderTop = false;
    borderBottom = false;
    borderLeft = false;
    borderRight = false;

    initData: any = {
        backgroundColor: this.cmcolorBg,
        borderColor: this.cmcolorBd,
        borderRadius: this.filletRadius[0].value,
        borderWidth: this.borderWidths[0].value,
        borderStyle: this.borderStyles[0].value,
        boxShadow: "none",
        borderTop: "none",
        borderBottom: "",
        borderLeft: "none",
        borderRight: "none",
    };

    @Input()
    set layoutData(data: any) {
        if (data) {
            this.cmcolorBg = data['backgroudColor'] || this.cmcolorBg;
            this.cmcolorBd = data['borderColor'] || this.cmcolorBd;
            Object.assign(this.bgAndBorder, data);
            // this.boxShadow = this.bgAndBorder.boxShadow == "#c7c6c6 0px 0px 3px 3px" ? "round" : true;
            if (this.bgAndBorder.boxShadow == "#c7c6c6 0px 0px 3px 3px") {
                this.boxShadow = "round"
            } else if (this.bgAndBorder.boxShadow == "#c7c6c6 3px 3px 3px 0px") {
                this.boxShadow = "rightBottom"
            } else {
                this.boxShadow = "none"
            }
            this.borderTop = this.bgAndBorder.borderTop == "none" ? false : true;
            this.borderBottom = this.bgAndBorder.borderBottom == "none" ? false : true;
            this.borderLeft = this.bgAndBorder.borderLeft == "none" ? false : true;
            this.borderRight = this.bgAndBorder.borderRight == "none" ? false : true;
        } else {
            Object.assign(this.bgAndBorder, this.initData);
        }
        this.optionChange();
    }

    @Output() provinceOut = new EventEmitter();

    constructor(private configApi: ConfigApi) {

    }

    ngOnInit() {
        this.provinceOut.emit(this.bgAndBorder);
    }

    optionChange(event?: Event) {
        if (this.boxShadow == "rightBottom") {
            this.bgAndBorder.boxShadow = "#c7c6c6 3px 3px 3px 0px";//右下
        }
        if (this.boxShadow == "round") {
            this.bgAndBorder.boxShadow = "#c7c6c6 0px 0px 3px 3px";//四周
        }
        if (this.boxShadow == "none") {
            this.bgAndBorder.boxShadow = "none";//无
        }
        if (this.borderTop == true) {
            this.bgAndBorder.borderTop = "";
        }
        if (this.borderTop == false) {
            this.bgAndBorder.borderTop = "none";
        }

        if (this.borderBottom == true) {
            this.bgAndBorder.borderBottom = "";
        }
        if (this.borderBottom == false) {
            this.bgAndBorder.borderBottom = "none";
        }

        if (this.borderLeft == true) {
            this.bgAndBorder.borderLeft = "";
        }
        if (this.borderLeft == false) {
            this.bgAndBorder.borderLeft = "none";
        }

        if (this.borderRight == true) {
            this.bgAndBorder.borderRight = "";
        }
        if (this.borderRight == false) {
            this.bgAndBorder.borderRight = "none";
        }
        this.provinceOut.emit(this.bgAndBorder);
    }
    OptionChange(event?: Event) {
        if (event == null) {
            this.bgAndBorder.borderWidth = "0px";
        }
        this.provinceOut.emit(this.bgAndBorder);
    }
}