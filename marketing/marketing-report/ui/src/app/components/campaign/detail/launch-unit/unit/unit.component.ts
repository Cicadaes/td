import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ConfirmationService } from "primeng/components/common/api";
import { CampaignDetailDataCommunication } from "../../../../../services/communication/campaign-detail-data.communication.service";
import { CampaignDetailExceptionalCommunication } from "../../../../../services/exceptional/campaign-detail-exceptional.service";
import { UnitDataCommunicationService } from "../../../../../services/communication/unit-data.communication.service";
import { CreateSegmentCommunicationService } from "../../../../../services/communication/create-segment.communication.service";
import { CampaignLaunchUnitResourceService } from "../../../../../services/campaign/campaign_launch_unit.resource.service";
import * as moment from 'moment';
import { SegmentResourceService } from "../../../../../services/campaign/segment.resource.service";

@Component({
	selector: 'unit',
	templateUrl: 'unit.component.html',
	styleUrls: ['unit.component.css'],
	providers: [ConfirmationService, CampaignLaunchUnitResourceService, UnitDataCommunicationService]
})

export class UnitComponent {

    @Input() 
    set launchUnitData (data: any) {
        let that = this;
        that.unitDataCommunicationService.crowdVersion = data.crowdVersion;
        that.unitDataCommunicationService.crowdId = data.crowdId;
        that.unitDataCommunicationService.crowdType = data.crowdType;
        that.unitDataCommunicationService.calcStatus = data.crowdStatus;
        if(data.crowdStatus == 2 && moment(data.crowdUpdateTime).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD')){
            that.updatedTime = true;
        }
        //投放单元数据
        that.launchUnit = data;
        let list = data.segmentList;
        let length = list.length || 0;
        if (data && data.crowdStatus == 2) {
            that.unitDataCommunicationService.isCreatePush = true;
            if (that.campaignDetailDataCommunication.userRight !== 'marketing_ADMIN') {
                that.unitDataCommunicationService.isCreatePush = false;
            }
        }
        if (data && data.crowdStatus == 1) {
            that.isRecountCrowd = false;
            if(!that.tempPoll) {
                that.tempPoll = setInterval(function () {
                    that.pollGetCrowd(data);
                }, 10000);
            }
        } else if (data && data.crowdStatus == 0) {
            that.isRecountCrowd = false;
        } else if (length === 0) {
            that.isRecountCrowd = true;
        } else {
            for(let i = 0; i < length; i++) {
                if(list[i].crowdStatus != 1) {
                    that.isRecountCrowd = false;
                    break;
                } else {
                    if(i == length - 1){
                        that.isRecountCrowd = true;
                    }
                }
            }
        }
        if (length > 0) {
            that.unitDataCommunicationService.isShowChildList = true;
        } else {
            that.unitDataCommunicationService.isShowChildList = false;
        }
        if (data.crowdType == 2) {
            that.unitDataCommunicationService.isSceneCrowd = true;
        }
        that.unitDataCommunicationService.segmentListLength = length;
    }

    @Output() delDeliUnit = new EventEmitter<number>();    //删除投放单元的ID

    launchUnit:any;

    showPreciseCrowdDialog:boolean =false;  //精准人群弹框

    showLookalikeCrowdDialog: boolean = false; //ifram lookalike人群和场景人群弹框

    dialogData: any = {};

    tableViewIndex: number = 0;

    isRecountCrowd: boolean = false; //是否可以刷新（重新计算人群）

    acceptLabel: string = '确认删除'; //删除弹框按钮默认显示

    tempPoll: any;

    updatedTime: boolean = false;//当日已经更新人群

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication,
		private confirmationService: ConfirmationService,
		private campaignDetailDataCommunication: CampaignDetailDataCommunication,
        private campaignLaunchUnitResourceService: CampaignLaunchUnitResourceService,
        private unitDataCommunicationService: UnitDataCommunicationService,
        private createSegmentCommunicationService: CreateSegmentCommunicationService,
        private segmentResourceService: SegmentResourceService
    ){
         let that = this;
        createSegmentCommunicationService.missionUpdateTable$.subscribe(data => {
            if (data) {
                that.segmentResourceService.query({campaignLaunchUnitId: that.launchUnit.id}).then((data: any) => {
                    if (data && (data.retCode || data.msgDes)) {
                        that.campaignDetailExceptionalCommunication.exceptionalMission(data);
                        return;
                    }
                    that.launchUnit.segmentList = data;
                    that.unitDataCommunicationService.segmentListLength = that.launchUnit.segmentList.length;
                    if(data.length > 0) {
                        that.unitDataCommunicationService.isCreatePush = true;
                        that.unitDataCommunicationService.isShowChildList = true;
                        if (that.campaignDetailDataCommunication.userRight !== 'marketing_ADMIN') {
                            that.unitDataCommunicationService.isCreatePush = false;
                        }
                    } else {
                        that.unitDataCommunicationService.isShowChildList = false;
                    }
                }).catch(err => {})
            }
        });
    }

    //删除投放单元
    delLaunchUnit(index:number){
        let that = this;
        that.acceptLabel = '确认删除';
        that.confirmationService.confirm({
            message: '该删除行为不可逆,是否继续删除此单元 ?',
            header: '删除此单元', 
            accept: () => {
                this.delDeliUnit.emit(index);     
            }
        });
    }

    hidePreciseCrowdDialog(show:boolean){
        this.showPreciseCrowdDialog = show;
    }

    //判断是否需要更新当前投放单元数据
    isUpdatePreciesCrowd(bl: boolean) {
        let that = this;
        if (bl) {
            that.get();
        }
    }

    hideLookalikeCrowdDialog(show: boolean) {
        let that = this;
        that.showLookalikeCrowdDialog = show;
    }

    //获取当前投放单元数据
    get() {
        let that = this;
        if (that.launchUnit.id) {
            that.campaignLaunchUnitResourceService.getUnitDetail(that.launchUnit.id).then(result => {
                if (result && (result.retCode || result.msgDes)) {
                    that.campaignDetailExceptionalCommunication.exceptionalMission(result);
                    return;
                }
                that.launchUnit = result;
                if (result.crowdStatus == 2 && moment(result.crowdUpdateTime).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD')) {
                    that.updatedTime = true;
                }
                if (result.segmentList.length > 0) {
                    that.unitDataCommunicationService.isShowChildList = true;
                } else {
                    that.unitDataCommunicationService.isShowChildList = false;
                }
            }).catch(err => {
                that.campaignDetailExceptionalCommunication.exceptionalMission(err);
            })
        }
    }

    //编辑投放单元
    updateCrowd(){
        let that = this;
        if (that.launchUnit.crowdType == 3 || that.launchUnit.crowdType == 4) {
            that.showPreciseCrowdDialog = !that.showPreciseCrowdDialog;
        } else if (that.launchUnit.crowdType == 1) {
            that.dialogData = Object.assign({}, {
                tp: 'lookalike',
                crowdId: that.launchUnit.crowdId,
                crowdType: that.launchUnit.crowdType
            });
            that.showLookalikeCrowdDialog = !that.showLookalikeCrowdDialog;
        } else if (that.launchUnit.crowdType == 2) {
            that.dialogData = Object.assign({}, {
                tp: 'scene',
                crowdId: that.launchUnit.crowdId,
                crowdType: that.launchUnit.crowdType
            });
            that.showLookalikeCrowdDialog = !that.showLookalikeCrowdDialog;
        }
    }

    changeTabView(event: any) {
        let that = this;
        that.tableViewIndex = event.index;
    }

    recountCrowd() {
        let that = this;
        that.acceptLabel = '确认更新';
        that.confirmationService.confirm({
            message: '人群更新过程可能耗时较长，请确认是否要更新人群',
            header: '更新人群', 
            accept: () => {
                that.campaignLaunchUnitResourceService.recountUnit(that.launchUnit.id).then(data => {
                    if (data && (data.retCode || data.msgDes)) {
                        that.campaignDetailExceptionalCommunication.exceptionalMission(data);
                        return;
                    }
                    if (!that.tempPoll) {
                        that.launchUnit.crowdStatus = data;
                        that.tempPoll = setInterval(function () {
                            that.pollGetCrowd(that.launchUnit);
                        }, 10000);
                    }
                }).catch(err => {
                    if (!that.tempPoll) {
                        that.tempPoll = setInterval(function () {
                            that.pollGetCrowd(that.launchUnit);
                        }, 10000);
                    }
                });
            }
        });
    }

    //循环获取人群信息 当人群计算完成结束
    pollGetCrowd(data: any) {
        let that = this;
        if (!that.tempPoll) {
            that.tempPoll = setInterval(function () {
                that.pollGetCrowd(that.launchUnit)
            }, 10000);
        }
        if (!data) {
            clearInterval(that.tempPoll);
            that.tempPoll = null;
            return ;
        }
        if (!data.crowdStatus) {
            return;
        }
        if (data.crowdStatus === 1) {
            that.campaignLaunchUnitResourceService.getUnitDetail(data.id).then(data => {
                if (data.crowdStatus === 2) {
                    that.unitDataCommunicationService.crowdId = data.crowdId;
                    that.unitDataCommunicationService.crowdVersion = data.crowdVersion;//计算完成后，将人群版本重新赋值。
                    that.unitDataCommunicationService.crowdType = data.crowdType;
                    that.launchUnit.crowdStatus = data.crowdStatus;
                    that.launchUnit.adEstimatedSize = data.adEstimatedSize;
                    that.launchUnit.pushEstimatedSize = data.pushEstimatedSize;
                    that.launchUnit.estimatedSize = data.estimatedSize;
                    that.launchUnit.smsEstimatedSize = data.smsEstimatedSize;
                    that.launchUnit.crowdUpdateTime = data.crowdUpdateTime;
                    that.isRecountCrowd = true;
                    that.unitDataCommunicationService.isCreatePush = true;
                    clearInterval(that.tempPoll);
                    that.tempPoll = null;
                } else if (data.crowdStatus !== 1) {
                    that.launchUnit.crowdStatus = data.crowdStatus;
                    that.isRecountCrowd = false;
                    that.unitDataCommunicationService.isCreatePush = false;
                    clearInterval(that.tempPoll);
                    that.tempPoll = null;
                } else {
                    that.launchUnit.crowdStatus = data.crowdStatus;
                    that.isRecountCrowd = false;
                    that.unitDataCommunicationService.isCreatePush = false;
                }
                if (that.campaignDetailDataCommunication.userRight !== 'marketing_ADMIN') {
                    that.unitDataCommunicationService.isCreatePush = false;
                }
            }).catch(err => {
                clearInterval(that.tempPoll);
                that.tempPoll = null;
            })
        } else if (data.crowdStatus === 2) {
            that.launchUnit.crowdStatus = data.crowdStatus;
            that.launchUnit.adEstimatedSize = data.adEstimatedSize;
            that.launchUnit.pushEstimatedSize = data.pushEstimatedSize;
            that.launchUnit.estimatedSize = data.estimatedSize;
            that.launchUnit.smsEstimatedSize= data.smsEstimatedSize;
            that.isRecountCrowd = true;
            that.unitDataCommunicationService.isCreatePush = true;
            clearInterval(that.tempPoll);
            that.tempPoll = null;
        } else if (data.crowdStatus == 0) {
            that.launchUnit.crowdStatus = data.crowdStatus;
            clearInterval(that.tempPoll);
            that.tempPoll = null;
            that.isRecountCrowd = true;
            that.unitDataCommunicationService.isCreatePush = true;
        } else if (data.crowdStatus < 0) {
            that.launchUnit.crowdStatus = data.crowdStatus;
            clearInterval(that.tempPoll);
            that.tempPoll = null;
            that.isRecountCrowd = false;
            that.unitDataCommunicationService.isCreatePush = false;
        }
        if (that.campaignDetailDataCommunication.userRight !== 'marketing_ADMIN') {
            that.unitDataCommunicationService.isCreatePush = false;
        }
    }


    changeCreatePush(event: boolean) {
        let that = this;
        that.unitDataCommunicationService.isCreatePush = event;
    }

    personas(crowdId :any,crowdVersion :any,name: any) {
        let that = this;
        let id = that.route.params['value'].id;
        let url = '/marketing/' + id + '/personas';
        this.router.navigate([url, {crowdId: crowdId, crowdVersion: crowdVersion, name: name}]);
    }

    ngOnDestroy() {
        let that = this;
        if (that.tempPoll) {
            clearInterval(that.tempPoll);
            that.tempPoll = null;
        }
    }
}