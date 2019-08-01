import { Message } from 'primeng/primeng';
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IndexSerivice } from "../../../../../../services/campaign/index.service";

import * as moment from 'moment';
import { CampaignLaunchUnitResourceService } from "../../../../../../services/campaign/campaign_launch_unit.resource.service";
import { CrowdResourceService } from "../../../../../../services/campaign/crowd.resource.service";
import { ErrorHandlingService } from "../../../../../../services/exceptional/error-handling.service";
import { CampaignDetailExceptionalCommunication } from "../../../../../../services/exceptional/campaign-detail-exceptional.service";

@Component({
	selector: 'create-crowd',
	templateUrl: 'create-crowd.component.html',
	styleUrls: ['create-crowd.component.css'],
	providers: [CampaignLaunchUnitResourceService]
})

export class CreateCrowdComponent implements OnInit {
	@Input()
	set showDialog(bl: boolean) {
		this.show = bl;
	}

	@Input()
	set dialogData (data: any) {
		let that = this;
		that.tp = data.tp;
	}

	@Output() hideDialog = new EventEmitter<boolean>();

	@Output() isCreate = new EventEmitter<any>();

	campaignId: any;  //活动Id
	name: string;  //那种人群 弹出框header显示
	show: boolean;  //是否显示弹框
	tp: string;  //人群类型
	src: string; //ifram src链接
	startDate: any;
	endDate: any;
	ht:string = '510'; // 弹框高度
	wt:string = '950'; // 弹框宽度
	crowdName: any;   //新建人群名称
	isErr: boolean = false;     //是否有错
	errMsg: string;     //错误详情
	changeBg: boolean = false; //文件上传禁用之后背景的class
	showUpdate: boolean = false;
	csvFileName: string = '';  //上传文件名称
	isFileErr: boolean = false;  //上传的文件是否有错
	isFileErrMsg: string;       //上传文件错误详情
	csvData: any = {};   //上传文件详情
	noFile: boolean = false;//展示没有文件时的提示
	tableTitle: any = [];
	tableList: any = [];
	quotes: any = [];
	isDisabled: boolean = false;
	tempFormData: any;   //文件数据临时存放位置
	tempUploadUUID: any;  //文件uuid临时存放

	//postMessage
	getPostMessage: any = (e: any): void => {
		let that = this;
		if (e.data) {
			let data: any;
			try {
				data = JSON.parse(e.data);
			} catch(err) {
				data = e.data;
			}
			if(data === 'cancel' || data.message === 'cancel') {
				that.show = false;
				that.cancel();
				return;
			}
			let id: number;
			if (typeof data === 'object') {
				if (data.code === 1001) {
					if (that.tp === 'lookalike') {
						id = data.data.crowdId;
					} else if (that.tp === 'scene') {
						id = data.data.id;
						that.startDate = moment(data.startDate).format('YYYY-MM-DD HH:mm:ss');
						that.endDate = moment(data.endDate).format('YYYY-MM-DD HH:mm:ss');
					}
				}
				that.save(data.data, id);
			}
		}
	}

	constructor(
		private indexSerivice: IndexSerivice,
		private route: ActivatedRoute,
		public campaignLaunchUnitResourceService: CampaignLaunchUnitResourceService,
		public crowdResourceService: CrowdResourceService,
		public errorHandlingService: ErrorHandlingService,
		public campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication
	) {
		let that = this;
		that.campaignId = that.route.params['value']['id'];


		indexSerivice.firstRequest().then(() => {
            indexSerivice.show = true;
        }).catch();
	}

	ngOnInit() {
		let that = this;
		if (window.addEventListener) {
            window.addEventListener('message', that.getPostMessage, false);
        } else if (window['attachEvent']) {
            window['attachEvent']('message', that.getPostMessage);
        }
	}

	ngOnChanges() {
		let that = this;
		that.crowdResourceService.config().then((config: any) => {
			if (that.tp == 'lookalike') {
				that.name = 'Lookalike人群';
				that.src = config.dmpDefaultUrl + '/dmp-web/pageapi#/crowd/lookalikeCrowd/new';
			} else if (that.tp == 'scene') {
				that.name = '精细化人群';
				that.src = config.dmpDefaultUrl + '/dmp-web/pageapi#/crowd/sceneCrowd/new';
			} else if (that.tp == 'precise') {
				that.name = '一方人群';
			} 
		}).catch((err: any) => {
			console.log('===>>', err);
		})
	}

	ngOnDestroy() {
        let that = this;
        if (window.removeEventListener) {
            window.removeEventListener('message', that.getPostMessage, false);
        } else if (window['detachEvent']) {
            window['detachEvent']('message', that.getPostMessage);
        }
    }

	save(crowd: any, crowdId: number) {
		let that = this;

		let data: any = {
			campaignId: that.campaignId,
			refId: crowdId,
			crowdName: crowd.name || crowd.tag.name,
            refCode: crowd.code || crowd.tag.code,
            crowdType: 1,       // 1 LookLike 2 scene  3 Accurate history 4 id file
			description: crowd.description
		};
		if (that.tempUploadUUID && that.tempUploadUUID.uploadUUID) {
			data['uploadUUID'] = that.tempUploadUUID.uploadUUID;
		}

		if (crowd.source || crowd.tag.source) {
            data.source = crowd.source || crowd.tag.source;
		}
		if (that.tp == 'scene') {
            data.crowdType = 2;
            data.startTime = that.startDate;
            data.endTime = that.endDate;
		}

		let formData = new FormData();
        formData.append("crowdCreationPage", JSON.stringify(data));

        that.crowdResourceService.CreateCrowd(formData).then((result: any) => {
            if (result && (result.retCode || result.msgDes)) {
                that.error(result.msgDes);
                return;
            }
            that.isCreate.emit(result);
        }).catch(err => {});
	}

	cancel() {
		let that = this;
		that.hideDialog.emit(false);
	}

	afterDialogHide () {
		let that = this;
		that.hideDialog.emit(false);
	}


	//修改人群名称  err 隐藏
    changeName() {
        this.isErr = false;
        this.isDisabled = false;
	}

	//判断上传的文件名称
	checkFileName(fileName:string){
		if(fileName){
			let tp = fileName.substr(fileName.length-3,3);
			if(tp.toUpperCase() == 'CSV'){
				return true;
			}
		}
		return false;
	}

    //选择文件时触发
    selectFile(event: any){
        let that = this;
        that.noFile = false;
        that.isFileErr = false;
        that.isFileErrMsg = '';
        if(that.checkFileName(event.target.value)){
			let infos = event.target.value.split('\\');
			that.csvFileName = infos[infos.length - 1];
            let formData = new FormData();
			let bin = event.target.files[0];
		    formData.append("uploadFiles", bin);
			that.isFileErr = true;    //防止页面先渲染出来
			that.crowdResourceService.uploadFile(formData).then(data => {
				if (data && (data.retCode || data.msgDes)) {
                    let error = that.errorHandlingService.getMsg(data);
                    if (error.code === 1) {
                        that.error(error);
                    } else if (error.code === 2) {
                        that.isFileErr = true;
                        that.isFileErrMsg = error.message;
                    }
                    that.clearFile();
                    return;
				}
				that.tempUploadUUID = data;
				return that.crowdResourceService.getDetail(data);
			}).then((data: any) => {
				if (data && (data.retCode || data.msgDes)) {
                    let error = that.errorHandlingService.getMsg(data);
                    if (error.code === 1) {
                        that.error(error);
                    } else if (error.code === 2) {
                        that.isFileErr = true;
                        that.isFileErrMsg = error.message;
                    }
                    that.clearFile();
                    return;
                }
				that.formatePreviewData(data);
				return that.crowdResourceService.getPreciseCrowdIdDv(that.tempUploadUUID);
			}).then(data => {
                //如果data为空 因为上面报错 return为空
                if (!data) {
                    return;
                }
                if ((data.retCode || data.msgDes)) {
                    let error = that.errorHandlingService.getMsg(data);
                    if (error.code === 1) {
                        that.error(error);
                    } else if (error.code === 2) {
                        that.isFileErr = true;
                        that.isFileErrMsg = error.message;
                        that.quotes = [];
                        that.csvFileName = '';
                        that.csvData = {};
                        that.tempUploadUUID = '';
                        that.tableTitle = [];
                        that.tableList = [];
                        that.changeBg = false;
                        that.showUpdate = false;
                    }
                    that.clearFile();
                    return;
                }
                that.isFileErr = false;
                that.isFileErrMsg = '';
                that.changeBg = true;
                that.showUpdate = true;
                that.csvData['tdId'] = data.tdId || 0;
                that.csvData['phoneNum'] = data.phoneNum || 0;
                that.csvData['IMEI'] = data.IMEI || 0;
                that.csvData['IDFA'] = data.IDFA || 0;
                that.csvData['AndroidId'] = data.AndroidId || 0;
				that.csvData['MAC'] = data.MAC || 0;
				that.csvData['email'] = data.email || 0;
            }).catch(err => {
                if (err) {
                    that.error('系统繁忙，请稍后再试！');
                }
            });
		}else{
			that.error("上传的文件格式不正确");
		}
	}

	//预览数据处理
	formatePreviewData(data: any) {
		let that = this;
		that.quotes = data.quotes;
		let content = data.content;
		let length = content.length;
		that.tableTitle = [];
		for (let i = 0; i < length; i++) {
			for (let key in content[i]) {
				if (that.tableTitle.indexOf(key) === -1) {
					that.tableTitle.push(key);
				}
			}
		}
		that.tableList = data.content;
	}
	

	//清除文件
	clearFile() {
        let that = this;
        that.quotes = [];
        that.csvFileName = '';
        that.csvData = {};
        that.tableTitle = [];
        that.tableList = [];
        that.tempUploadUUID = '';
        that.changeBg = false;
        that.showUpdate = false;
	}
	
	//一方人群创建
	createCrowd() {
		let that = this;
		that.isDisabled = true;  //提交后把按钮禁用
		if (!that.crowdName) {
			that.errMsg = '请输入人群名称';
			that.isErr = true;
			that.isDisabled = false;
			return;
		}
		if (!that.csvFileName) {
			that.noFile = true;
			that.isDisabled = false;
			return;
		}
		let data = {
			campaignId: that.campaignId,
			crowdName: that.crowdName,
			fileName: that.csvFileName,
			crowdType: 4,
			uploadUUID: that.tempUploadUUID.uploadUUID
		};

		let formData = new FormData();
        formData.append("crowdCreationPage", JSON.stringify(data));

		that.crowdResourceService.CreateCrowd(formData).then((result: any) => {
			that.isDisabled = false;
			if (result && (result.retCode || result.msgDes)) {
				let error = that.errorHandlingService.getMsg(result);
				if (error.code === 1) {
					that.error(error);
				} else if (error.code === 2) {
					that.errMsg = error.message;
					that.isErr = true;
				}
				return;
			}
			that.show = false;
			that.hideDialog.emit(that.show);
			that.isCreate.emit(result);
		}).catch(err => {
			that.isDisabled = false;
		})
	}

	//模拟点击上传文件input
	clickUploadInput() {
		document.getElementById('uploadCsv').click();
	}

	//error处理
    error(err: any) {
        let that = this;
		that.campaignDetailExceptionalCommunication.exceptionalMission(err.message || err);
    }
}