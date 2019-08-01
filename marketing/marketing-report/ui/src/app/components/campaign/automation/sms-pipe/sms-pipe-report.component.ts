import { Component, Input } from '@angular/core';
import { UtilesService } from '../../../../common/utiles.service';
import {
	SliderModule,
	ButtonModule,
	Message,
	SelectItem
} from 'primeng/primeng';

import { SmsReachReportResourceService } from '../../../../services/report/sms_reach_report.resource.service';
import { PushReachReports } from '../../../../services/report/push_reach_reports.resource.service';

@Component({
    selector: 'sms-pipe-report',
    templateUrl: 'sms-pipe-report.component.html',
    styleUrls: ['sms-pipe-report.component.css'],
    providers: [SmsReachReportResourceService, PushReachReports]
})
export class SmsPipeReportComponent {
    @Input() campaignId: number;
    @Input() pipeLineId: number;
    @Input() nodeData: any;

    utiles: UtilesService;

    promotionOverview:any={};   //投放概览数据
    promotionStatisticName: any = [];   //趋势分析按钮数组对象  name:按钮的名称；type:按钮对应接口返回的英文字段； showField:接口返回数组里要展示的字段名
    constant: any;    //渲染图表时需要的字段名和中文的对应
    exportErrorLogUrl: string = '';//导出错误日志的链接地址
	exportSuccessLogUrl: string = '';//导出成功日志的链接地址

    cycleTimeList: any = [];  //循环时间数组
	showTimeList: any = []; //显示的循环时间
	leftButton: boolean = false; //循环左边按钮是否可点击
	rightButton: boolean = false; //循环右边按钮是否可点击
	cycleSelect: string = "";
    selectButton: string;//选中的趋势分析里的按钮
	formatName: string;//按钮上显示的文案
    showField: string;//展示的字段
    selectedGranularity: string = 'h';//选中的时间粒度
    timeGranularitys: SelectItem[] = [];//时间粒度
    barShow:boolean = false;
    chartShow:boolean = true;
    
    downloadJson: any = {};

    xdata:any[]; 
    series:any[];
    cols:any[] = [{field: 'time', header: '时间'}];
	colList: any[];
    conts:any[];

    hours:number = 24;//默认24小时（gina说的。）
    
    //echarts 浮层回调
	chartsFn: any = function(params: any) {
		let time = params[0].name;
		let res = '<p><span style="width: 65px;display: inline-block;font-size: 14px;">' + params[0]['seriesName'] + '：</span><span style="color:#5ba0ff;float: right;">' + params[0]['value'] + '</span></p>';
		res += '<p><span style="width: 65px;display: inline-block;font-size: 14px;">日期：</span><span style="color:#5ba0ff;">' + time + '</span></p>';
		return res;
	}

    constructor(
        public smsReachReportResourceService: SmsReachReportResourceService
    ) {
        let that = this;
        that.utiles = new UtilesService();
        that.promotionStatisticName = [
            {type:'totalSuccCount',name:'发送成功数',id:0,showField:'succCount'},
            {type:'totalClickLinkCount',name:'点击链接数',id:1,showField:'clickLinkCount'},
        ];
        that.constant = {
            succCount:{
                name: '发送成功数'
            },
            clickLinkCount:{
                name: '点击链接数'
            },
        };
        that.selectButton = "totalSuccCount";
        that.formatName = '发送成功数';
        that.showField = that.promotionStatisticName[0]['showField'];
        that.timeGranularitys = [
			{label: '小时', value: 'h'},
			{label: '天', value: 'd'},
		];
    }

    ngOnInit() {
        let that = this;
        //TODO 导出日志
        that.exportSuccessLogUrl = `${that.smsReachReportResourceService.baseUrl}/${that.smsReachReportResourceService.getRouter}/report/detail/${that.pipeLineId}/${that.nodeData.id}/success/download`;
        that.exportErrorLogUrl = `${that.smsReachReportResourceService.baseUrl}/${that.smsReachReportResourceService.getRouter}/report/detail/${that.pipeLineId}/${that.nodeData.id}/fail/download`;
        if (that.nodeData.triggerType < 3) {
            that.resetDownloadJson("");
            that.getOverviewAndTrend("");
        } else {
            that.smsReachReportResourceService.getPipeLineTimeAxis(that.pipeLineId, that.nodeData.id)
            .then((data: any) => {
                if (data && data.retCode) {
                    that.error(data.msgDes);
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
                that.resetDownloadJson(lasterTime);
                that.getOverviewAndTrend(lasterTime);
            }).catch();
        }
    }

    /**
     * 获取某天的短信报告数据
     * @param lastTime 
     */
    getOverviewAndTrend(lastTime?: any) {
        let that = this;
        let json = {
            granularity: that.selectedGranularity
        };
        if (lastTime) {
            json['statisticsDate'] = lastTime;
        }
        that.smsReachReportResourceService.getPipeLineLaunchTrend(that.pipeLineId, that.nodeData.id, json)
        .then((data: any) => {
            if (data && data.retCode) {
                that.error(data);
                return;
            }
            that.promotionOverview = data;
            that.formatterReportData(data.smsReachReports,that.showField);
        });
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
				xchart += ' ' + data[i]['reportHour'] + ":00";
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
    
    /**
     * 处理数据变成趋势分析表格需要数据
     * @param series 
     * @param xdata 
     */
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
    
    /**
     * 对后端传来时间进行排序
     * @param timeList 
     */
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
    
    /**
     * 导出成功的投放日志
     */
    exportSuccessLog() {
        let that = this;
        that.smsReachReportResourceService.downloadByUrl(that.exportSuccessLogUrl).then(data => {
            window.location.href = that.exportSuccessLogUrl;
        }).catch(err => {
            if (err && err.status == '404') {
                that.error(err._body);
            } else if (err && err.status == '405') {
                that.error(err._body || '参数不正确');
            } else {
                that.error(err);
            }
        })
    }

     /**
     * 导出错误的投放日志
     */
    exportErrorLog() {
        let that = this;
        that.smsReachReportResourceService.downloadByUrl(that.exportErrorLogUrl).then(data => {
            window.location.href = that.exportErrorLogUrl;
        }).catch(err => {
            if (err && err.status == '404') {
                that.error(err._body);
            } else if (err && err.status == '405') {
                that.error(err._body || '参数不正确');
            } else {
                that.error(err);
            }
        })
    }

    /**
     * 切换折线图显示数据
     * @param statistic 
     */
	onclick(statistic: any){
		let that = this;
    	that.selectButton = statistic.type;
		that.formatName  = statistic.name;
		that.showField  = statistic.showField;
    	that.formatterReportData(that.promotionOverview.smsReachReports,statistic.showField);
    }
    
    /**
     * 切换时间粒度后 获取数据
     * @param event 
     */
    changeGranularity(event: any){
		let that = this;
        that.getOverviewAndTrend(that.cycleSelect);
        that.resetDownloadJson(that.cycleSelect);
    }
    
    //获取最新/最早数据
	getPromotionData(type: string) {
		let that = this;
		let time: any;
		if (type === 'all') {
            that.cycleSelect = type;
            that.resetDownloadJson('');
			if(that.cycleTimeList.length > 7) {
				that.showTimeList = that.cycleTimeList.slice(0, 7);
				that.rightButton = true;
				that.leftButton = false;
			} else {
				that.showTimeList = that.cycleTimeList;
			}
			that.getOverviewAndTrend("");
		} else if (type === 'end') {
			time = that.cycleTimeList[that.cycleTimeList.length - 1];
            that.cycleSelect = time;
            that.resetDownloadJson(time);
			if(that.cycleTimeList.length > 7) {
				that.showTimeList = that.cycleTimeList.slice(-7);
				that.leftButton = true;
				that.rightButton = false;
			} else {
				that.showTimeList = that.cycleTimeList;
			}
			that.getOverviewAndTrend(time);
		}
    }
    
	//点击时间轴上的时间获取概览
	getPromotionDataByTime(time: any){
		let that = this;
        that.cycleSelect = time;
        that.resetDownloadJson(time);
		that.getOverviewAndTrend(time);
    }

    /**
     * 循环时间轴向前/向后查看
     * @param type 
     */
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
    
    //切换图显示和表显示
	onChart(change:boolean){
    	this.chartShow = true;
    	this.barShow = false;
    };
    onBar(change:boolean){
    	this.chartShow = false;
    	this.barShow = true;
    }
    
    //处理页面的百分比
	processPercent(precent: string){
		return parseFloat(precent) > 100? "100%" : precent;
	}

    /**
     * 错误处理 TODO 为实现
     * @param data 
     */
    error(data: any) {
        console.log('===>>>', data);
    }

    //重新设置下载的参数
	resetDownloadJson(time: any){
		let that = this;
		that.downloadJson = {
			type: 'pipeLine',
            pipeLineId: that.pipeLineId,
            pipeLineNodeId: that.nodeData.id,
			hours:  that.hours,
			time: time,
			granularity: that.selectedGranularity
		};
	}
}