import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SegmentCommunicationService } from "../../../../../../../../../services/communication/segment.communication.service";
import { AppConfResourceService } from "../../../../../../../../../services/campaign/app_conf.resource.service";
import { CampaignDetailExceptionalCommunication } from "../../../../../../../../../services/exceptional/campaign-detail-exceptional.service";
// import {AppConfigService} from "../../../../../services/marketing/create-put/app-config.communication.service";

@Component({
	selector: 'android-intensify-push-config',
	templateUrl: 'intensify-push-config.component.html',
	styleUrls: ['intensify-push-config.component.css'],
	providers:[
		// AppConfigService
	]
})

export class AndroidIntensifyPushConfigComponent {
	des: any = {};  //绑定后的提示文字

	error: any = {}; //错误

	private show: boolean;

	@Input()
	set showAndroidIntensifyDailog(bl:boolean){
		this.show = bl;
	}

	@Output() hideAndroidIntensifyDailog = new EventEmitter<boolean>();

	//绑定配置时选择的app TODO:值
	@Input() app:string;

	appConfReq:any;

	appConf:any = {};

	constructor(
		private segmentCommunicationService: SegmentCommunicationService,
		private appConfResourceService: AppConfResourceService,
		private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication
	) {
		let that = this;
		if(segmentCommunicationService.appConf && segmentCommunicationService.appConf.length>0){
			that.appConf = segmentCommunicationService.appConf[0];
		}
		// Object.assign(that.appConfs,segmentCommunicationService.appConf);
	}

	ngOnInit(){}

	bindXm() {
		//channel：1：小米  2华为 3个推  4极光
		let channel = 1;
		if (!this.appConf.xmApp) {
			this.error['xm'] = 'appId';
			return;
		}
		if (!this.appConf.xmSecret) {
			this.error['xm'] = 'secret';
			return;
		}
		this.transDataToReq(channel, this.appConf.xmApp, this.appConf.xmSecret);
	}

	bindHw() {
		let channel = 2;
		if (!this.appConf.hwApp) {
			this.error['hw'] = 'appId';
			return;
		}
		if (!this.appConf.hwSecret) {
			this.error['hw'] = 'secret';
			return;
		}
		this.transDataToReq(channel, this.appConf.hwApp, this.appConf.hwSecret);
	}

	transDataToReq(channel:number,app:string,secret:string){
		let that = this;
		let json = {
			app: that.app,
			pid: that.segmentCommunicationService.pid,
			channel: channel,
			thirdApp: app,
			thirdSecret: secret
		}
		that.appConfResourceService.updateApp(json).then((data:any) => {
			if (data && (data.retCode && data.msgDes)) {
				that.campaignDetailExceptionalCommunication.exceptionalMission(data);
				return;
			}
			if (data && data._body === 'success') {
				if (channel === 1) {
					that.des['xm'] = '绑定成功';
					that.des['hw'] = '';
					that.error['xm'] = '';
				} else if (channel === 2) {
					that.des['xm'] = '';
					that.des['hw'] = '绑定成功';
					that.error['hw'] = '';
				}
				that.des['tp'] = true;
			} else if (data && data._body === 'fail') {
				if (channel === 1) {
					that.des['xm'] = '绑定失败';
					that.des['hw'] = ''
				} else if (channel === 2) {
					that.des['xm'] = ''
					that.des['hw'] = '绑定失败';
				}
				that.des['tp'] = false;
			}
		}).catch(err => {})
	}

	afterHide() {
		let that = this;
		that.des['xm'] = '';
		that.error['hw'] = '';
		that.des['hw'] = '';
		that.error['xm'] = '';
		that.appConfResourceService.query({appId: that.appConf.appId})
		.then((data: any) => {
			if (data && (data.retCode && data.msgDes)) {
				that.campaignDetailExceptionalCommunication.exceptionalMission(data);
				return;
			}
			if (data.length) {
				that.segmentCommunicationService.appConf = data;
			} else {
				that.segmentCommunicationService.appConf = [{}];
			}
		}).catch(err => {})
		that.hideAndroidIntensifyDailog.emit(that.show);
	}
}