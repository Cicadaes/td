import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { StylePanel } from '../../common/style.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore } from 'cosmos-td-sdk';


@Component({
    templateUrl: './area-style.component.html',
    styleUrls: ['./area-style.component.less'],
})
export class AreaStyleComponent extends StylePanel implements OnInit {
    lineStyle: any = {};
    missingData: any = "breakValue";

    /* 小数精度 */
    decimal: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    decimals: any[] = [{ label: "自动", value: "auto" }].concat(this.decimal.map(item => { return { label: item, value: item } }));

    /* 边框宽度 */
    radiusArr: number[] = [0, 1, 2, 3, 4, 5, 6];
    borderWidths: any[] = [].concat(this.radiusArr.map(item => { return { label: item + "px", value: item } }));

    constructor(public configApi: ConfigApi) {
        super(configApi);
    }

    ngOnInit() {

        let config = DataStore.getConfigData(this.configApi.scope);
        let styleConfig = config && config["styleConfig"];

        if (styleConfig && styleConfig["line"]) {
            this.missingData = styleConfig["missingData"];
            this.lineStyle = styleConfig["line"];
            
        } else {
            this.lineStyle = {
                displayPoint: false,
                dataLabel: false,
                borderWidth: this.borderWidths[1].value,
                decimals: "auto",
                scaling:false,
            };
        }

        this.componentStyleConf(styleConfig);
        this.OptionChange();
    }

    OptionChange(event?: Event) {
        let data = {
            color: this.colorStyle,
            line: this.lineStyle,
            missingData: this.missingData,
            layout: this.layoutStyle,
            legend: this.legendStyle,
            axis: this.axisStyle,
            grid: this.gridStyle
        };
        if(data.line.dataLabel){
            data.line.displayPoint = true;
        }

        this.nofication(this.configApi.scope, data);
    }

    public reRenderData(type: string) {
        if (type != 'line') {
            return;
        }
        // if (this.axisStyle.xAxisLabel || this.axisStyle.yAxisLabel) {
            let data = {
                color: this.colorStyle,
                line: this.lineStyle,
                missingData: this.missingData,
                layout: this.layoutStyle,
                legend: this.legendStyle,
                axis: this.axisStyle,
                grid: this.gridStyle,
            };
            this.renderEcharts(data);
        // }
    }

}
