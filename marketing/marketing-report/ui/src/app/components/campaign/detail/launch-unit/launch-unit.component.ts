import { Component } from '@angular/core';
import { CampaignDetailDataCommunication } from "../../../../services/communication/campaign-detail-data.communication.service";
import { CampaignDetailExceptionalCommunication } from "../../../../services/exceptional/campaign-detail-exceptional.service";
import { CampaignLaunchUnitResourceService } from "../../../../services/campaign/campaign_launch_unit.resource.service";
import { SegmentResourceService } from "../../../../services/campaign/segment.resource.service";
import { ConfirmationService } from 'primeng/components/common/api';
import { ShowCreateSegmentCommunicationService } from "../../../../services/communication/show-create-segment.communication.service";
import { CreateSegmentCommunicationService } from '../../../../services/communication/create-segment.communication.service';
import { SegmentCommunicationService } from '../../../../services/communication/segment.communication.service';

@Component({
	selector: 'launch-unit',
	templateUrl: 'launch-unit.component.html',
	styleUrls: ['launch-unit.component.css'],
	providers: [
		CampaignLaunchUnitResourceService, 
		SegmentResourceService, 
		ConfirmationService, 
		ShowCreateSegmentCommunicationService, 
		CreateSegmentCommunicationService,
		SegmentCommunicationService
	]
})

export class LaunchUnitComponent {
	showCrowdCategoryDialog: boolean = false; //是否显示创建投放单元dialog

	launchUnits:any;   //投放单元列表数据

	acceptLabel:any = "确定";

	showCreatePutDialog: boolean; //是否显示创建投放dialog

	createSegmentData: any = {}; //创建投放数据集合

	unitList: Array<any> = []; //投放单元所有数据

	isMore: boolean = false; //是否有更多数据

	loading: boolean = false; //是否开始获取更多数据

	constructor(
		private confirmationService: ConfirmationService,
		private campaignDetailDataCommunication: CampaignDetailDataCommunication,
		private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication,
		private campaignLaunchUnitResourceService: CampaignLaunchUnitResourceService,
		private segmentResourceService: SegmentResourceService,
		private showCreateSegmentCommunicationService: ShowCreateSegmentCommunicationService,
	) {
		let that = this;
		that.getUnitList();
		that.showCrowdCategoryDialog = false;
		showCreateSegmentCommunicationService.showDialog$.subscribe((data: any) => {
			if (data) {
				that.createSegmentData = data;
				that.showCreatePutDialog = true;
				that.createSegmentData['unitData'] = {
					crowdId: data.unitCrowdId,
					crowdVersion: data.crowdVersion,
					crowdType: data.crowdType,
					segmentListLength: data.segmentListLength,
					isSceneCrowd: data.isSceneCrowd,
					subCrowdId: data.subCrowdId,
					subCrowdName: data.subCrowdName
				};
			}
		});
	}

	getUnitList() {
		let that = this;
		that.campaignLaunchUnitResourceService.getUnitList(that.campaignDetailDataCommunication.campaignId).then(data => {
			if (data && (data.retCode || data.msgDes)) {
				that.campaignDetailExceptionalCommunication.exceptionalMission(data);
				return;
			}
			that.campaignDetailDataCommunication.campaignLaunchUnits = data;
			that.unitList = data;
			if (data.length > 5) {
				that.launchUnits = data.slice(0, 5);
				that.isMore = true;
			} else {
				that.launchUnits = data;
				that.isMore = false;
			}
		}).catch(err => {
			that.campaignDetailExceptionalCommunication.exceptionalMission(err);
		})
	}	


	hideCrowdCateDialog(show:boolean){
        let that = this;
        that.showCrowdCategoryDialog = show;
    }

	updateUnit(show: boolean) {
		let that = this;
		if(show) {
            that.getUnitList();
        }
	}

	delDeliUnit(index:number) {
		let that = this;
        that.campaignLaunchUnitResourceService.remove(index).then(result => {
			if (result && (result.retCode || result.msgDes)) {
				that.campaignDetailExceptionalCommunication.exceptionalMission(result);
				return;
			}
            that.getUnitList();
            //TODO that.msgs.push({severity:'info', summary:'通知', detail:'删除单元成功'});
        }).catch(err => {
            that.campaignDetailExceptionalCommunication.exceptionalMission(err);
        })
	}

	showDialog() {
		let that =this;
		if(that.campaignDetailDataCommunication.campaignTargetConfig && that.campaignDetailDataCommunication.campaignTargetConfig.length > 0){
			that.showCrowdCategoryDialog = !that.showCrowdCategoryDialog;
		}else{
			 that.confirmationService.confirm({
				message: '计划目标没有配置，不能新建投放单元。',
				header: '提示', 
				accept: () => {

				}
			})
		}
	}

	//循环任务
    // segmentTaskList: any = [];
    // circleTask() {
    //     let that = this;
    //     if (that.segmentTaskList && that.segmentTaskList.length) {
    //         for (let i = 0; i < that.segmentTaskList.length; i++) {
	// 			that.segmentResourceService.query(that.segmentTaskList[i].id)
	// 			.then(data => {
	// 				if(data.status) {}
	// 			})
    //         }
    //     }
	// }
	
	//关闭创建投放弹框
	hideCreatePutDialog(bl: boolean) {
		let that = this;
		that.showCreatePutDialog = false;
		that.showCreateSegmentCommunicationService.hideMisson(bl);
	}

	//获取更多数据
	getMoreUnit() {
		let that = this;
		that.launchUnits = that.unitList.slice(0, that.launchUnits.length + 5);
		if (that.launchUnits.length === that.unitList.length) {
			that.isMore = false;
		}
	}
}