import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DataStore } from 'cosmos-td-sdk';
import { EventEmitter } from 'cosmos-td-sdk';
import { ComponentEvent, EventType } from 'cosmos-td-sdk';
import { ConfigApi } from '../../../../api/config-api';
import { StylePanel } from '../../common/style.panel';


@Component({
    templateUrl: './retentionFilter-style.component.html',
    styleUrls: ['./retentionFilter-style.component.less'],
})

export class RetentionFilterStyleComponent extends StylePanel implements OnInit {
    
    heatmap: any = {};  //热力图
    content: any = {};  //内容
    /*颜色组件 */
    _cmDisColor: string = "#399DFB";
    _cmPosition: string = 'left';
    _cmPositionOffset: string = "20%";
    _cmPresetColors: string[] = ['#ffffff', '#000000', '#2889e9', '#e920e9', '#00afc4', '#fff500', '#ff6530', '#00a150', '#fbc9ef', '#b28850', '#00ffff', 'rgb(236,64,64)'];
    simple:any="noRgb";
    /* 图例文字大小 */
    fontSizesRetention: number[] = [8, 9, 10, 11, 12, 14, 18, 24, 28, 30, 32, 36, 48, 60, 72, 96];
    fontSizeRetention: any[] = [{ label: "自动", value: 12 }].concat(this.fontSizesRetention.map(item => { return { label: item + "px", value: item } }));
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

    constructor(public configApi: ConfigApi) {
        super(configApi);
    }

    ngOnInit() {
        let config = DataStore.getConfigData(this.configApi.scope);

        let styleConfig = config && config["styleConfig"];
        if (styleConfig && styleConfig["heatmap"]) {
            this.heatmap = styleConfig["heatmap"];
        } else {
            this.heatmap = {
                show: false,
                color: this._cmDisColor
            }
        }
        if (styleConfig && styleConfig["content"]) {
            this.content = styleConfig["content"];
        } else {
            this.content = {
                fontSize:this.fontSizeRetention[0].value,
                fontFamily:this.typefaces[0].value
            }
        }        
        this.OptionChange();
    }

    OptionChange(event?: Event) {

        let data = { heatmap:this.heatmap,content: this.content};
        this.nofication(this.configApi.scope, data);
    }
}

