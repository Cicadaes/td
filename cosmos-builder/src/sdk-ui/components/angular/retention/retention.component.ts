import { Component, OnInit, OnDestroy, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';
import { Communication, EventEmitter, EventType, DataStore, ComponentEvent, DomEvent } from "cosmos-td-sdk";
import { RetentionGraph } from './retention.graph';
import { ConfigApi } from '../../../api/config-api';
@Component({
	templateUrl: './retention.component.html',
	styleUrls: ['./retention.component.less']
})
export class RetentionComponent extends Communication implements OnInit, OnDestroy {

	private data: any[] = [
		{
			"date": "2018-04-08",
			"sum_new_user": 824,
			"keep_user_1": 39.19,
			"keep_user_2": 32.4,
			"keep_user_3": 26.45,
			"keep_user_4": 24.15,
			"keep_user_5": 19.53,
			"keep_user_6": 8,
			"keep_user_7": 6.91,
			"keep_user_14": 0,
			"keep_user_30": 0
		},
		{
			"date": "2018-04-09",
			"sum_new_user": 735,
			"keep_user_1": 33.06,
			"keep_user_2": 39.18,
			"keep_user_3": 23.26,
			"keep_user_4": 14.69,
			"keep_user_5": 12.24,
			"keep_user_6": 7.07,
			"keep_user_7": 0,
			"keep_user_14": 0,
			"keep_user_30": 0
		}
	]
	private dataObj: any = {
		data: this.data,
		style: {
			content: {
				fontSize: 12, fontFamily: "Microsoft YaHei"
			},
			heatmap: {
				show: true, color: "#349ffd"
			}
		},
		dataConfig: {}
	};
	private _dateRange: Array<any> = [];
	private option: RetentionGraph = new RetentionGraph(this.dataObj);
	private visitor: string;
	private behavior: string;
	private showFilter: boolean = true;
	private dataConfig: any;
	private visitors: any = [

	]
	private behaviors: any = [

	]


	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private configApi: ConfigApi,
	) {
		super();
	}

	Dimension1: any;
	Dimension2: any;
	public onDataChange(scope: string, data: any) {
		let config = DataStore.getConfigData(scope);
		if (config && config["dataConfig"]) {
			this.dataObj.dataConfig = config["dataConfig"];
			this.option = new RetentionGraph(this.dataObj);
		}
		if (data && data.length > 0) {
			this.dataObj.data = data;
			this.option = new RetentionGraph(this.dataObj);
		}
		if (this.option && this.option['dataConfig']) {
			this.dataConfig = this.option['dataConfig'];
			this.visitors = [];
			this.behaviors = [];
			this.assign();
			this.Dimension1 = this.option['dataConfig']['checkDimension'];
			this.Dimension2 = this.option['dataConfig']['retainDimension'];
		}
	}

	public onStyleChange(scope: string, data: any) {
		this.dataObj.style = data;
		this.option = new RetentionGraph(this.dataObj);
		// this.changeDetectorRef.markForCheck();
		// this.changeDetectorRef.detectChanges();
	}

	public onSizeChange() {
		// if (this.cmchart && this.cmchart.echarts) {
		//     this.cmchart.echarts.resize();
		// }
	}

	private assign() {
		this.showFilter = this.dataConfig.isShowFilter;

		if (this.dataConfig.datetime) {
			this._dateRange = [new Date(this.dataConfig.datetime[0]), new Date(this.dataConfig.datetime[1])]
		}
		if (this.dataConfig.cube && this.dataConfig.checkDimension) {
			if (this.dataConfig.checkDimension != this.Dimension1) {
				this.configApi.queryDimensionValue(this.dataConfig.cube, this.dataConfig.checkDimension).then(data => {
					this.visitors = data;
				});
			}
		}
		if (this.dataConfig.cube && this.dataConfig.retainDimension) {
			if (this.dataConfig.retainDimension != this.Dimension2) {
				this.configApi.queryDimensionValue(this.dataConfig.cube, this.dataConfig.retainDimension).then(data => {
					this.behaviors = data;
				});
			}
		}
		if (this.dataConfig.checkDimensionValue) {
			this.visitor = this.dataConfig.checkDimensionValue;
		}
		if (this.dataConfig.retainDimensionValue) {
			this.behavior = this.dataConfig.retainDimensionValue;
		}
	}

	@ViewChild('retentionFilter') retentionFilter: any;

	private updateData() {
		let start = this.formateDate(this._dateRange[0])
		let end = this.formateDate(this._dateRange[1])
		if (this.dataConfig) {
			this.dataConfig['datetime'] = [start, end];
			this.dataConfig['checkDimensionValue'] = this.visitor;
			this.dataConfig['retainDimensionValue'] = this.behavior;
		}
		DomEvent.fireEvent(this.retentionFilter.nativeElement, ComponentEvent.COMFILTERCHANGE,
			{
				data: {
					retainFilterData: this.dataConfig
				},
				bubble: true
			});
	}

	/**
     * 格式化Date 为 “YYYY-MM-DD”
     * @param date 
     */
	formateDate(date: Date) {
		if ("string" == typeof (date)) {
			date = new Date(date);
		}
		let seperator1 = "-";
		let year = date.getFullYear();
		let month: any = date.getMonth() + 1;
		let strDate: any = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		let currentdate = year + seperator1 + month + seperator1 + strDate;
		return currentdate;
	}

	public onVisualArea(scope: string, data?: any) {
		EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope, componentFilter: data });
	}
	//深拷贝
	private deepCopy(data: any): any {
		let json = JSON.stringify(data);
		return JSON.parse(json);
	}
	ngOnInit() {

	}

	ngOnDestroy() {

	}

}
