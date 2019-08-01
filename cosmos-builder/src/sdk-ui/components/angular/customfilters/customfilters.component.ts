import { Component, OnInit, OnDestroy, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';
import { Communication, EventEmitter, EventType, ComponentEvent, DomEvent, DataStore } from "cosmos-td-sdk";
import { ReportConfigService } from '../../../service/report-config.service';
import { ConfigApi } from '../../../api/config-api';
import { Subscription } from 'rxjs/Subscription';

@Component({
	templateUrl: './customfilters.component.html',
	styleUrls: ['./customfilters.component.less'],

})
export class customfiltersComponent extends Communication implements OnInit {
	private datata: any;//暂存数据
	private cubefirst: any;//暂存数据

	private dimension: string;//选中的字典维度
	private condition: string;//选中的筛选条件
	private dict: any = ['', ''];//选中的数据字典
	private name: string = "";//文案
	private section: boolean;
	private customvalue: any;//选中的筛选条件下拉
	private customvalue1: string;//选中的筛选条件下拉
	private custom: Boolean = false;
	private scopeId: any;//唯一scope

	private dimensionOptions: any[] = [];
	private conditionoptions: any = [];
	private customs: any = [];
	private seek: any = [];
	private variation: boolean;//唯一scope
	private seeking: boolean = false;
	private seeknot: boolean;

	private options1: any = [
		{
			label: '等于',
			value: 'in',
		},
		{
			label: '不等于',
			value: 'not in'
		}
	];
	private options2: any = [
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
	];
	private options3: any = [
		{
			label: '等于',
			value: '=',
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
		}
	];
	showModalBind: any;
	private dictObj: any[];
	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private reportConfigService: ReportConfigService) {
		super();
		this.showModalBind = this.showModalMiddle.bind(this);
		EventEmitter.unRegister('showFilter', this.showModalBind, this);
		EventEmitter.register('showFilter', this.showModalBind, this);
	}
	/**
	 * 通知外层显示?
	 * @param date 
	 */
	showFilters(date: any) {
		DomEvent.fireEvent(this.filters.nativeElement, ComponentEvent.TOGGLECOMPONENT, {
			show: date
		});
	}
	times: number = 1; //页数
	row: number = 20;//条数
	loading: boolean = false;
	num0: any;//下拉框数
	num1: any;//总数

	scrollToBottom() {
		if (this.customs.length == this.num0) {
			this.loading = false;
		} else {
			if (!this.loading) {
				this.loading = true;
				setTimeout(() => {
					this.changeDimension(this.dimension, "load");
					this.loading = false;
				}, 2000);
			}
		}
	};
	public onDataChange(scope: string, data: any) {
		this.scopeId = scope;
		this.dimensionOptions = [];
		this.conditionoptions = [];
		this.dimension = null;
		this.condition = null;
		this.culbcustom();
		if (data && data[0] && data[0]["name"]) {
			this.name = data[0]["name"];
		} else {
			this.name = "";
		}
	}
	/**
	 * 获取第一个下拉框
	 */
	culbcustom(flush?: any) {
		let globalData = DataStore.getGlobalData();
		let productid;
		if (globalData && globalData["filter"]) {
			for (let k = 0; k < globalData["filter"].length; k++) {
				if (globalData["filter"][k]["field"] == "product_id") {
					productid = this.getParamByName(globalData["filter"][k]["field"]) || globalData["filter"][k]["value"];
				}
			}
		} else {
			let paramList = this.reportConfigService.globalParamList;
			if (paramList && paramList["filter"]) {
				for (let k = 0; k < paramList.length; k++) {
					if (paramList[k]["name"] == "product_id") {
						productid = this.getParamByName(paramList[k]["name"]) || null;
					}
				}
			} else {
				productid = null;
			}
		}
		let config = DataStore.getConfigData(this.scopeId);
		let filterCubeId: any;
		if (config && config["dataConfig"]) {
			filterCubeId = config["dataConfig"]["cube"];
		}
		let dat: any = { "cubeId": filterCubeId, "product_id": productid };
		// let dat: any = { "cubeId": 296, "product_id": 452 };
		this.reportConfigService.customqueryMetaAttr(dat).then((res: any) => {
			let data = res;
			this.dimensionOptions = [];
			for (let i = 0; i < data.length; i++) {
				for (let j = 0; j < data[i]["child"].length; j++) {
					this.dimensionOptions.push({ "label": data[i]["child"][j]["name"], "value": data[i]["child"][j]["code"], "displayType": data[i]["child"][j]["displayType"], "dicKey": data[i]["child"][j]["dicKey"] });
				}
			}
			this.datata = this.dimensionOptions;
			this.dimension = this.dimensionOptions[0].value;
			this.changeDimension(this.dimension);
		}).catch((err) => {
			return err;
		});
	}
	/**
     * 第一个下拉改变事件
     * @param value
     */
	private changeDimension(value: any, flush?: any) {
		if (this.cubefirst !== value || this.cubefirst == undefined) {
			this.customvalue = [];
		}
		this.cubefirst = value;
		this.dimension;
		this.conditionoptions = [];
		this.condition = null;
		this.num0 = -1;
		if (this.datata && this.datata.length > 0) {
			for (let i = 0; i < this.datata.length; i++) {
				if (this.datata[i].value == value) {
					this.custom = false;
					this.conditionoptions = [];
					this.condition = '';
					if (this.datata[i].displayType == "Tag") {
						this.conditionoptions = this.options1;
						this.condition = this.conditionoptions[0]["value"];
						this.custom = true;
					} else if (this.datata[i].displayType == "String") {
						this.conditionoptions = this.options2;
						this.condition = this.conditionoptions[0]["value"];
					} else {
						this.conditionoptions = this.options3;
						this.condition = this.conditionoptions[0]["value"];
					}
					let globalData = DataStore.getGlobalData(), productid;
					if (globalData && globalData["filter"]) {
						for (let k = 0; k < globalData["filter"].length; k++) {
							if (globalData["filter"][k]["field"] == "product_id") {
								productid = this.getParamByName(globalData["filter"][k]["field"]) || globalData["filter"][k]["value"];
							}
						}
					} else {
						let paramList = this.reportConfigService.globalParamList;
						if (paramList && paramList["filter"]) {
							for (let k = 0; k < paramList.length; k++) {
								if (paramList[k]["name"] == "product_id") {
									productid = this.getParamByName(paramList[k]["name"]) || null;
								}
							}
						} else {
							productid = null;
						}
					}
					if (flush == "load") {
						this.times++;

					} else {
						this.times = 1;
					}
					let dat: any = { "dicKey": this.datata[i].dicKey, "product_id": productid, "page": this.times, "pageSize": this.row };
					// let dat: any = { "dicKey": this.datata[i].dicKey, "product_id": 452, "page": this.times, "pageSize": this.row };//452
					if (this.datata[i]['displayType'] == "Tag") {
						if (dat['product_id']) {
							this.reportConfigService.customFilter(dat).then((res: any) => {
								let datalength = res.total;
								this.num0 = datalength;
								let data = res.data;
								if (data.length !== 0) {
									if (flush == "load") {
										if (datalength > this.customs.length) {
											for (let i = 0; i < data.length; i++) {
												this.customs.push({ "value": data[i]["id"], "label": data[i]["dicItemValue"], "isLeaf": true });
											}
										}
									} else {
										this.customs = [];
										for (let i = 0; i < data.length; i++) {
											this.customs.push({ "value": data[i]["id"], "label": data[i]["dicItemValue"], "isLeaf": true });
										}
									}

								} else {
									if (this.times == 1) {
										this.customvalue = [];
										this.customs = [];
									}
								}
								if (this.customs.length == this.num0) {
									this.loading = false;
								}
							}).catch((err) => {
								return err;
							});
						} else {
							this.customvalue = [];
							this.customs = [];
						}
					} else {
						this.customvalue = [];

					}
				}
			}
		}
	}
	/**
	 * 远程搜索
	 * @param searchText 
	 */
	searchChange(searchText: any) {
		this.seeking = true;
		this.seeknot = true;
		let globalData = DataStore.getGlobalData(), dicKey: any, productid: any;
		if (globalData && globalData["filter"]) {
			for (let k = 0; k < globalData["filter"].length; k++) {
				if (globalData["filter"][k]["field"] == "product_id") {
					productid = this.getParamByName(globalData["filter"][k]["field"]) || globalData["filter"][k]["value"];
				}
			}
		} else {
			let paramList = this.reportConfigService.globalParamList;
			if (paramList && paramList["filter"]) {
				for (let k = 0; k < paramList.length; k++) {
					if (paramList[k]["name"] == "product_id") {
						productid = this.getParamByName(paramList[k]["name"]) || null;
					}
				}
			} else {
				productid = null;
			}
		}
		this.dimension;
		this.datata.forEach((element: any) => {
			if (element && element["value"] == this.dimension) {
				dicKey = element["dicKey"];
				let dat: any = { "dicKey": dicKey, "product_id": productid, "dicItemValue": searchText, "page": 1, "pageSize": 500 };
				// let dat: any = { "dicKey": dicKey, "product_id": "452", "dicItemValue": searchText, "page": 1, "pageSize": 100 };
				if (element['displayType'] == "Tag") {
					if (dat['product_id']) {
						this.reportConfigService.customFilter(dat).then((res: any) => {
							let data = res.data;
							this.seek = [];
							if (data.length !== 0) {
								for (let i = 0; i < data.length; i++) {
									this.seek.push({ "value": data[i]["id"], "label": data[i]["dicItemValue"], "isLeaf": true });
								}
							}
						}).catch((err) => {
							return err;
						});
					} else {
						this.customvalue = '';
						this.seek = [];
					}
				}
			}
		});
	}
	close() {
		if (this.seeknot) {
			this.seeking = false;
			this.seeknot = false;
		}
	}
	public onStyleChange(scope: string, data: any) {
		this.scopeId = scope;//显示
		if (data.way == "show") {
			this.variation = true;
			this.showFilters(this.variation)

			DomEvent.fireEvent(this.filters.nativeElement, ComponentEvent.COMFILTERCHANGE,
				{
					data: {
						conditionFilters: this.center(this.dimension)
					},
					bubble: false   //是否发请求
				});

			this.filters["nativeElement"].style["height"] = "32px";
		} else if (data.way == "hide") {
			this.variation = false;
			this.showFilters(this.variation)

			DomEvent.fireEvent(this.filters.nativeElement, ComponentEvent.COMFILTERCHANGE,
				{
					data: {
						conditionFilters: ''
					},
					bubble: true   //是否发请求
				});

			this.filters["nativeElement"].style["height"] = "0";
			this.customvalue = [];
			// this.query()
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
					conditionFilters: this.center(this.dimension)
				},
				bubble: true //是否发请求
			});
	}
	center(cont: any) {
		let code;
		if (!this.datata) {
			return
		} else {
			for (let i = 0; i < this.datata.length; i++) {
				if (this.datata[i].value == cont) {
					code = this.datata[i].value
				}
			}
		}
		let data;
		if (this.custom) {
			let contLength: any = [];
			if (this.customvalue) {
				for (let k = 0; k < this.customvalue.length; k++) {
					contLength.push(this.customvalue[k]);
				}
			}
			data = [{
				field: code,
				operator: this.condition,
				value: contLength,
			}]
			return data;
		} else {
			if (this.condition == '在区间') {
				data = [{
					field: code,
					operator: '>=',
					value: this.customvalue,
				}, {
					field: code,
					operator: '<=',
					value: this.customvalue1,
				}]
			} else if (this.condition == '不包含') {
				data = [{
					type: 'not',
					field: code,
					operator: 'in',
					value: this.customvalue,
				}]
			} else if (this.condition == 'in') {
				data = [{
					field: code,
					operator: this.condition,
					value: this.customvalue,
				}]
			} else {
				data = [{
					field: code,
					operator: this.condition,
					value: this.customvalue,
				}]
			}
			return data;
		}

	}
	/**
	* 改变条件
	* @param value
	*/
	private changeCondition2(value: any) {
		this.section = false;
		if (value == '在区间') {
			this.section = true;
		}
	}
	/**
	* 改变条件
	* @param value
	*/
	private changeCondition(value: any) {
		this.customvalue = value;
	}


	/**
	* 查询数据字典
	* @param 
	*/
	private queryData() {
		this.reportConfigService.queryChartData(this.dictObj).then(res => {
			if (res && res['_body']) {
				let data = JSON.parse(res['_body']).data[0].data;
				if (data && data.length > 0) {
					for (let i = 0; i < data.length; i++) {
						let item = {}
						item['label'] = data[i]['dicItemValue'];
						item['value'] = data[i]['dicItemValue'];
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
		this.customs = [];
		this.dimension = null;
		this.condition = null;
		this.dict = ['', ''];//原先
	}

	ngOnDestroy(): void {
		EventEmitter.unRegister('showFilter', this.showModalMiddle, this);
	}
	/**
		* 获取URL
		* @param name 
		*/
	getParamByName(name: string) {
		var search = document.location.href;
		var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
		var matcher = pattern.exec(search);
		var items = null;
		if (null != matcher) {
			try {
				items = decodeURIComponent(decodeURIComponent(matcher[1]));
			} catch (e) {
				try {
					items = decodeURIComponent(matcher[1]);
				} catch (e) {
					items = matcher[1];
				}
			}
		}
		return items;
	};

	onDestroy() {
		EventEmitter.unRegister('showFilter', this.showModalMiddle, this);
	}
	showModalMiddle() {
		let config = DataStore.getConfigData(this.scopeId);
		let styleConfig = config && config["styleConfig"];
		if (styleConfig && styleConfig["way"]) {
			if (styleConfig["way"] == "show") {
				styleConfig["way"] = "hide";
				this.variation = false;

				DomEvent.fireEvent(this.filters.nativeElement, ComponentEvent.COMFILTERCHANGE,
					{
						data: {
							conditionFilters: ''
						},
						bubble: true   //是否发请求
					});
				this.showFilters(this.variation)
				this.filters["nativeElement"].style["height"] = "0";
				this.customvalue = [];
				// this.query()
			} else if (styleConfig["way"] == "hide") {
				styleConfig["way"] = "show";
				this.variation = true;

				DomEvent.fireEvent(this.filters.nativeElement, ComponentEvent.COMFILTERCHANGE,
					{
						data: {
							conditionFilters: this.center(this.dimension)
						},
						bubble: false   //是否发请求
					});
				this.showFilters(this.variation)
				this.filters["nativeElement"].style["height"] = "32px";
			}
			DataStore.saveConfigData(this.scopeId, "styleConfig", styleConfig);
		}
	};

	//深拷贝
	private deepCopy(data: any): any {
		let json = JSON.stringify(data);
		return JSON.parse(json);
	}
}
