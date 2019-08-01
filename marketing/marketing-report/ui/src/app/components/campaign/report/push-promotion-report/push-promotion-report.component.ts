import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
	SliderModule,
	ButtonModule,
	DataTableModule,
	SharedModule,
	SelectItem,
	Message
} from 'primeng/primeng';
import { SegmentResourceService } from "../../../../services/campaign/segment.resource.service";
import { SegmentTaskCalcObjectRecordResourceService } from "../../../../services/campaign/segment_task_calc_object_record.resource.service";
import * as moment from "moment";
import { EffectService } from "../../../../services/report/effect.communication.service";
import { ErrorHandlingService } from './../../../../services/exceptional/error-handling.service';
import { PushReachReports } from '../../../../services/report/push_reach_reports.resource.service';

@Component({
	selector: 'push-promotion-report',
	templateUrl: 'push-promotion-report.component.html',
	styleUrls: ['push-promotion-report.component.css'],
	providers: [SegmentResourceService, SegmentTaskCalcObjectRecordResourceService, EffectService, PushReachReports]
})

export class PushPromotionReportComponent {

	@Input() set inPromotionId(inPromotionId:any){
		this.segmentId = inPromotionId;
	}

	@Input() set isDialog(isDialog:any){
		this.isDialogReport = isDialog;
	}

	//如果是弹框需要将错误信息传递到外层
	@Output() errorMessage = new EventEmitter<any>();
	
	isDialogReport: boolean = false; //是否是弹框显示

	campaignId: number;
	segmentId: number;
	promotionName: string;
	effectList: any = [];
	allActualVal: number = 0;
	statRange: number = 8;
	statRangeList: SelectItem[];
	chartList: any = {
		series: []
	};
	legend: any = [];

	cycleTimeList: any = [];  //循环时间数组
	showTimeList: any = []; //显示的循环时间
	leftButton: boolean = false; //循环左边按钮是否可点击
	rightButton: boolean = false; //循环右边按钮是否可点击
	cycleSelect: string;

	downloadJson: any = {
		type: 'segment'
	};

	tableHeaderDefualt: any = [
		{field: 'time', header: '时间'}
	];
	tableHeaders: any;
	tableList: any = [];

	isOne: boolean = true;  //判断是否有A/B test true只有一条消息 不是A/B test
	cols:any[];
	conts:any[];
	barShow:boolean = false;
	chartShow:boolean = true;
	xdata:any[];
	series:any[];
	buttonList: any = [
		{type: 'sent', name: '发送数'},
		{type: 'arrivaled', name: '到达数'},
		{type: 'impressions', name: '展示数'},
		{type: 'click', name: '点击数'}
	]
	selectButton: string = "sent";   //趋势分析按钮默认选择发送数
	formatName: string = '发送数';

	msgs: Message[] = []; //错误提示数组

	//echarts 浮层回调
	chartsFn: any = function(params: any) {
		let text: string;
		if (!/^[0-9]*$/.test(params[0].name.substring(params[0].name.length - 2))) {
			text = params[0].name;
		} else {
			let time = new Date(params[0].name + ':00');
			text = formateDate(time);
		}
		let str = params[0].seriesName;
		let strArr = str.split('-');
		function formateDate(data: any) {
			let year = data.getFullYear();
			let month = data.getMonth() + 1;
			let date = data.getDate();
			let hour = data.getHours();
			let minutes = data.getMinutes();
			if (month < 10) {
				month = '0' + month;
			}
			if (date < 10) {
				date = '0' + date;
			}
			if (hour < 10) {
				hour = '0' + hour;
			}
			if (minutes < 10) {
				minutes = '0' + minutes
			}
			return year + '-' + month + '-' + date + ' ' + hour + ':' + minutes;
		}
		let res = '<p>'+ text + '</p>';
		res += '<p><span style="width: 75px;display: inline-block;font-size: 14px;">'+ strArr[1] == 'undefined' ? strArr[0] : strArr[0] +'</span><span style="float: right;">用户数</span></p>';
		let count = 0;
		for(var i = 0 ;i < params.length; i++){
			res += '<p><span style="width: 10px;display: inline-block;color: ' + params[i].color + '">●</span><span style="width: 85px;display: inline-block;font-size: 12px;">' + params[i]['seriesName'] + '</span><span style="color:#5697f1;">' + params[i]['value'] + '</span></p>';
			count += params[i]['value'];
		}
		res += '<p><span style="width: 95px;display: inline-block;">总计</span><span>' + count + '</span></p>'
		return res;
	}

	constructor(
		private segmentResourceService: SegmentResourceService,
		private pushReachReports: PushReachReports,
		private segmentTaskCalcObjectRecordResourceService: SegmentTaskCalcObjectRecordResourceService,
		private route: ActivatedRoute,
		private effectService: EffectService,
		private errorHandlingService: ErrorHandlingService
	){
		
	}

	ngOnInit() {
        let that = this;
        that.cols = [
            {field: 'groupName', header: '推送方案'},
            {field: 'sent', header: '发送数'},
            {field: 'arrivaledRate', header: '到达率'},
            {field: 'arrivaled', header: '到达数'},
            {field: 'impressionsRate', header: '展示率'},
            {field: 'impressions', header: '展示数'},
            {field: 'clickRate', header: '点击率'},
            {field: 'click', header: '点击数'}
        ];
		that.statRangeList = [
			{label: '推送开始8小时内', value: 8},
			{label: '推送开始1日内', value: 24},
			{label: '推送开始2日内', value: 48},
		];

		if(!this.segmentId){//从投放列表页进入的，segmentId挂在了链接上
			that.segmentId = that.route.params['value'].id;
		}

		that.getPushReport();
    };

	getPushReport(){
		let that = this;
		that.segmentResourceService.get(that.segmentId)
		.then(data => {
			if (data && (data.msgDes || data.retCode)) {
				that.error(data);
				return;
			}
			that.campaignId = data.campaignId;
			that.promotionName = data.name;
			//获取投放计划目标贡献详情
			let json = {
				campaignId: that.campaignId,
            	segments: [that.segmentId]
			}
			that.effectService.getEffectOverview(json).then((data:any)=>{
				if (data && (data.msgDes || data.retCode)) {
					that.error(data);
					return;
				}
				that.effectList = data;
			}).catch(err => {
				that.error(err);
			});
			if(data.triggerType < 3) {
				that.pushReachReports.getTableList(that.segmentId)
				.then(data => {
					if (data && (data.msgDes || data.retCode)) {
						that.error(data);
						return;
					}
					that.conts = that.collatingData(data);
					that.getEChartsData();
				}).catch(err => {});
			} else {
				that.segmentTaskCalcObjectRecordResourceService.getDateList(that.segmentId)
				.then(data => {
					if (data && (data.msgDes || data.retCode)) {
						that.error(data);
						return;
					}
					that.cycleTimeList = that.sortTime(data);
					let lasterTime = that.cycleTimeList[that.cycleTimeList.length - 1];
					if(that.cycleTimeList.length > 7) {
						that.showTimeList = that.cycleTimeList.slice(-7);
						that.leftButton = true;
						that.cycleSelect = that.showTimeList[that.showTimeList.length - 1];
					} else {
						that.showTimeList = that.cycleTimeList;
						that.cycleSelect = that.showTimeList[that.cycleTimeList.length - 1];
					}
					let json = {
						date: that.cycleSelect
					};
					return that.pushReachReports.getTableList(that.segmentId, json)
				}).then(data => {
					if (data && (data.msgDes || data.retCode)) {
						that.error(data);
						return;
					}
					that.conts = that.collatingData(data);
					that.getEChartsData('sent', that.statRange, that.cycleSelect);
				}).catch(err => {
					that.error(err);
				});
			}
		}).catch(err => {
			that.error(err);
			console.log('===>>', err);
		});
	}

	onChart(change:boolean){
		this.chartShow = true;
    	this.barShow = false;
    };
    onBar(change:boolean){
    	this.chartShow = false;
    	this.barShow = true;
    }

	getEChartsData(tp?: string, hours?: number, date?: any) {
		let that = this;
		let json = {
			segmentId: that.segmentId,
			hours: hours || that.statRange,
			tp: tp || that.selectButton
		}
		if (date) {
			json['date'] = date;
		}
		that.downloadJson = {
			type: 'segment',
			segmentId: that.segmentId,
			time: that.cycleSelect,
			statRange: that.statRange
		};
		that.pushReachReports.getTrendList(json)
		.then(data => {
			if (data && (data.msgDes || data.retCode)) {
				that.error(data);
				return;
			}
			that.formatEchartsData(data);
			that.series = that.chartList.series;
			that.xdata = that.chartList.xdata;
			that.formatDataToTable(that.series, that.xdata);
		}).catch(err => {
			console.log('err => ', err);
		})
	}

	getPushPromotionData(time: string) {
		let that = this;
		that.downloadJson = {
			type: 'segment',
			segmentId: that.segmentId,
			time: time,
			statRange: that.statRange
		};
		that.cycleSelect = time;
		that.pushReachReports.getTableList(that.segmentId, {date: time})
		.then(data => {
			if (data && (data.msgDes || data.retCode)) {
				that.error(data);
				return;
			}
			that.conts = that.collatingData(data);
			that.getEChartsData(that.selectButton, that.statRange, that.cycleSelect);
		})
	}

	//整理数据
	collatingData(data: any) {
		let that = this;
		let list = [];
		let length = data.length;
		let countData = {
			groupName: '总计',
			sent: 0,
			arrivaled: 0,
			impressions: 0,
			click: 0
		};
		if (length > 1) {
			that.isOne = false;
		} else {
			that.isOne = true;
		}
		for(let i = 0; i < length; i++) {
			if(length === 0) {
				break;
			}
			if (i === 0) {
				data[i].groupName = "A";
			} else if (i === 1) {
				data[i].groupName = "B";
			} else if (i === 2) {
				data[i].groupName = "C";
			}
			let json = {
				groupName: data[i].groupName,
				ratio: data[i].ratio,
				sent: data[i].sent,
				arrivaledRate: ((data[i].arrivaled/data[i].sent) * 100 || 0).toFixed(2) + '%',
				arrivaled: data[i].arrivaled,
				impressionsRate: ((data[i].impressions/data[i].arrivaled) * 100 || 0).toFixed(2) + '%',
				impressions: data[i].impressions,
				clickRate: ((data[i].click/data[i].arrivaled) * 100 || 0).toFixed(2) + '%',
				click: data[i].click
			}
			countData.sent += data[i].sent;
			countData.arrivaled += data[i].arrivaled;
			countData.impressions += data[i].impressions;
			countData.click += data[i].click;
			list.push(json);
		}
		countData['arrivaledRate'] = ((countData.arrivaled/countData.sent) * 100 || 0).toFixed(2) + '%';
		countData['impressionsRate'] = ((countData.impressions/countData.arrivaled) * 100 || 0).toFixed(2) + '%';
		countData['clickRate'] = ((countData.click/countData.arrivaled) * 100 || 0).toFixed(2) + '%';
		list.push(countData);
		return list;
	}

	//将echarts所需数据整理保存
	formatEchartsData(data: any) {
		let that = this;
		let length = data.length;
		that.chartList = {
			series: []
		};
		for(let i = 0; i < length; i++) {
			let name = '';
			if (i === 0) {
				name = '方案A';
			} else if (i === 1) {
				name = '方案B';
			} else if (i === 2) {
				name = '方案C';
			}
			let tempData = that.formatChartsData(data[i]);
			let series = {
				smooth: true,
				name: name,
				type: 'line',
				data: tempData.data
			};
			//series.name即图例的name 
			series.name = name + '-' + that.formatName;
			if (that.isOne) {
				series.name = that.formatName;
			}
			that.chartList.series.push(series);
			if (!that.chartList['xdata'] || that.chartList['xdata'].length < tempData.xdata.length) {
				that.chartList['xdata'] = tempData.xdata;
			}
			that.legend.push({
				name: name,
				icon: 'circle'
			});
		}
	}

	//处理数据 将数据转换成echarts需要数据
	formatChartsData(data: any) {
		let that = this;
		let dataList = [];
		let xData = [];
		for (let i in data) {
			xData.push(that.formatDate(i));
			dataList.push(data[i]);
		}
		if (dataList.length < that.statRange) {
			let lastTime = xData[xData.length - 1];
			if (!lastTime) {
				lastTime = that.formatDate(that.cycleSelect);
			}
			let length = that.statRange - dataList.length;
			for (let j = 0; j < length; j++) {
				xData.push(that.getLastTime(lastTime));
				dataList.push(0);
				lastTime = xData[xData.length - 1];
			}
		}
		let json = {
			data: dataList,
			xdata: xData
		}
		return json;
	}

	//获取1小时后的时间
	getLastTime(time: string) {
		let that = this;
		if (that.cycleSelect == 'all') {
			return '第' + (+time + 1) + '小时内';
		}
		let hour = parseInt(time.slice(-2)) + 1;
		let lastTime = '';
		if (that.statRange == 48) {
			hour = hour + 1;
			if (hour < 10) {
				lastTime = time.slice(0, -2) + '0' + hour;
			} else if (hour < 24) {
				lastTime = time.slice(0, -2) + hour;
			} else if (hour == 24) {
				let date = parseInt(time.slice(-5, -3));
				lastTime = time.slice(0, -5) + (date + 1) + ' 00';
			} else {
				let date = parseInt(time.slice(-5, -3));
				lastTime = time.slice(0, -5) + (date + 1) + ' 01';
			}
		} else {
			if (hour < 10) {
				lastTime = time.slice(0, -2) + '0' + hour;
			} else if(hour < 24) {
				lastTime = time.slice(0, -2) + hour;
			} else {
				let date = parseInt(time.slice(-5, -3));
				lastTime = time.slice(0, -5) + (date + 1) + ' 00';
			}
		}
		return lastTime;
	}

	//切换折线图显示数据
	onclick(data: any){
		let that = this;
		that.selectButton = data.type;
		that.formatName = data.name;
		if (!that.cycleSelect) {
			that.getEChartsData(data.type, that.statRange);
		} else if (that.cycleSelect != 'all') {
			that.getEChartsData(data.type, that.statRange, that.cycleSelect);
		} else {
			that.getAllPushPromotionData();
		}
    };

	//处理数据变成趋势分析表格需要数据
	formatDataToTable(series: any, xdata: any) {
		let that = this;
		let length = series.length;
		that.tableHeaders = [];
		that.tableList = [];
		that.tableHeaders = that.tableHeaderDefualt.concat([]);
		for (let i = 0; i < length; i++) {
			that.tableHeaders.push({field: 'number' + i, header: series[i].name});
			let data = series[i].data;
			let dataLength = data.length;
			for (let j = 0; j < dataLength; j++) {
				let json = {};
				if (i === 0) {
					json['number' + i] = data[j];
					json['time'] = xdata[j] + ':00';
					that.tableList.push(json);
				} else {
					that.tableList[j]['number' + i] = data[j];
				}
			}
		}
	} 

	//格式化后端传来的时间字符串
	formatDate( time: string ){
		if (this.cycleSelect == 'all') {
			return '第' + time + '小时内';
		}
		let dateString = time.slice(0, 4) + '-' + time.slice(4, 6) + '-' + time.slice(6, 8) + ' ' + time.slice(8, 10);
		return dateString;
    };

	//根据选择的时间获取图表数据
	getStatistic() {
		let that = this;
		// console.log('===>>>>', that.cycleSelect);
		if(!that.cycleSelect) {
			//下载数据参数
			that.downloadJson = Object.assign({}, that.downloadJson, {
				statRange: that.statRange,
			});
			that.getEChartsData(that.selectButton, that.statRange);
	 	} else if (that.cycleSelect != 'all') {
			//下载数据参数
			that.downloadJson = Object.assign({}, that.downloadJson, {
				statRange: that.statRange,
				time: that.cycleSelect
			});
			that.getEChartsData(that.selectButton, that.statRange, that.cycleSelect);
		} else {
			that.getAllPushPromotionData();
		}
	};

	//获取最新/最早数据
	getPromotionData(type: string) {
		let that = this;
		let time: any;
		if (type === 'all') {
			if(that.cycleTimeList.length > 7) {
				that.showTimeList = that.cycleTimeList.slice(0, 7);
				that.rightButton = true;
				that.leftButton = false;
			} else {
				that.showTimeList = that.cycleTimeList;
			}
			that.getAllPushPromotionData();
		} else if (type === 'end') {
			time = that.cycleTimeList[that.cycleTimeList.length - 1];
			if(that.cycleTimeList.length > 7) {
				that.showTimeList = that.cycleTimeList.slice(-7);
				that.leftButton = true;
				that.rightButton = false;
			} else {
				that.showTimeList = that.cycleTimeList;
			}
			that.getPushPromotionData(time);
		}
	}

	//获取循环数据所有数据
	getAllPushPromotionData() {
		let that = this;
		that.downloadJson = {
			type: 'segment',
			segmentId: that.segmentId,
			all: 1,
			statRange: that.statRange
		}
		that.cycleSelect = 'all';
		that.pushReachReports.getTableList(that.segmentId, {all: 1})
		.then(data => {
			if (data && (data.msgDes || data.retCode)) {
				that.error(data);
				return;
			}
			that.conts = that.collatingData(data);
			let json = {
				segmentId: that.segmentId,
				tp: that.selectButton,
				hours: that.statRange,
				all: 1
			};
			return that.pushReachReports.getTrendList(json);
		}).then(data => {
			if (data && (data.msgDes || data.retCode)) {
				that.error(data);
				return;
			}
			that.formatEchartsData(data);
			that.series = that.chartList.series;
			that.xdata = that.chartList.xdata;
			that.formatDataToTable(that.series, that.xdata);
		}).catch(err => {});
	}

	//循环时间轴向前/向后查看
	getCycleTimeList(type: string) {
		let that = this;
		if(type === 'left') {
			if(!that.leftButton) {
				return;
			}
			let index = that.cycleTimeList.indexOf(that.showTimeList[0]);
			if (index < 7) {
				that.showTimeList = that.cycleTimeList.slice(0, 7);
			} else {
				that.showTimeList = that.cycleTimeList.slice(index - 7, index);
			}
		} else if (type === 'right')  {
			if (!that.rightButton) {
				return;
			}
			let index = that.cycleTimeList.indexOf(that.showTimeList[that.showTimeList.length - 1]);
			let length = that.cycleTimeList.length;
			if (length - index < 8) {   //length为数组实际长度 index从0开始计算 所以要大于8
				that.showTimeList = that.cycleTimeList.slice(-7);
			} else {
				that.showTimeList = that.cycleTimeList.slice(index + 1, index + 8);
			}
		}
		if (that.showTimeList[0] === that.cycleTimeList[0]) {
			that.leftButton = false;
		} else {
			that.leftButton = true;
		}
		if (that.showTimeList[that.showTimeList.length - 1] === that.cycleTimeList[that.cycleTimeList.length - 1]) {
			that.rightButton = false;
		} else {
			that.rightButton = true;
		}
	}

	//对后端传来时间进行排序
	sortTime(timeList: any){
		let length = timeList.length;
		for(let i = 0; i < length; i++) {
			for (let j = 0; j < length - i; j++) {
				if (timeList[j] > timeList[j + 1]) {
					let temp = timeList[j];
					timeList[j] = timeList[j + 1];
					timeList[j + 1] = temp;
				}
			}
		}
		return timeList;
	}
	
	//处理报错信息
	error(err: any) {
		let that = this;
		let data = that.errorHandlingService.getMsg(err);
		if (!that.isDialogReport) {
			that.msgs.push({severity:'error', summary:'错误', detail: data.message});
		} else {
			that.errorMessage.emit(data.message);
		}
	}
}