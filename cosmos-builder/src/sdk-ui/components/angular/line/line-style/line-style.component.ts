import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { StylePanel } from '../../common/style.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore } from 'cosmos-td-sdk';


@Component({
    templateUrl: './line-style.component.html',
    styleUrls: ['./line-style.component.less'],
})
export class LineStyleComponent extends StylePanel implements OnInit {
    lineStyle: any = {};

    missingData: any = "breakValue";

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
                scaling:false,
            };
        }

        this.componentStyleConf(styleConfig);
        this.OptionChange();
    }

    OptionChange(event?: Event) {
        let data = {
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
        if (this.axisStyle.xAxisLabel || this.axisStyle.yAxisLabel) {
            let data = {
                line: this.lineStyle,
                missingData: this.missingData,
                layout: this.layoutStyle,
                legend: this.legendStyle,
                axis: this.axisStyle,
                grid: this.gridStyle
            };
            this.renderEcharts(data);
        }
    }

}
