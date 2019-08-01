import { TimingPipeComponent } from './../../automation/timing-pipe/timing-pipe.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
	
} from 'primeng/primeng';
import { PushReachReports } from '../../../../services/report/push_reach_reports.resource.service';

@Component({
	selector: 'common-charts-handle',
	templateUrl: 'common-charts-handle.component.html',
	styleUrls: ['common-charts-handle.component.css'],
	providers: [PushReachReports]
})

export class CommonChartsHandleComponent {
	@Input() hideDownload: boolean;
	@Output() onChart = new EventEmitter<boolean>();
	@Output() onBar = new EventEmitter<boolean>();
	@Input()
	set downloadJson(data: any) {
		if(!data) {
			return;
		}
		let that = this;
		// let segmentUrl = `${that.pushReachReports.baseUrl}/${that.pushReachReports.getRouter}/trend/segment/${data.segmentId}/download`;
		// let pipeLineUrl = `${that.pushReachReports.baseUrl}/${that.pushReachReports.getRouter}/trend/segment/${pipelineId}/${pipelineNodeId}/download`;
		if (data.type === 'segment') {
			that.downloadUrl = `${that.pushReachReports.baseUrl}/${that.pushReachReports.getRouter}/trend/${data.segmentId}/download?`;
		} else if (data.type === 'pipeLine') {
			that.downloadUrl = `${that.pushReachReports.baseUrl}/${that.pushReachReports.getRouter}/report/trend/${data.pipeLineId}/${data.pipeLineNodeId}/download?`;
		}
		let queryParam: string = '';
		if (data.statRange) {
			if (queryParam) {
				queryParam = queryParam + '&hours=' + data.statRange;
			} else {
				queryParam = 'hours=' + data.statRange;
			}
		}
		if (data.time) {
			if (queryParam) {
				queryParam = queryParam + '&date=' + data.time;
			} else {
				queryParam = 'date=' + data.TimingPipeComponent;
			}
		}
		if (data.all) {
			if (queryParam) {
				queryParam = queryParam + '&all=' + data.all;
			} else {
				queryParam = 'all=' + data.all;
			}
		}
		//push投放会走上面的data.statRange   sms和edm走这个拼接
		if (data.hours) {
			if (queryParam) {
				queryParam = queryParam + '&hours=' + data.hours;
			} else {
				queryParam = 'hours=' + data.hours;
			}
		}
		if (data.granularity) {
			if (queryParam) {
				queryParam = queryParam + '&granularity=' + data.granularity;
			} else {
				queryParam = 'granularity=' + data.granularity;
			}
		}
		if (data.statisticsDate) {
			if (queryParam) {
				queryParam = queryParam + '&statisticsDate=' + data.statisticsDate;
			} else {
				queryParam = 'statisticsDate=' + data.statisticsDate;
			}
		}
		that.downloadUrl = that.downloadUrl + queryParam;
	}
	downloadUrl: string;
	isChart:boolean = true;
	isBar:boolean = false;
	constructor(
		public pushReachReports: PushReachReports
	){
	};
	ngOnInit() {
        
        
	};
	downLoad(){
	};
	getChart(change:boolean){
		this.onChart.emit(change);
		this.isChart = true;
		this.isBar = false;
	};
	getBar(change:boolean){
		this.onBar.emit(change);
		this.isChart = false;
		this.isBar = true;
	}
	
}