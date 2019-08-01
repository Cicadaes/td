import { Component } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { SegmentCommunicationService } from "../../../../../../../../services/communication/segment.communication.service";
import { CreateSegmentAppCommunicationService } from "../../../../../../../../services/communication/create-segment-app.communication.service";
import { SegmentResourceService } from "../../../../../../../../services/campaign/segment.resource.service";
import { AppConfResourceService } from "../../../../../../../../services/campaign/app_conf.resource.service";
import { CampaignDetailExceptionalCommunication } from "../../../../../../../../services/exceptional/campaign-detail-exceptional.service";

@Component({
	selector: 'app-push-message',
	templateUrl: 'app-push-message.component.html',
	styleUrls: ['app-push-message.component.css'],
	providers: [SegmentResourceService, AppConfResourceService]
	/*providers: [CreateSegmentAppCommunicationService, SegmentResourceService,  AppConfResourceService]*/
})

export class AppPushMessageComponent {
	selectPhoneClass: Boolean = true;

	pushAppList: SelectItem[] = [];

    pushData: any;

	selectPieceList: any[] = [];

	promotionPushReq: {};

	pieceIndex:number = 0;

	content:string = '';

	appList: any = [];     //存放获取到的app列表

	showIndex: number = null; //错误时展示哪个AB

	constructor(
		private segmentCommunicationService: SegmentCommunicationService, 
		private createSegmentAppCommunicationService:CreateSegmentAppCommunicationService,
		private segmentResourceService: SegmentResourceService,
		private appConfResourceService: AppConfResourceService,
		private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication
	) {
		let that = this;

        that.selectPieceList.push({index: 0});

        that.promotionPushReq = segmentCommunicationService.segmentInfo;

		that.getAppList();

        if (!that.promotionPushReq['platform']) {
            that.selectPhoneClass = true;
            that.promotionPushReq['platform'] = 'android';
			that.promotionPushReq['androidData'] = [{ratio: 100}];
            that.pushData = that.promotionPushReq['androidData'];
        } else {
            if (that.promotionPushReq['platform'] != 'ios') {
                that.promotionPushReq['platform'] = 'android';
            }
            if (that.promotionPushReq['platform'] == 'android') {
                that.selectPhoneClass = true;
                if (!that.promotionPushReq['androidData']) {
                    that.promotionPushReq['androidData'] = [];
                }
                that.pushData = that.promotionPushReq['androidData'];
            } else {
                that.selectPhoneClass = false;
                if (!that.promotionPushReq['iosData']) {
                    that.promotionPushReq['iosData'] = [];
                }
                that.pushData = that.promotionPushReq['iosData'];
            }

            if (that.pushData.length) {
                for (let i = 1; i < that.pushData.length; i++) {
                    that.selectPieceList.push({index: i});
                }
            } else {
                that.pushData[that.pieceIndex] = {ratio: 100};
            }
        }

		createSegmentAppCommunicationService.missionSelectFlowCount$.subscribe(data => {
            that.pieceIndex = data.index;
            if (that.promotionPushReq['platform'] == 'android') {
                that.pushData = that.promotionPushReq['androidData'];
            } else {
                that.pushData = that.promotionPushReq['iosData'];
            }
            that.pushData[that.pieceIndex] ? '' : that.pushData[that.pieceIndex] = {};
            // let cont = that.promotionPushReq.message[that.pieceIndex].content;
            // that.content = cont.replace(/<\/?.+?>/g,"").replace(/ /g,"");
        });
		createSegmentAppCommunicationService.validationPushPiece$.subscribe(data => {
            that.showIndex = data[0];
        })
	}
	
	select(type: string) {
		let that = this;
		if (that.segmentCommunicationService.isUpdate === 0) {
			return;
		}
		that.promotionPushReq['platform'] = type;
		if (type === 'android') {
			if (!that.selectPhoneClass) {  //判断that.promotionPushReq['platform'] 选择前是否为 ios
				that.pieceIndex = 0;
				that.selectPieceList = [];
                if (that.promotionPushReq['androidData'] && that.promotionPushReq['androidData'].length) {
                    for (let i = 0; i < that.promotionPushReq['androidData'].length; i++) {
                        that.selectPieceList.push({index: i});
                    }
                } else {
                    that.selectPieceList.push({index: 0});
                }
                that.pieceIndex = that.selectPieceList.length-1;
			}
			that.selectPhoneClass = true;
		} else if (type === 'ios') {
			if (that.selectPhoneClass) {   //判断that.promotionPushReq['platform'] 选择前是否为 android
                that.selectPieceList = [];
                if (that.promotionPushReq['iosData'] && that.promotionPushReq['iosData'].length) {
                    for (let i = 0; i < that.promotionPushReq['iosData'].length; i++) {
                        that.selectPieceList.push({index: i});
                    }
                } else {
                    that.selectPieceList.push({index: 0});
                }
                that.pieceIndex = that.selectPieceList.length-1;
			}
			that.selectPhoneClass = false;
		}
	}

	addPiece() {
		let that = this;
		if (this.selectPieceList.length < 3) {
            if (that.promotionPushReq['platform'] === 'android') {
                that.promotionPushReq['androidData'][that.selectPieceList.length] = {};
            } else if (that.promotionPushReq['platform'] === 'ios') {
                that.promotionPushReq['iosData'][that.selectPieceList.length] = {};
            }
            this.selectPieceList.push({index: this.selectPieceList.length});
		}
	}

	deletePiece(index: number) {
		let that = this;
		if (that.selectPieceList.length > 1) {
			let length = that.selectPieceList.length - 1;
			that.selectPieceList = [];
			for (let i = 0; i < length; i++) {
				that.selectPieceList.push({index: i});
			}

			let pushData = that.segmentCommunicationService.segmentInfo;
			if (pushData['platform'] === 'ios') {
                pushData = pushData.iosData;
            } else {
                pushData = pushData.androidData;
            }

            pushData.splice(index, 1);
			if (length == 2) {
                pushData[0].ratio = 95;
                pushData[1].ratio = 5;
			} else {
                pushData[0].ratio = 100;
			}
		}
	}

	getAppList() {
		let that = this;
		that.appConfResourceService.getAppList().then((data: any) => {
			if (data && (data.retCode || data.msgDes)) {
				that.campaignDetailExceptionalCommunication.exceptionalMission(data);
				return;
			}
			if (data) {
				that.appList = data;
				let length = data.length;
				for (let i = 0; i < length; i++) {
					that.pushAppList.push({label: data[i].appName, value: data[i].appId});
				}
				if (!that.promotionPushReq['appid']) {
					that.promotionPushReq['appid'] = data[0].appId;
				}
				that.segmentCommunicationService.pid = (that.promotionPushReq['appid']) ? that.promotionPushReq['appid'] : data[0].productId;
				that.appConfResourceService.getAppByAppId(that.segmentCommunicationService.pid).then((ret: any) => {
					if (ret && (ret.retCode || ret.msgDes)) {
						that.campaignDetailExceptionalCommunication.exceptionalMission(data);
						return;
					}
					if (ret.length) {
						that.segmentCommunicationService.appConf = ret;
					} else {
						that.segmentCommunicationService.appConf = [ret];
					}

					that.createSegmentAppCommunicationService.selectAppMission();
				}).catch(err => {})
			}
		}).catch(err => {})
	}

	changeApp(e: any) {
		let that = this;
		that.appConfResourceService.getAppByAppId(e.value).then((data: any) => {
			if (data && (data.retCode || data.msgDes)) {
				that.campaignDetailExceptionalCommunication.exceptionalMission(data);
				return;
			}
			that.segmentCommunicationService.appConf = [data];
            that.createSegmentAppCommunicationService.selectAppMission();
			for(let i = 0; i < that.appList.length; i++) {
				if (e.value === that.appList[i].appId) {
					that.segmentCommunicationService.pid = that.appList[i].productId;
				}
			}
		}).catch(err => {})
	}
}