import {Component, Input, Output, EventEmitter} from '@angular/core';

import {Message} from 'primeng/primeng';
import * as moment from 'moment';
import * as _ from 'lodash';
import { SegmentCommunicationService } from "../../../../../../../services/communication/segment.communication.service";
import { CreateSegmentCommunicationService } from "../../../../../../../services/communication/create-segment.communication.service";
import { SegmentResourceService } from "../../../../../../../services/campaign/segment.resource.service";
import { CampaignDetailDataCommunication } from "../../../../../../../services/communication/campaign-detail-data.communication.service";
import { CampaignDetailExceptionalCommunication } from "../../../../../../../services/exceptional/campaign-detail-exceptional.service";
import { CrowdResourceService } from "../../../../../../../services/campaign/crowd.resource.service";
import { ErrorHandlingService } from "../../../../../../../services/exceptional/error-handling.service";
import { CreateSegmentAppCommunicationService } from './../../../../../../../services/communication/create-segment-app.communication.service';
import { UtilesService } from '../../../../../../../common/utiles.service';


@Component({
	selector: 'create-put-event',
	templateUrl: 'create-put-event.component.html',
	styleUrls: ['create-put-event.component.css'],
	providers: [CrowdResourceService,CreateSegmentAppCommunicationService,UtilesService]
})

export class CreatePutEventComponent {
	private show: boolean; //弹框是否显示

	header: string = '新建投放';  //默认弹框title显示数据

	eventName: string;

	promotionInfo: any;

	isUpdate = 2;

	msgs: Message[] = [];

	panelIndex:number = 0;

	isSubmit: boolean = false; //是否已经点击提交

	cId: number; //人群Id

	segmentNameNotice: string = '请填写投放名称。';

	promotionId: number;//修改时存入

	subVersion: any = "";//子人群版本

	uData: any;  //投放单元数据

	@Input()
    set showCreatePutDialog(bl:boolean){
        this.show = bl;
    }

    @Input() 
	set crowdId(id: number) {
		let that = this;
		if (id) {
			that.cId = id;
			that.crowdResourceService.getQuotes(id).then(data => {
				if(data && (data.retCode || data.msgDes)) {
					that.campaignDetailExceptionalCommunication.exceptionalMission(data);
					return;
				}
				that.segmentCommunicationService.quoteList = data;
			}).catch();
		}
	};

	@Input()
	set subCrowdVersion(version: any) {
		let that = this;
		if (version) {
			that.subVersion = version;
		}
	}

	@Input()
	set unitData(data: any) {
		let that = this;
		if (data) {
			that.segmentCommunicationService.crowdId = data.crowdId;
			that.segmentCommunicationService.crowdType = data.crowdType;
			that.segmentCommunicationService.crowdVersion = data.crowdVersion;
			that.segmentCommunicationService.isSceneCrowd = data.isSceneCrowd;
			that.segmentCommunicationService.segmentListLength = data.segmentListLength;
			if (data.subCrowdId) {
				that.promotionInfo['subCrowdId'] = data.subCrowdId;
				that.promotionInfo['subCrowdName'] = data.subCrowdName;
			}
			that.uData = data;
		}
	}

    @Output() hideCreatePutDialog = new EventEmitter<boolean>();

	autoSubmit: any;//定时器

	intervalTime: number = 1000 * 60 * 3;//三分钟

	isAutoSaved: boolean = false;


	constructor(
		private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication,
		private createSegmentCommunicationService: CreateSegmentCommunicationService,
		private campaignDetailDataCommunication: CampaignDetailDataCommunication,
		private segmentCommunicationService: SegmentCommunicationService,
		private segmentResourceService: SegmentResourceService,
		private crowdResourceService: CrowdResourceService,
		public errorHandlingService: ErrorHandlingService,
		public createSegmentAppCommunicationService: CreateSegmentAppCommunicationService,
		private utiles: UtilesService
	){
		let that = this;
		if (segmentCommunicationService.panelIndex == 0) {
			that.promotionInfo = segmentCommunicationService.segmentInfo;
		} else if (segmentCommunicationService.panelIndex == 1) {
			that.promotionInfo = segmentCommunicationService.smsSegmentInfo;
		} else if (segmentCommunicationService.panelIndex == 2) {
			that.promotionInfo = segmentCommunicationService.edmSegmentInfo;
		}
		if (that.promotionInfo.crowdUpdateType) {
			that.promotionInfo.crowdUpdateType = true;
		} else {
			that.promotionInfo.crowdUpdateType = false;
		}
		that.panelIndex = segmentCommunicationService.panelIndex;
		that.isUpdate = segmentCommunicationService.isUpdate;
		segmentCommunicationService.isError = {};
		if (that.isUpdate == 0) {
			that.header = '查看投放';
		} else if (that.isUpdate == 1) {
			that.header = '修改投放';
			that.promotionId = that.promotionInfo.id;
		} else if (that.isUpdate == 2) {
			that.header = '新建投放';
		}

		let status = that.promotionInfo.status;

		if (that.isUpdate == 2 || that.isUpdate == 1) {
			that.autoSubmit = setInterval(function() {
				if (that.isUpdate == 1 && status == 2) {//编辑投放数据的时候传入2
					that.submit(2,true);//修改时，定时器传的值为2 投放数据
				} else {
					that.submit(1,true); //新建时，定时器传的值为1 草稿
				}
			},that.intervalTime);
		}
	}

	//弹出框消失
	afterDialogHide(){
		let that = this;
        that.hideCreatePutDialog.emit(this.show);
		//关闭弹窗时，清空投放数据。
		that.segmentCommunicationService.resetSegmentInfo();
		that.clearTimer();
    }

	//关闭弹出框
	cancel(){
		let that = this;
		that.show = false;
		that.afterDialogHide();
	}

	//清除定时器
	clearTimer(){
		let that = this;
		if (that.isUpdate == 2 || that.isUpdate == 1) {
			clearInterval(that.autoSubmit);
			that.createSegmentCommunicationService.updateTableMission(true);
		}
	}
	//定位错误位置
	fixErrPos (){
		setTimeout(() => {
			let oWarnTip = document.querySelectorAll('.warn-tip');
			let oPut = document.querySelector('.put-event-cont');
			oPut.scrollTop = (oWarnTip && oWarnTip.length) ? (oWarnTip[0]['offsetTop'] - 45) : 0;
		}, 0);
	}

	/**
	 * 确认提交 
	 * type 1:提交草稿  2:提交(等待开始)
	 * isAutoSub: 自动提交（是自动提交的时候会传该值，不是自动的时候不传）
	 */
	submit(type: number,isAutoSub?: boolean) {
		let that = this;
        let pushData: any;

		if (!isAutoSub) {
            that.isSubmit = true;
        }

		if (!that.promotionInfo.name) {
			that.segmentCommunicationService.isError['name'] = true;
			that.segmentNameNotice = '请填写投放名称。';
			that.isSubmit = false;
			that.fixErrPos();
			return;
		}
		if (that.promotionInfo.name && that.promotionInfo.name.length > 20) {
			that.segmentCommunicationService.isError['name'] = true;
			that.segmentNameNotice = '投放名称不能超过20个字符。';
			that.isSubmit = false;
			that.fixErrPos();
			return;
		}
		if (!that.promotionInfo.appointedTime && that.promotionInfo.triggerType == 2) {
			that.segmentCommunicationService.isError['sendTime'] = '请选择投放日期。';
			that.isSubmit = false;
			that.fixErrPos();
			return;
		}

        //判断提交的是哪个panel
        that.promotionInfo.campaignLaunchUnitId = that.segmentCommunicationService.unitId;
        that.promotionInfo.campaignId = that.campaignDetailDataCommunication.campaignId;

        that.promotionInfo.crowdId = that.promotionInfo.crowdId || that.segmentCommunicationService.crowdId;
        that.promotionInfo.crowdType = that.promotionInfo.crowdType || that.segmentCommunicationService.crowdType;
        that.promotionInfo.crowdVersion = that.promotionInfo.crowdVersion || that.segmentCommunicationService.crowdVersion;

        if (that.isUpdate == 2 && that.subVersion) {
			that.promotionInfo.subCrowdId = that.cId;
			that.promotionInfo['subCrowdName'] = that.segmentCommunicationService.subCrowdName;
            that.promotionInfo['subCrowdVersion'] = that.subVersion;
		}
		if (that.uData.subCrowdId) {
			that.promotionInfo['subCrowdId'] = that.uData.subCrowdId;
			that.promotionInfo['subCrowdName'] = that.uData.subCrowdName;
		}
		if (that.segmentCommunicationService.segmentInfo.platform == 'ios') {
            pushData = that.segmentCommunicationService.segmentInfo.iosData;
        } else {
            pushData = that.segmentCommunicationService.segmentInfo.androidData;
        }
		if (that.panelIndex == 0 && pushData && pushData.length) {      //push校验
			if (!pushData[0].action && type === 2) {
				let length = pushData.length;
				for (let i = 0; i < length; i++) {
					if (that.segmentCommunicationService.segmentInfo.platform === 'android') {
						if (!pushData[i].title) {
							if (that.segmentCommunicationService.isError['title']) {
								if(that.segmentCommunicationService.isError['title'].indexOf(i) === -1) {
									that.segmentCommunicationService.isError['title'].push(i);
								}
							} else {
								that.segmentCommunicationService.isError['title'] = [i];
							}
							document.querySelector('.text_editor_input .text_input_push')['focus']();
						} else {
							if (that.segmentCommunicationService.isError['title']) {
								let tempIndex = that.segmentCommunicationService.isError['title'].indexOf(i);
								if (tempIndex !== -1) {
									that.segmentCommunicationService.isError['title'].splice(tempIndex, 1);
								}
							}
						}
					}
					if (!pushData[i].message) {
						if (that.segmentCommunicationService.isError['content']) {
							if (that.segmentCommunicationService.isError['content'].indexOf(i) === -1) {
								that.segmentCommunicationService.isError['content'].push(i);
							}
						} else {
							that.segmentCommunicationService.isError['content'] = [i];
						}
						let oPut = document.querySelector('.put-event-cont');
						oPut.scrollTop = 400;   //将滚动条滚到底 暴力
					} else {
						if (that.segmentCommunicationService.isError['content']) {
							let tempIndex = that.segmentCommunicationService.isError['content'].indexOf(i);
							if (tempIndex !== -1) {
								that.segmentCommunicationService.isError['content'].splice(tempIndex, 1);
							}
						}
					}
				}
				if (that.segmentCommunicationService.isError['title'] && that.segmentCommunicationService.isError['title'].length > 0) {//没填标题
					that.createSegmentAppCommunicationService.skipPushPieceMission(that.segmentCommunicationService.isError['title']);
					that.isSubmit = false;
					return;
				} else if (that.segmentCommunicationService.isError['content'] && that.segmentCommunicationService.isError['content'].length > 0) {//没填内容
					that.createSegmentAppCommunicationService.skipPushPieceMission(that.segmentCommunicationService.isError['content']);
					that.isSubmit = false;
					return;
				}
			}
		}
		
		if (that.panelIndex == 0) {
			//应用推送创建
			that.promotionInfo.status = type;

            if (that.isUpdate === 2 && !that.isAutoSaved) {
				that.segmentResourceService.create(that.pushDataFormart(that.promotionInfo)).then(data => {
					that.processCreatePushReturn(data,isAutoSub);
				}).catch(err => {
					that.campaignDetailExceptionalCommunication.exceptionalMission(err);
					that.isSubmit = false;
				});
			} else if (that.isUpdate === 1 || that.isAutoSaved) {
				that.segmentResourceService.update(that.pushDataFormart(that.promotionInfo)).then(data => {
					that.processUpdatePushReturn(data,isAutoSub);
				}).catch(err => {
					that.campaignDetailExceptionalCommunication.exceptionalMission(err);
					that.isSubmit = false;
				});
			}
			else{
				that.isSubmit = false;
			}
		} else if (that.panelIndex == 1) {
			that.promotionInfo.status = type; //确认提交根据页面不同的按钮传值 状态为1:草稿 2:等待开始
			// if(that.smsDataFormart(that.promotionInfo)){
			if (that.checkSmsData(that.promotionInfo)){
				if (that.isUpdate === 2  && !that.isAutoSaved){
					that.segmentResourceService.create(that.smsDataFormart(that.promotionInfo)).then((data:any)=>{
						that.processCreatePushReturn(data,isAutoSub);
					}).catch(err => {
						that.campaignDetailExceptionalCommunication.exceptionalMission(err);
						that.isSubmit = false;
					});
				} else if (that.isUpdate === 1 || that.isAutoSaved) {
					that.segmentResourceService.update(that.smsDataFormart(that.promotionInfo)).then(data => {
						that.processUpdatePushReturn(data,isAutoSub);
					}).catch(err => {
						that.campaignDetailExceptionalCommunication.exceptionalMission(err);
						that.isSubmit = false;
					});
				}
			} else {
				that.isSubmit = false;
			}
		}
		else if (that.panelIndex == 2) { //邮件投放
			that.promotionInfo.status = type; //确认提交根据页面不同的按钮传值 状态为1:草稿 2:正常提交
			if (that.checkEdmData(that.promotionInfo)) {
				if (that.isUpdate === 2  && !that.isAutoSaved) {
					that.segmentResourceService.create(that.edmDataFormatter(that.promotionInfo)).then((data:any)=>{
						that.processCreatePushReturn(data, isAutoSub);
					}).catch(err => {
						that.campaignDetailExceptionalCommunication.exceptionalMission(err);
						that.isSubmit = false;
					});
				} else if (that.isUpdate === 1 || that.isAutoSaved) {
					that.segmentResourceService.update(that.edmDataFormatter(that.promotionInfo)).then(data => {
						that.processUpdatePushReturn(data, isAutoSub);
					}).catch(err => {
						that.campaignDetailExceptionalCommunication.exceptionalMission(err);
						that.isSubmit = false;
					});
				}
			} else {
				that.isSubmit = false;
			}
		}
	}

	//处理创建投放后的返回
	processCreatePushReturn(data: any, isAutoSub: boolean){
		let that = this;
		if (data && (data.retCode || data.msgDes)) {
			let error = that.errorHandlingService.getMsg(data);
			if (error.code === 1) {
				that.campaignDetailExceptionalCommunication.exceptionalMission(data);
			} else if (error.code === 2) {
				that.segmentCommunicationService.isError['name'] = true;
				that.segmentNameNotice = error.message;
			}
			that.isSubmit = false;
			return;
		}
		that.promotionInfo['id'] = data.id;
		that.isUpdate = 1;
		that.promotionId = data.id;
		if (!isAutoSub) {
			that.cancel();
			that.isSubmit = false;
		} else {
			that.isAutoSaved = true;
		}
	}
	//处理修改投放后的返回
	processUpdatePushReturn(data: any, isAutoSub: boolean){
		let that = this;
		if (data && data._body) {
			data = JSON.parse(data._body);
		}
		if (data && (data.retCode || data.msgDes)) {
			let error = that.errorHandlingService.getMsg(data);
			if (error.code === 1) {
				that.campaignDetailExceptionalCommunication.exceptionalMission(data);
			} else if (error.code === 2) {
				that.segmentCommunicationService.isError['name'] = true;
				that.segmentNameNotice = error.message;
			}
			that.isSubmit = false;
			return;
		}
		if (!isAutoSub) {
			that.createSegmentCommunicationService.updateTableMission(true);
			that.cancel();
			that.isSubmit = false;
		}
	}

	//校验邮件投放参数
	checkEdmData(edmData:any){
		let that = this;
		if (edmData.status == 1) {
			return true;
		}
		if (!edmData.channelCode) {
			that.segmentCommunicationService.isError['channelCode'] = true;
			return false;
		}
		if (!edmData["title"]) {
			that.segmentCommunicationService.isError['title'] = true;
			return false;
		}
		if (!edmData["fromName"]) {
			that.segmentCommunicationService.isError['fromName'] = true;
			return false;
		}
		if (!edmData["fromAddress"] || !that.utiles.isEmail(edmData["fromAddress"])) {
			that.segmentCommunicationService.isError['fromAddress'] = true;
			return false;
		}
		if (edmData["replyAddress"] && !that.utiles.isEmail(edmData["replyAddress"])) {
			that.segmentCommunicationService.isError['replyAddress'] = true;
			return false;
		}
		if (edmData["contentType"] == 1) {//上传模板方式
			if (!edmData["fileName"]) {
				that.segmentCommunicationService.isError['fileName'] = true;
				return false;
			}
		} else if (edmData["contentType"] == 2) {//原文链接
			if (!edmData["importUrl"] || !that.utiles.isURL(edmData["importUrl"])) {
				that.segmentCommunicationService.isError['importUrl'] = true;
				return false;
			}
		}
		//判断发送类型
		if (edmData.triggerType == 2) {
			if (!this.promotionInfo.appointedTime) {
				return that.campaignDetailExceptionalCommunication.exceptionalMission("请输入定时发送时间");
			}
		}
		return true;
	}

	//校验短信投放参数
	checkSmsData(smsModel:any){
		let that = this;
		if (smsModel.status == 1) {
			return true;
		}
		if (!smsModel.channelCode) {
			that.segmentCommunicationService.isError['channelCode'] = true;
			return false;
		} else if (!smsModel["content"]) {
			that.segmentCommunicationService.isError['content'] = true;
			return false;
		}
		//判断发送类型
		if (smsModel.triggerType == 2) {
			if (!this.promotionInfo.appointedTime) {
				return that.campaignDetailExceptionalCommunication.exceptionalMission("请输入定时发送时间");
			}
		} else if (smsModel.subTriggerType == 3 || smsModel.subTriggerType == 4 || smsModel.subTriggerType == 5) {//判断循环
			if (smsModel.subTriggerType != 3 && !smsModel.cycleVal) {
				return that.campaignDetailExceptionalCommunication.exceptionalMission("请选择循环发送的日期");
			}
			if (!smsModel.cycleHour) {
				return that.campaignDetailExceptionalCommunication.exceptionalMission("请选择循环发送的小时");
			}
		}
		return true;
	}

	//邮件投放数据
	edmDataFormatter(data: any) {
		let that = this;
		let json:any = {};
		json = _.cloneDeep(data);
		if (json.crowdUpdateType) {
			json.crowdUpdateType = 1;
		} else {
            json.crowdUpdateType = 0;
		}
		json["channelType"] = 3;//邮件的channelType
		if (json.triggerType == 3) {
			json.cycleHour = json.cycleHour || 0;
			json.cycleMinute = json.cycleMinute || 0;
			json.cronExpression = that.utiles.transformToCron(json.subTriggerType, json.cycleVal, json.cycleHour, json.cycleMinute);
			delete json['cycleVal'];
			delete json['cycleHour'];
			delete json['cycleMinute'];
		}
		return json;
	}

	//短信投放数据
	smsDataFormart(data: any) {
		let that = this;
		let json:any = {};
		json = _.cloneDeep(data);
		if (json.crowdUpdateType) {
			json.crowdUpdateType = 1;
		} else {
            json.crowdUpdateType = 0;
		}
		json["channelType"] = 2;//短信的channelType
		if (json.triggerType == 3) {
			json.cycleHour = json.cycleHour || 0;
			json.cycleMinute = json.cycleMinute || 0;
			json.cronExpression = that.utiles.transformToCron(json.subTriggerType, json.cycleVal, json.cycleHour, json.cycleMinute);
			delete json['cycleVal'];
			delete json['cycleHour'];
			delete json['cycleMinute'];
		}
		return json;
	}

	//整理push 数据
	pushDataFormart(data: any) {
		let that = this;
        let pushData: any;

		let json = _.cloneDeep(data);

        if (that.isUpdate === 1 || that.isAutoSaved) {      //自动保存后就是修改了
			json.id = data.id;
		}
        json.channelCode = 'tdpush';
        json.status = data.status || 2;
        json.channelType = data.channelType || 1;

		if (data.crowdUpdateType) {
            json.crowdUpdateType = 1;
        } else {
            json.crowdUpdateType = 0;
        }

        if (data.triggerType == 2) {
            delete json.cronExpression;
        } else if (data.triggerType == 3) {
            json.cronExpression = that.utiles.transformToCron(data.subTriggerType, data.cycleVal, data.cycleHour || 0, data.cycleMinute || 0);
            delete json.cycleVal;
            delete json.cycleHour;
            delete json.cycleMinute;
            delete json.appointedTime;
        }

        if (json.platform == 'ios') {
            delete json.androidData;
            pushData = json.iosData;
        } else {
            delete json.iosData;
            pushData = json.androidData;
        }
        let length = pushData && pushData.length || 0;
        for (let i = 0; i < length; i++) {
            if (json.platform == 'android') {
                pushData[i].vibrate ? pushData[i]['vibrate'] = 1 : pushData[i]['vibrate'] = 0;
				pushData[i].wakeup ? pushData[i]['wakeup'] = 1 : pushData[i]['wakeup'] = 0;
				pushData[i].channelCode = "tdpush";    //应用推送的channelCode写死
				// pushData[i].appPushChannelCode = "tdpush";    //应用推送的channelCode写死
                if (pushData[i].clearable) {
                    pushData[i]['clearable'] = 0;
                } else {
                    pushData[i]['clearable'] = 1;
                }
            }

            pushData[i].action ? pushData[i]['action'] = 0 : pushData[i]['action'] = 2;
            pushData[i]['groupOption'] = pushData[i].groupOption || 'A';
            pushData[i]['ratio'] = pushData[i].ratio || 0;
            if (pushData[i].ttlType) {
                pushData[i]['timeToLive'] = +pushData[i].timeToLive || 4;
            } else {
                delete pushData[i]['timeToLive'];
            }
            delete pushData[i].ttlType;
            delete pushData[i].isCustom;
            delete pushData[i].isVibration;

            if (pushData[i].extendAttr && pushData[i].extendAttr.length > 0) {
				let temp = pushData[i].extendAttr.length;
				let tempJson = [];
				for (let j = 0; j < temp; j++) {
				    if (pushData[i].extendAttr[j]['key'] && pushData[i].extendAttr[j]['value']) {
                        tempJson[j] = {key: pushData[i].extendAttr[j]['key'], value: pushData[i].extendAttr[j]['value']};
                    }
                }
                pushData[i]['extendAttr'] = tempJson;
			}
		}
		
		return json;
	}

	toDouble(numb: number){
		return numb < 10 ? '0' + numb : numb;
	}

	handleChange(event:any){
		let that = this;
		that.panelIndex = event.index;
		let name = that.promotionInfo.name;
		if (that.panelIndex == 1) {         //切换为短信
			that.promotionInfo = that.segmentCommunicationService.smsSegmentInfo;
		} else if (that.panelIndex == 0) {  //切换为push
			that.promotionInfo = that.segmentCommunicationService.segmentInfo;
		}else if(that.panelIndex == 2){//切换为邮件
			that.promotionInfo = that.segmentCommunicationService.edmSegmentInfo;
		}
		if (!that.promotionInfo.name) {
			that.promotionInfo.name = name;
		}
		if (that.isUpdate == 1) {
			that.promotionInfo.id = that.promotionId;
		}
	}

	//格式化时间
	formatDate = ( time: any ) => {
		// 格式化日期，获取今天的日期
		const Dates = new Date( time );
		const yy: number = Dates.getFullYear();
		const mm: any = ( Dates.getMonth() + 1 ) < 10 ? '0' + ( Dates.getMonth() + 1 ) : ( Dates.getMonth() + 1 );
		const dd: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
		const hh: any = Dates.getHours() < 10 ? '0' + Dates.getHours() : Dates.getHours();
		const min: any = Dates.getMinutes() < 10 ? '0' + Dates.getMinutes() : Dates.getMinutes();
		return parseInt(''+yy + mm + dd + hh + min);
	};

	showErrorInfo(info:any) {
		this.msgs = [];
		this.msgs.push({severity:'error', summary:'错误', detail: info});
		return false;
	}
	//input输入警告语消失
	inputChange () {
		this.segmentCommunicationService.isError['name'] = false;
	}
}