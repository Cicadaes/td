import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
	SliderModule,
	ButtonModule,
	Message,
	SelectItem
} from 'primeng/primeng';
import { SegmentResourceService } from "../../../../services/campaign/segment.resource.service";
import { SegmentTaskCalcObjectRecordResourceService } from "../../../../services/campaign/segment_task_calc_object_record.resource.service";
import { EffectService } from "../../../../services/report/effect.communication.service";
import { SmsReachReportResourceService } from "../../../../services/report/sms_reach_report.resource.service";
import { PushReachReports } from '../../../../services/report/push_reach_reports.resource.service';
import { BasePromotionReport } from '../base-promotion-report';
@Component({
	selector: 'sms-promotion-report',
	templateUrl: 'sms-promotion-report.component.html',
	styleUrls: ['sms-promotion-report.component.css'],
	providers: [SegmentResourceService, SegmentTaskCalcObjectRecordResourceService, EffectService,SmsReachReportResourceService, PushReachReports]
})
export class SmsPromotionReportComponent extends BasePromotionReport{
	@Input() set inPromotionId(insegmentId:any){
		this.segmentId = insegmentId;
	}
	@Input() set isDialog(isDialog:any){
		this.isDialogReport = isDialog;
	}
	//如果是弹框需要将错误信息传递到外层
	@Output() errorMessage = new EventEmitter<any>();
	
	isDialogReport: boolean = false;  //是否是弹框显示
	promotionOverview:any={};
	effectList: any = [];
	channel: number = 2;//channel =1 代表push， channel=2 代表短信 channel=3 代表邮件
	constructor(
		private acivatedRoute: ActivatedRoute,
		private segmentResourceService: SegmentResourceService,
		private segmentTaskCalcObjectRecordResourceService: SegmentTaskCalcObjectRecordResourceService,
		private effectService: EffectService,
		private smsReachReportResourceService: SmsReachReportResourceService,
		private pushReachReports: PushReachReports
		){
			super();
			let that = this;
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
		}
	
	ngOnInit(){
		let that = this;
		if(!this.segmentId){//从投放列表页进入的，segmentId挂在了链接上
			that.segmentId = that.acivatedRoute.params['value'].id;
		};
		that.exportSuccessLogUrl = that.buildExportLogUrl(that.smsReachReportResourceService.baseUrl, that.smsReachReportResourceService.queryRouter, that.segmentId, 'success');
        that.exportErrorLogUrl = that.buildExportLogUrl(that.smsReachReportResourceService.baseUrl, that.smsReachReportResourceService.queryRouter, that.segmentId, 'fail');
		// 获取投放名称
		that.smsReachReportResourceService.get(that.segmentId).then(data => {
			that.promotionName = data.name;
			that.campaignId = data.campaignId;
			// 获取投放概览
			let json = {
				campaignId: that.campaignId,
            	segments: [that.segmentId]
			}
			//（bestseller隐藏）
			that.smsReachReportResourceService.getEffectOverview(json).then((data:any)=>{
				if (data && data.retCode) {
					if (that.isDialogReport) {
						that.errorMessage.emit(data);
						return;
					}
					that.error(data.msgDes);
					return;
				}
				that.effectList = data;
			}).catch(err => {
				if (that.isDialogReport) {
					that.errorMessage.emit(err);
					return;
				}
				that.error(err);
			});
			if(data.triggerType < 3) {
				that.resetDownloadJson("");
				that.getOverviewAndTrend("");
			} else {
				that.smsReachReportResourceService.getTimeAxis(that.segmentId).then((data) => {
					if (data && data.retCode) {
						if (that.isDialogReport) {
							that.errorMessage.emit(data);
							return;
						}
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
				}).catch(err => {
					if (that.isDialogReport) {
						that.errorMessage.emit(err);
						return;
					}
				});
			}
		});
	};
    exportSuccessLog() {
        let that = this;
        that.effectService.downloadByUrl(that.exportSuccessLogUrl).then(data => {
            window.location.href = that.exportSuccessLogUrl;
        }).catch(err => {
			let error = '';
            if (err && err.status == '404') {
				error = err._body;
            } else if (err && err.status == '405') {
				error = err._body || '参数不正确';
            } else {
				error = err;
			}
			if (that.isDialogReport) {
				that.errorMessage.emit(error);
				return;
			} else {
				that.error(error);
			}
        })
    }
    exportErrorLog() {
        let that = this;
        that.effectService.downloadByUrl(that.exportErrorLogUrl).then(data => {
            window.location.href = that.exportErrorLogUrl;
        }).catch(err => {
            let error = '';
            if (err && err.status == '404') {
				error = err._body;
            } else if (err && err.status == '405') {
				error = err._body || '参数不正确';
            } else {
				error = err;
			}
			if (that.isDialogReport) {
				that.errorMessage.emit(error);
				return;
			} else {
				that.error(error);
			}
        })
    }
	//获取投放概览和趋势分析
	getOverviewAndTrend(lastTime: any){
		let that = this;
		that.smsReachReportResourceService.getLaunchTrend(that.segmentId,lastTime,that.selectedGranularity).then(data => {
			if (data && data.retCode) {
				if (that.isDialogReport) {
					that.errorMessage.emit(data);
					return;
				}
				that.error(data.msgDes);
				return;
			}
			that.promotionOverview = data;
			that.formatterReportData(data.smsReachReports,that.showField);
		}).catch(err => {})
	}
	//切换折线图显示数据
	onclick(statistic: any){
		let that = this;
    	that.selectButton = statistic.type;
		that.formatName  = statistic.name;
		that.showField  = statistic.showField;
    	that.formatterReportData(that.promotionOverview.smsReachReports,statistic.showField);
	}
	changeGranularity(event: any){
		let that = this;
		if(that.downloadJson['granularity'] != event.value){
			that.getOverviewAndTrend(that.cycleSelect);
			that.resetDownloadJson(that.cycleSelect);
		}
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
}