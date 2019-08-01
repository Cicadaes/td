import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
	SliderModule,
	ButtonModule,
	Message
} from 'primeng/primeng';
import { SegmentResourceService } from './../../../../services/campaign/segment.resource.service';
import { EdmPromotionService } from './../../../../services/report/edm-promotion.communication.service';
import { EffectService } from './../../../../services/report/effect.communication.service';
import { BasePromotionReport } from '../base-promotion-report';
@Component({
	selector: 'edm-promotion-report',
	templateUrl: 'edm-promotion-report.component.html',
	styleUrls: ['edm-promotion-report.component.css'],
	providers: [SegmentResourceService,EffectService,EdmPromotionService]
})
export class EdmPromotionReportComponent extends BasePromotionReport{
	@Input() set inPromotionId(insegmentId:any){
		this.segmentId = insegmentId;
	}
	promotionOverview: any = {};
	effectList: any = [];
	channel: number = 3;//channel =1 代表push， channel=2 代表短信 channel=3 代表邮件
	
	constructor(
		private acivatedRoute: ActivatedRoute,
		private segmentResourceService: SegmentResourceService,
		private effectService: EffectService,
		private edmPromotionService: EdmPromotionService
		){
			super();
			let that = this;
			that.promotionStatisticName = [
				{type:'totalSuccCount',name:'发送成功次数',id:1,showField:'succCount'},
				{type:'totalReadCount',name:'打开邮件次数',id:0,showField:'readCount'},
				{type:'totalClickLinkCount',name:'点击链接人数',id:2,showField:'clickLinkCount'}
			]
			that.constant = {
				succCount:{
					name: '发送成功次数'
				},
				readCount:{
					name: '打开邮件人数'
				},
				clickLinkCount:{
					name: '点击链接人数'
				}
			};
			that.selectButton = "totalSuccCount";
			that.formatName = '发送成功次数';
			that.showField = that.promotionStatisticName[0]['showField'];
	}
	ngOnInit(){
		let that = this;
		if(!this.segmentId){//从投放列表页进入的，segmentId挂在了链接上
			that.segmentId = that.acivatedRoute.params['value'].id;
		}
		that.exportSuccessLogUrl = that.buildExportLogUrl(that.edmPromotionService.baseUrl, that.edmPromotionService.queryRouter, that.segmentId, 'success');
		that.exportErrorLogUrl = that.buildExportLogUrl(that.edmPromotionService.baseUrl, that.edmPromotionService.queryRouter, that.segmentId, 'fail');
		that.segmentResourceService.get(that.segmentId).then(data=>{
			that.campaignId = data.campaignId;
			that.promotionName = data.name;
			let effectParam = {
				campaignId: that.campaignId,
				segments: [that.segmentId]
			}
			//获取总体概览 （bestseller隐藏）
			// that.effectService.getEffectOverview(effectParam).then(data=>{
			// 	if (data && data.retCode) {
			// 		that.error(data.msgDes);
			// 		return;
			// 	}
			// 	that.effectList = data;
			// }).catch(err =>{})
			if(data.triggerType < 3){
				that.resetDownloadJson("");
				that.getOverviewAndTrend("");
			}else {
				that.edmPromotionService.getTimeline(that.segmentId).then(data =>{
					if (data && data.retCode) {
						that.error(data.msgDes);
						return;
					}
					that.cycleTimeList = that.sortTime(data);
					let lasterTime = that.cycleTimeList[that.cycleTimeList.length - 1]? that.cycleTimeList[that.cycleTimeList.length - 1]:'';
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
				})
			}
		}).catch(err =>{})
	};
    exportSuccessLog() {
        let that = this;
        that.effectService.downloadByUrl(that.exportSuccessLogUrl).then(data => {
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
    exportErrorLog() {
        let that = this;
        that.effectService.downloadByUrl(that.exportErrorLogUrl).then(data => {
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
	//获取投放概览和趋势分析
	getOverviewAndTrend(lastTime: any){
		let that = this;
		that.edmPromotionService.getOverviewAndTrend(that.segmentId,lastTime,that.selectedGranularity).then(data => {
			if (data && data.retCode) {
				that.error(data.msgDes);
				return;
			}
			that.promotionOverview = data;
			that.formatterReportData(data.edmReachReports,that.showField);
		}).catch(err => {})
	}
	onclick(statistic: any){
		let that = this;
    	that.selectButton = statistic.type;
		that.formatName  = statistic.name;
		that.showField  = statistic.showField;
		that.formatterReportData(that.promotionOverview.edmReachReports,statistic.showField);
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