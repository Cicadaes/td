import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Router} from "@angular/router";
import { ConfirmationService } from 'primeng/primeng';

import { CampaignDetailExceptionalCommunication } from "../../../../../../services/exceptional/campaign-detail-exceptional.service";
import { CreateSegmentCommunicationService } from "../../../../../../services/communication/create-segment.communication.service";
import { CampaignDetailDataCommunication } from "../../../../../../services/communication/campaign-detail-data.communication.service";
import { SegmentCommunicationService } from "../../../../../../services/communication/segment.communication.service";
import { SegmentResourceService } from "../../../../../../services/campaign/segment.resource.service";
import { UnitDataCommunicationService } from "../../../../../../services/communication/unit-data.communication.service";
import { ShowCreateSegmentCommunicationService } from "../../../../../../services/communication/show-create-segment.communication.service";

import * as moment from 'moment';


@Component({
    selector: 'push-list',
    templateUrl: 'push-list.component.html',
    styleUrls: ['push-list.component.css'],
    providers: [ ConfirmationService, SegmentResourceService ]
})
export class PushListComponent {

    @Input() pushList:any;

    @Input() crowdId: number;

    @Input() unitId: any;

    @Input()
    set unitData(data: any) {
        let that = this;
        that.estimatedSizeMap['1'] = data.pushEstimatedSize;
        that.estimatedSizeMap['2'] = data.smsEstimatedSize;
        that.estimatedSizeMap['3'] = data.edmEstimatedSize;
    }

    @Output() changeCreatePush = new EventEmitter<any>();

    estimatedSizeMap: any = {};

    showCreatePutDialog: boolean = false;

    show: boolean;

    constructor(
        public router: Router,
		private confirmationService: ConfirmationService,
		private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication,
        private createSegmentCommunicationService: CreateSegmentCommunicationService,
		private campaignDetailDataCommunication: CampaignDetailDataCommunication,
		private segmentCommunicationService: SegmentCommunicationService,
		private segmentResourceService: SegmentResourceService,
        private unitDataCommunicationService: UnitDataCommunicationService,
        private showCreateSegmentCommunicationService: ShowCreateSegmentCommunicationService
    ){
        let that = this;
        showCreateSegmentCommunicationService.hide$.subscribe((bl: boolean) => {
            that.showCreatePutDialog = bl;
        })
    }

    //查看投放  isUpdate 判断是编辑还是查看还是新建 0是查看 1是编辑 2是新建
    //showCreatePutDialog = !showCreatePutDialog
    detailPush(push: any, isUpdate: number) {
        let that = this;
        //初始化状态
        that.segmentCommunicationService.isSegmentForSceneSub = false;
        that.segmentCommunicationService.isFirstSegmentForScene = false;
		//暂时不判断是push 还是短信 都默认为push
		that.segmentResourceService.get(push.id).then(result => {
            if (result && (result.retCode || result.msgCode)) {
                that.campaignDetailExceptionalCommunication.exceptionalMission(result);
                return;
            }
            if (push.channelType == 1) {    //渠道类型 1、PUSH 2、SMS 3、EDM 4、Wechat 5、Ad
                that.segmentCommunicationService.smsSegmentInfo = {};//清空
                that.segmentCommunicationService.segmentInfo = that.formatSegmentData(JSON.parse(result.message));
                that.segmentCommunicationService.segmentInfo.id = result.id;

                that.segmentCommunicationService.panelIndex = 0;
            } else if (push.channelType == 2) {//短信
                that.segmentCommunicationService.segmentInfo = {};//清空
                that.segmentCommunicationService.smsSegmentInfo = JSON.parse(result.message);
                that.segmentCommunicationService.smsSegmentInfo["id"] = result.id;
                that.segmentCommunicationService.panelIndex = 1;
            } else if (push.channelType == 3){//邮件
                that.segmentCommunicationService.edmSegmentInfo = JSON.parse(result.message);
                that.segmentCommunicationService.edmSegmentInfo["id"] = result.id;
                that.segmentCommunicationService.panelIndex = 2;
            }

            if (!result.subCrowdName) {
                that.segmentCommunicationService.isFirstSegmentForScene = true;
            } else {
                that.segmentCommunicationService.isSegmentForSceneSub = true;
            }
            that.segmentCommunicationService.isUpdate = isUpdate;
			that.showCreatePutDialog = !that.showCreatePutDialog;
            that.segmentCommunicationService.unitId = result.campaignLaunchUnitId;
            let json: any = {
                crowdId: that.crowdId,
                showCreatePutDialog: that.showCreatePutDialog,
                isSceneCrowd: that.unitDataCommunicationService.isSceneCrowd,
                segmentListLength: that.unitDataCommunicationService.segmentListLength,
                unitCrowdId: that.unitDataCommunicationService.crowdId,
                crowdVersion: that.unitDataCommunicationService.crowdVersion,
                crowdType: that.unitDataCommunicationService.crowdType
            };
            if (result.subCrowdId) {
                json.subCrowdId = result.subCrowdId                ;
                json.subCrowdName = result.subCrowdName;
            }
            that.showCreateSegmentCommunicationService.showDialogMission(json);
		}).catch(err => {
			that.campaignDetailExceptionalCommunication.exceptionalMission(err);
		})
    }

    /* 暂停循环中的推送或将暂停的活动启动  status为4 暂停 status为5 启动 */
    startOrPausePush(push: any, index: number, status: number){
        let that = this;
        that.segmentResourceService.setSegmentsStatus(push.id, status).then(data => {
            if (data && data._body) {
                data = data.json();
                that.campaignDetailExceptionalCommunication.exceptionalMission(data);
                return;
            }
            push.status = status;
			that.pushList[index] = push;
        }).catch(err => {
            that.campaignDetailExceptionalCommunication.exceptionalMission(err);
        })
        // if (push.tp == 1) {
        //     that.pushPromotionService.get(push.id)
        //     .then(result => {
        //         let promotionData = result;
        //         delete promotionData.message;
        //         promotionData.status = status;
        //         that.pushPromotionService.updatePromotionStatus(push.id, promotionData)
        //         .then(data => {
        //             push.status = status;
        //             that.pushList[index] = push;
        //         }).catch(err => {
        //             console.log(err);
        //         });
        //     }).catch(err => {
        //         console.log(err);
        //     });
        // } else if (push.tp == 2) {
        //     that.smsPromotionService.get(push.id)
        //     .then(result => {
        //         let promotionData = result;
        //         promotionData.status = status;
        //         that.smsPromotionService.updatePromotionStatus(push.id, promotionData)
        //         .then(data => {
        //             push.status = status;
        //             that.pushList[index] = push;
        //         }).catch(err => {
        //             console.log(err);
        //         });
        //     }).catch(err => {
        //         console.log(err);
        //     });
        // }
    }

    del(data: any, index: number) {
        //删除投放
        let that = this;
        that.confirmationService.confirm({
            message: '该删除行为不可逆，是否继续删除"' + data.name + '"投放？',
            accept: () => {
				that.segmentResourceService.remove(data.id).then(result => {
                    if (result && (result.retCode || result.msgDes)) {
                        that.campaignDetailExceptionalCommunication.exceptionalMission(result);
                        return;
                    }
                    that.createSegmentCommunicationService.updateTableMission(true);
				}) .catch(err => {
					that.campaignDetailExceptionalCommunication.exceptionalMission(err);
				})
                // if (data.tp == 1) {
                //     that.pushPromotionService.remove(data.id)
                //     .then(result => {
                //         that.segmentResourceService.query({campaignLaunchUnitId :that.unitId})
                //         .then(data => {
                //             that.pushList = data;
                //         }).catch(err => {
                //             console.log('err=>>>', err);
                //         })
                //     }).catch(err => {
                //     });
                // } else if (data.tp == 2) {
                //     that.smsPromotionService.remove(data.id)
                //     .then(result => {
                //         that.segmentResourceService.query({campaignLaunchUnitId :that.unitId})
                //         .then(data => {
                //             that.pushList = data;
                //         }).catch(err => {
                //             console.log('err=>>>', err);
                //         })
                //     }).catch(err => {
                //     });
                // }
            }
        });
    }

    crowdReport(push: any){
        //根据不同的 id, 状态跳转不同的链接
        let that = this;
        let url = '/marketing/' + that.campaignDetailDataCommunication.campaignId;
        if (push.channelType == 1) {
            url += '/pushreport/' + push.id ;
        } else if (push.channelType == 2) {
            url += '/smsreport/' + push.id ;
        } else if(push.channelType == 3){
            url += '/edmreport/' + push.id ;
        }
        this.router.navigate([url]);
    }

    showCreatePut() {
        let that = this;
        that.showCreatePutDialog = !that.showCreatePutDialog;
        that.segmentCommunicationService.isUpdate = 2;
        that.segmentCommunicationService.panelIndex = 0;
        that.segmentCommunicationService.unitId = that.unitId;
        let json = {
            crowdId: that.crowdId,
            showCreatePutDialog: that.showCreatePutDialog,
            isSceneCrowd: that.unitDataCommunicationService.isSceneCrowd,
            segmentListLength: that.unitDataCommunicationService.segmentListLength,
            unitCrowdId: that.unitDataCommunicationService.crowdId,
            crowdVersion: that.unitDataCommunicationService.crowdVersion,
            crowdType: that.unitDataCommunicationService.crowdType
        };
        that.showCreateSegmentCommunicationService.showDialogMission(json);
    }

    //处理投放数据
    formatSegmentData(data: any) {
        if (!data) {
            return data;
        }

        let length = data.iosData && data.iosData.length || 0;
        for (let i = 0; i < length; i++) {
            if (data.iosData[i].action === 0) {
                data.iosData[i].action = true;
            } else {
                data.iosData[i].action = false;
            }
            if (data.iosData[i].timeToLive) {
                data.iosData[i].ttlType = true;
            }
            if (data.iosData[i].extendAttr && data.iosData[i].extendAttr.length) {
                let length = data.iosData[i].extendAttr.length;
                let tempArray: any = [];
                for (let j = 0; j < length; j++) {
                    if (data.iosData[i].extendAttr[j].key) {
                        tempArray.push(data.iosData[i].extendAttr[j]);
                    }
                }
                data.iosData[i].extendAttr = tempArray;
            }
        }

        length = data.androidData && data.androidData.length || 0;
        for (let i = 0; i < length; i++) {
            data.androidData[i].vibrate = !!data.androidData[i].vibrate;
            data.androidData[i].wakeup = !!data.androidData[i].wakeup;
            data.androidData[i].clearable = !data.androidData[i].clearable;
            if (data.androidData[i].action === 0) {
                data.androidData[i].action = true;
            } else {
                data.androidData[i].action = false;
            }
            if (data.androidData[i].timeToLive) {
                data.androidData[i].ttlType = true;
            }
            if (data.androidData[i].extendAttr && data.androidData[i].extendAttr.length) {
                let length = data.androidData[i].extendAttr.length;
                let tempArray: any = [];
                for (let j = 0; j < length; j++) {
                    if (data.androidData[i].extendAttr[j].key) {
                        tempArray.push(data.androidData[i].extendAttr[j]);
                    }
                }
                data.androidData[i].extendAttr = tempArray;
            }
        }

        return data;
    }
}