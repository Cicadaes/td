import { Message, SelectItem } from "primeng/primeng";
import { UtilesService } from "../../../common/utiles.service";
export abstract class BasePromotionReport {
	msgs: Message[] = [];
	//趋势分析按钮数组对象  name:按钮的名称；type:按钮对应接口返回的英文字段； showField:接口返回数组里要展示的字段名；
	promotionStatisticName: any = [];
	//渲染图表时需要的字段名和中文的对应；
	constant: any;
	exportErrorLogUrl: string = '';//导出错误日志的链接地址
	exportSuccessLogUrl: string = '';//导出成功日志的链接地址
	campaignId: number;
	segmentId: number;
	promotionName: string = '';
	downloadJson: any = {};
	barShow:boolean = false;
	chartShow:boolean = true;
	cycleTimeList: any = [];  //循环时间数组
	showTimeList: any = []; //显示的循环时间
	leftButton: boolean = false; //循环左边按钮是否可点击
	rightButton: boolean = false; //循环右边按钮是否可点击
	cycleSelect: string = "";
	selectButton: string;//选中的趋势分析里的按钮
	formatName: string;//按钮上显示的文案
	showField: string;//展示的字段
	xdata:any[]; 
	series:any[];
	cols:any[] = [{field: 'time', header: '时间'}];
	colList: any[];
	conts:any[];
	timeGranularitys: SelectItem[] = [];//时间粒度
	selectedGranularity: string = 'h';//选中的时间粒度
	//echarts 浮层回调
	chartsFn: any = function(params: any) {
		let time = params[0].name;
		let res = '<p><span style="width: 65px;display: inline-block;font-size: 14px;">' + params[0]['seriesName'] + '：</span><span style="color:#5ba0ff;float: right;">' + params[0]['value'] + '</span></p>';
		res += '<p><span style="width: 65px;display: inline-block;font-size: 14px;">日期：</span><span style="color:#5ba0ff;">' + time + '</span></p>';
		return res;
	}
	utiles: UtilesService;
	hours:number = 24;//默认24小时（gina说的。）
	constructor(){
		let that = this;
		that.utiles = new UtilesService();
		that.timeGranularitys = [
			{label: '小时', value: 'h'},
			{label: '天', value: 'd'},
		];
	}
	// //获取最新/最早数据
	// abstract getPromotionData(type: string): void;
	// //点击时间轴上的时间获取概览
	// abstract getPromotionDataByTime(time: any): void;
	//构建导出日志的url
	buildExportLogUrl(baseUrl: string, routerUrl: string, segmentId: number, type: string){
		return `${baseUrl}/${routerUrl}/report/detail/${segmentId}/${type}/download`;
	}
    //处理页面的百分比
	processPercent(precent: string){
		return parseFloat(precent) > 100? "100%" : precent;
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
	//切换图显示和表显示
	onChart(change:boolean){
    	this.chartShow = true;
    	this.barShow = false;
    };
    onBar(change:boolean){
    	this.chartShow = false;
    	this.barShow = true;
	}
	
	//获取1小时后的时间
	getLastTime(time: string) {
		if (!time) return; 
		let hour = parseInt(time.slice(-2)) + 1;
		let lastTime = '';
		if (hour < 10) {
			lastTime = time.slice(0, -2) + '0' + hour;
		} else if(hour < 24) {
			lastTime = time.slice(0, -2) + hour;
		} else {
			let date = parseInt(time.slice(-5, -3));
			lastTime = time.slice(0, -5) + (date + 1) + ' 00';
		}
		return lastTime;
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
	/**
	 * 处理报表数据
	 * data:处理的报表data数据
	 * type:取哪一字段的值
	 */
	formatterReportData(data: any,type: string){
		let that = this;
		let xTemp = [];
		let yTemp = [];
		let yData = [];
		for(let i=0; i<data.length; i++){
			let xchart = that.utiles.formatterDate(data[i]['reportDate']);
			if(that.selectedGranularity == 'h'){
				// if(data[i].reportHour){
				xchart += ' ' + data[i]['reportHour'] + ":00";
				// }
			}
			xTemp.push(xchart);
			yData.push(data[i][type] || 0);
		}
		let serie = {
			smooth: true,
			name: that.constant[type].name,
			type: 'line',
			data: yData
		};
		yTemp.push(serie);
		that.xdata = xTemp;
		that.series = yTemp;
		that.formatDataToTable(that.series,that.xdata);
	}
	//处理数据变成趋势分析表格需要数据
	formatDataToTable(series: any, xdata: any) {
		let that = this;
		let length = series.length;
		that.colList = [];
		that.conts = [];
		that.colList = that.cols.concat([]);
		for (let i = 0; i < length; i++) {
			that.colList.push({field: 'number' + i, header: series[i].name});
			let data = series[i].data;
			let dataLength = data.length;
			for (let j = 0; j < dataLength; j++) {
				let json = {};
				if (i === 0) {
					json['number' + i] = data[j] || 0;
					json['time'] = xdata[j];
					that.conts.push(json);
				} else {
					that.conts[j]['number' + i] = data[j] || 0;
				}
			}
		}
	}
	//重新设置下载的参数
	resetDownloadJson(time: any){
		let that = this;
		that.downloadJson = {
			type: 'segment',
			segmentId: that.segmentId,
			hours:  that.hours,
			time: time,
			granularity: that.selectedGranularity
		};
	}
	//错误处理
	error(data: any) {
		let that = this;
		that.msgs = [];
        that.msgs.push({severity: 'error', summary: '错误', detail: data});
	}
}