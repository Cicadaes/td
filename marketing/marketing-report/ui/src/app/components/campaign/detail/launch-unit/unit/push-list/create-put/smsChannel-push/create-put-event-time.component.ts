import {Component, Input} from '@angular/core';
import {ButtonModule,
		SelectItem,
		CalendarModule,
		RadioButtonModule
} from 'primeng/primeng';
import * as moment from 'moment';
import { SegmentCommunicationService } from "../../../../../../../../services/communication/segment.communication.service";
import { CampaignDetailDataCommunication } from "../../../../../../../../services/communication/campaign-detail-data.communication.service";
import { UtilesService } from '../../../../../../../../common/utiles.service';

@Component({
	selector: 'create-put-event-time',
	templateUrl: 'create-put-event-time.component.html',
	styleUrls: ['create-put-event-time.component.css'],
	providers: []
})

export class CreatePutEventTimeComponent {

	@Input() 
	set promotion (data: any) {
		this.segment = data;
		if (data.appointedTime) {
			this.selectedHous = moment(data.appointedTime).hours();
			this.selectedMins = moment(data.appointedTime).minutes();
			this.sendTime = new Date((moment(data.appointedTime).startOf('day')).toString());
		}
		if (data.triggerType && (data.triggerType == 3 || data.triggerType == 4 || data.triggerType == 5)) {
			this.selectedLoop = true;
		} else {
			this.selectedLoop = false;
		}
		if (this.segmentCommunicationService.isSceneCrowd && !this.segment["triggerType"]) {
			this.segment["triggerType"] = 2;
		}
	}
	
	@Input() 
	set dateRange (data: any) {
		let that = this;
		if (data && data.startDate && data.endDate) {
			that.minDate = data.startDate;
			that.maxDate = data.endDate;
		}
	}

	@Input() hideLoop: boolean;//隐藏循环推送；（目前邮箱没有循环推送）

	sendChoice: string = 'now';

	onChoice(choice:string) {
		this.sendChoice = choice;
		
	};
	segment:any;
	minDate: Date;
	maxDate: Date;
	period: SelectItem[];
	outlineTime: SelectItem[];
	week: SelectItem[];
	month: SelectItem[];
	hours: SelectItem[];
	minutes: SelectItem[];
	groupList: SelectItem[];
	selectedPeriod: string;
	selectedOutlineTime: string;
	selectedLoop: boolean = false;
	selectedHous: number = 0;
	selectedMins: number = 0;
	sendTime: any;
	time: any; //循环时选择的时间
	nowTime: any = Date.now();   //当前时间 用于判断活动是否开始

	constructor(
		private segmentCommunicationService: SegmentCommunicationService,
		private campaignDetailDataCommunication: CampaignDetailDataCommunication,
        private utilesService: UtilesService
	){
		this.groupList = [
			{label: '每天上午10点', value: 10},
			{label: '每天下午2点', value: 14},
			{label: '每天下午6点', value: 18}
		];
		this.period = [
            // {label:'每分钟', value: 1},
            // {label:'每小时', value: 2},
			{label:'每天', value: 3},
			{label:'每周', value: 4},
			{label:'每月', value: 5}
		];
		this.outlineTime = [
			{label:'4小时', value: null},
			{label:'8小时', value: null},
			{label:'1天', value: null},
			{label:'2天', value: null}
		];
		this.week = [
			{label:'星期一', value: 1},
			{label:'星期二', value: 2},
			{label:'星期三', value: 3},
			{label:'星期四', value: 4},
			{label:'星期五', value: 5},
			{label:'星期六', value: 6},
			{label:'星期日', value: 7},
		];
		
		this.month = [];
		for (let i = 1; i < 32; i++) {
			this.month.push({label: i+'号', value: i});
		};
		this.month.push({label: '最后一天', value: 'last'});
		this.hours = [];
		for (let i = 0;i < 24; i++) {
			this.hours.push({label: i+'时', value: i});
		}
		this.minutes = [];
		for (let i = 0; i < 60; i++) {
			this.minutes.push({label: i+'分', value: i});
		}
	};

	ngOnInit() {
		let that = this;
		if (that.segment.triggerType == 3 || that.segment.triggerType == 4 ||that.segment.triggerType == 5) {
			that.selectedLoop = true;

            let loopDate;
            if (that.segment.cronExpression) {
                loopDate = that.utilesService.transformToObj(that.segment.cronExpression);
            } else {
                loopDate = {};
            }
            that.segment.cycleVal = loopDate['cycleVal'] ? loopDate['cycleVal'] : 1;
            that.segment.cycleHour = loopDate['cycleHour'] ? loopDate['cycleHour'] : 0;
            that.segment.cycleMinute = loopDate['cycleMinute'] ? loopDate['cycleMinute'] : 0;
		}
		if (that.segment.triggerType != 3 && that.segmentCommunicationService.isSceneCrowd && (that.segmentCommunicationService.segmentListLength === 0)) {
			that.segment.triggerType = 3;
			that.segment.subTriggerType = 3;
			that.segment.cycleHour = 10;
			that.segment.cycleMinute = 0;
		}
		//设置时间
		let today = new Date();
		let day = today.getDate();
        let month = today.getMonth();
		let year = today.getFullYear();
		if (that.campaignDetailDataCommunication.campaignData.startTime > that.nowTime) {
			let time = new Date(that.campaignDetailDataCommunication.campaignData.startTime);
			day = time.getDate();
			month = time.getMonth();
			year = time.getFullYear();
		}
		let maxTime = new Date(that.campaignDetailDataCommunication.campaignData.endTime);
		let maxDay = maxTime.getDate();
		let maxMonth = maxTime.getMonth();
		let maxYear = maxTime.getFullYear();
		this.minDate = new Date();
		this.maxDate = new Date();
		this.minDate.setFullYear(year, month, day);
		this.maxDate.setFullYear(maxYear, maxMonth, maxDay);
	}

	ngOnChanges() {
		let that = this;
		if (that.campaignDetailDataCommunication.campaignData.startTime > that.nowTime) {   //当前时间小于活动开始时间  不能选择立即发送(默认选中定时推送)
			that.segment['triggerType'] = '2';
		} else if (!that.segment['triggerType']) {
			that.segment['triggerType'] = '1';
		}
	}

	exLoop(event: any){
		//console.log(event);
		this.segment.triggerType = event.target.value;
		this.selectedLoop = false;
	}

	changeTime(type: string) {
		let that = this;
		that.segmentCommunicationService.isError['sendTime'] = null;
		if (that.sendTime) {
			that.segment.appointedTime = moment(that.sendTime).add(+that.selectedHous, 'hours').add(+that.selectedMins, 'minutes').valueOf();
		}
	}

	sLoop(event: any) {
		let that = this;
		if (event.value == 3) {
			that.segment.cycleHour = 0;
			that.segment.cycleMinute = 0;
		} else {
			that.segment.cycleVal = 1;
			that.segment.cycleHour = 0;
			that.segment.cycleMinute = 0;
		}
	}

	//场景人群新建投放 投放发送时间选择
	selectTime(event: any) {
		let that = this;
		let temp = event.value;
		that.segment.triggerType = 3;
		that.segment.subTriggerType = 3;
		if (temp === 10) {
			that.segment.cycleHour = 10;
			that.segment.cycleMinute = 0;
		} else if (temp === 14) {
			that.segment.cycleHour = 14;
			that.segment.cycleMinute = 0;
		} else if (temp === 18) {
			that.segment.cycleHour = 18;
			that.segment.cycleMinute = 0;
		}
	}

	selectCycle() {
		let that = this;
		that.segment.triggerType = 3;
	}
}