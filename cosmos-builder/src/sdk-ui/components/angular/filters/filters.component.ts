import { Component, OnInit, OnDestroy, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';
import { Communication, EventEmitter, EventType, ComponentEvent, DomEvent } from "cosmos-td-sdk";
import { ReportConfigService } from '../../../service/report-config.service';
import { DataStore } from 'cosmos-td-sdk';
import { ConfigApi } from '../../../api/config-api';

@Component({
	templateUrl: './filters.component.html',
	styleUrls: ['./filters.component.less'],

})
export class FiltersComponent extends Communication implements OnInit, OnDestroy {
	private data: any;//暂存数据 
	private dimension: string;//选中的字典维度
	private condition: string;//选中的筛选条件
	private dict: any = ['', ''];//选中的数据字典
	private name: string = "";//文案
	// isVisibleMiddle: boolean = true;
	scopeId: any;//唯一scope

	private dimensionOptions: any[] = [
		{
			label: '1',
			value: '1'
		},
		{
			label: '2',
			value: '2'
		},
		{
			label: '',
			value: ''
		}
	]
	private conditionoptions: any;
	private dictOptions: any[] = [
		{
			label: '1',
			value: '1'
		},
		{
			label: '2',
			value: '2'
		}
	]
	private options1: any[] = [
		{
			label: '等于',
			value: '=',
		},
		{
			label: '不等于',
			value: '!='
		},
		{
			label: '包含',
			value: 'in'
		},
		{
			label: '不包含',
			value: '不包含'
		}
	]
	private options2: any[] = [
		{
			label: '等于',
			value: '='
		},
		{
			label: '大于',
			value: '>'
		},
		{
			label: '大于等于',
			value: '>='
		},
		{
			label: '小于',
			value: '<'
		},
		{
			label: '小于等于',
			value: '<='
		},
		{
			label: '在区间',
			value: '在区间'
		},
	]

	
	private dictObj: any[];
	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private reportConfigService: ReportConfigService,
		public configApi: ConfigApi,
	) {
		super();
		// EventEmitter.register('showFilter', this.showModalMiddle, this);

	}
	showModalMiddle() {
		let config = DataStore.getConfigData(this.scopeId);
		let styleConfig = config && config["styleConfig"];
		if (styleConfig && styleConfig["way"]) {
			if (styleConfig["way"] == "show") {
				styleConfig["way"] = "hide";
				this.filters["nativeElement"].style["height"] = "0";
			} else if (styleConfig["way"] == "hide") {
				styleConfig["way"] = "show";
				this.filters["nativeElement"].style["height"] = "32px";
			}
			DataStore.saveConfigData(this.scopeId, "styleConfig", styleConfig);
		}
	};
	public onStyleChange(scope: string, data: any) {
		this.scopeId = scope;//显示
		if (data.way == "show") {
			this.filters["nativeElement"].style["height"] = "32px";
		} else if (data.way == "hide") {
			this.filters["nativeElement"].style["height"] = "0";
		}
	};
	public onDataChange(scope: string, data: any) {
		this.scopeId = scope;
		this.data = data[0];
		if (this.data.name) {
			this.name = this.data.name;
		} else {
			this.name = "";
		}
		this.dimensionOptions = [];
		this.conditionoptions = [];
		this.dimension = null;
		this.condition = null;
		this.dict = ['', ''];//原先
		if (this.data.dimensions) {
			this.dimensionOptions = [];
			this.dimension = null;
			for (let i = 0; i < this.data.dimensions.length; i++) {
				let item = {}
				if (this.data.dimensions[i]['value'] !== "") {
					item['label'] = this.data.dimensions[i]['value'];
					item['value'] = this.data.dimensions[i]['value'];
					this.dimensionOptions.push(item)
				}

			}
			this.dimension = this.dimensionOptions[0].value;
			this.changeDimension(this.dimension);
		}
	}

	/**
     * 改变维度
     * @param value
     */
	private changeDimension(value: any) {
		this.conditionoptions = [];
		this.condition = null;
		this.dict = ['', ''];//原先
		if (this.data && this.data.DimensionList && this.data.DimensionList.length > 0) {
			for (let i = 0; i < this.data.DimensionList.length; i++) {
				if (this.data.DimensionList[i].value == value) {
					// 1:string,2:int,3:date,4:datetime,5:double
					if (this.data.DimensionList[i].type == 2 || this.data.DimensionList[i].type == 5) {//数值型//不去根据对应元数据对象类型判断支持条件
						this.conditionoptions = this.options2;
					} else {//枚举型
						this.conditionoptions = this.options1;
					}
					this.condition = this.conditionoptions[0].value;
					this.dictObj = [
						{
							"cubeId": this.data.cube,
							"dimensions": [
								{
									"field": this.data.DimensionList[i].value,
								}
							],
							"filters": [
								{
									"type": "and",
									"condition": [
										{
											"field": this.data.DimensionList[i].parentName,
											"operator": "=",
											"value": "%%"
										}
									]
								}
							],
							"groupBy": [
								{
									"field": this.data.DimensionList[i].value,
								}
							],
							"dictionary": true
						}
					]
				}
			}
		}
	}

	@ViewChild('filters') filters: any;

	/**
	* 查询
	* @param 
	*/
	private query() {
		DomEvent.fireEvent(this.filters.nativeElement, ComponentEvent.COMFILTERCHANGE,
			{
				data: {
					conditionFilters: this.center()
				},
				bubble: true
			});
	}
	center() {
		let data;
		if (this.condition == '在区间') {
			data = [{
				field: this.dimension,
				operator: '>=',
				value: this.dict[0]
			}, {
				field: this.dimension,
				operator: '<=',
				value: this.dict[1]
			}]
		} else if (this.condition == '不包含') {
			data = [{
				type: 'not',
				field: this.dimension,
				operator: 'in',
				value: [this.dict[0]]
			}]
		} else if (this.condition == 'in') {
			data = [{
				field: this.dimension,
				operator: this.condition,
				value: [this.dict[0]]
			}]
		} else {
			data = [{
				field: this.dimension,
				operator: this.condition,
				value: this.dict[0]
			}]
		}
		return data;
	}
	/**
	* 改变条件
	* @param value
	*/
	private changeCondition(value: any) {
		this.dict = ['', ''];
		// if (this.dictObj) {
		// 	this.dictObj[0].filters[0].condition[0].operator = "=";
		// 	this.queryData();
		// }
	}

	/**
	* 查询数据字典
	* @param 
	*/
	private queryData() {
		this.reportConfigService.queryChartData(this.dictObj).then(res => {
			this.dictOptions = [];
			if (res && res['_body']) {
				let data = JSON.parse(res['_body']).data[0].data;
				if (data && data.length > 0) {
					for (let i = 0; i < data.length; i++) {
						let item = {}
						item['label'] = data[i]['dicItemValue'];
						item['value'] = data[i]['dicItemValue'];
						this.dictOptions.push(item)
					}
				}
			}
		}).catch(err => { });
	}

	public onSizeChange() {

	}

	public onVisualArea(scope: string) {
		EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope });
	}

	ngOnInit() {
		this.dimensionOptions = [];
		this.conditionoptions = [];
		this.dictOptions = [];
		this.dimension = null;
		this.condition = null;
		this.dict = ['', ''];//原先
	}

	ngOnDestroy() {

	}

}
