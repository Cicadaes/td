import { ChannelDefinitionResourceService } from './../../../../../../../../services/admin/channel_definition.resource.service';
import { Message } from 'primeng/primeng';
import { Component } from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import { SegmentCommunicationService } from './../../../../../../../../services/communication/segment.communication.service';
import { CampaignDetailExceptionalCommunication } from "../../../../../../../../services/exceptional/campaign-detail-exceptional.service";
import { UtilesService } from '../../../../../../../../common/utiles.service';

@Component({
	selector: 'edm-push',
	templateUrl: 'edm-push.component.html',
	styleUrls: ['edm-push.component.css'],
	providers: [ChannelDefinitionResourceService,UtilesService]
})
//邮件投放
export class EdmPushComponent {

	channels: SelectItem[] = [];//投放渠道
	selectedChannel: string;//选中的投放渠道
	dateRange: any;//时间间隔（投放时间组件使用）
	msgs: Message[] = [];//错误提示

	promotionEdm :any = {};//edm投放
	contentType: string = "1";//邮件内容类型

	constructor(
		private segmentCommunicationService: SegmentCommunicationService,
		private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication,
		private channelDefinitionResourceService: ChannelDefinitionResourceService,
		private utiles: UtilesService
	){
		let that = this;
		if (segmentCommunicationService.startDate && segmentCommunicationService.endDate) {
            that.dateRange = {
                startDate: segmentCommunicationService.startDate,
                endDate: segmentCommunicationService.endDate
            };
        }
		that.promotionEdm = segmentCommunicationService.edmSegmentInfo;
		
		if(!that.promotionEdm.contentType){
			that.promotionEdm.contentType = "1";
		}
		if(segmentCommunicationService.isUpdate == 2){
			that.initPromotion(that.promotionEdm);
		}
	};

	ngOnInit(){
		let that = this;
		that.getChannelList();
	}
    //发件人邮箱校验
	checkEdmail(promotionEdm: any){
			let that = this;
			if(!that.promotionEdm["fromAddress"] || !that.utiles.isEmail(that.promotionEdm["fromAddress"])){
			that.segmentCommunicationService.isError['fromAddress'] = true;
		}else{
			that.segmentCommunicationService.isError['fromAddress'] = false;
		}
	}
	//关闭为选择渠道时的错误提示
	changeChannel(){
		let that = this;
		that.segmentCommunicationService.isError['channelCode'] = false;
	}

	//初始化投放 （编辑或新增切换push和短信时）
	initPromotion(data: any){
		let that = this;
		that.promotionEdm['name'] = data.name;
		that.promotionEdm.fileName = "";
	}

	//获取渠道信息
	getChannelList(){
		let that = this;
		let channelType = 3;//和后端约定，channelType为3是查询邮件投放渠道
		that.channelDefinitionResourceService.getChanelList(channelType).then((res:any)=>{
			if(res.data){
				let data = res.data;
				for(let i=0;i<data.length;i++){
					that.channels.push({label:data[i].name, value:data[i].code});
				}
				//设置默认渠道
				if(data.length > 0 && !that.promotionEdm['channelCode']){
					that.promotionEdm['channelCode'] = data[0]['code'];
				}
			}
		});
	}

	//选择邮件内容的类型
	choosContentType(value: any){
		let that = this;
		if(that.segmentCommunicationService.isUpdate === 0){
			return ;
		}
		that.promotionEdm.contentType = value;
	}

	//判断上传文件的后缀
    checkFileName(fileName:string){
		if(fileName){
			let tp = fileName.substr(fileName.length-4,4);
			if(tp.toUpperCase() == 'HTML'){
				return true;
			}
		}
		return false;
	}

    //选择文件时触发
    selectFile(event: any){
        let that = this;
		that.segmentCommunicationService.isError['fileName'] = false;
        if(that.checkFileName(event.target.value)){
			let infos = event.target.value.split('\\');
			let bin = event.target.files[0];
			let formData = new FormData();
			formData.append("uploadFiles",bin);
			that.channelDefinitionResourceService.uploadFile(formData).then(data => {
				if (data && data._body) {
					data = JSON.parse(data._body);
				}
				if (data && (data.retCode || data.msgDes)) {
					that.campaignDetailExceptionalCommunication.exceptionalMission(data);
					return;
				}
				that.promotionEdm.fileName = infos[infos.length - 1];
				that.promotionEdm.uploadUUID = data.uploadUUID;
			}).catch(err => {});
		}else{
			that.campaignDetailExceptionalCommunication.exceptionalMission("上传的文件格式不正确");
		}
    }

	//清除上传的文件
	clearFile(){
		let that = this;
		if(that.segmentCommunicationService.isUpdate === 0){
			return ;
		}
		that.promotionEdm.fileName = "";
		that.promotionEdm.uploadUUID = "";
	}

}