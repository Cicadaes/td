import {Output, Input,Component, EventEmitter} from '@angular/core';

import { AttachmentResourceService } from "../../../../../services/campaign/attachment.resource.service";
import { CampaignDetailDataCommunication } from "../../../../../services/communication/campaign-detail-data.communication.service";
import { CampaignLaunchUnitResourceService } from "../../../../../services/campaign/campaign_launch_unit.resource.service";
import { CrowdResourceService } from "../../../../../services/campaign/crowd.resource.service";
import { CampaignDetailExceptionalCommunication } from "../../../../../services/exceptional/campaign-detail-exceptional.service";
import { ErrorHandlingService } from "../../../../../services/exceptional/error-handling.service";

@Component({
    selector: 'precise-crowd-form',
    templateUrl: 'precise-crowd-form.component.html',
    styleUrls: ['precise-crowd-form.component.css'],
    providers: [AttachmentResourceService, CampaignLaunchUnitResourceService, CrowdResourceService]
})
export class PreciseCrowdFormComponent {

    crowdId: number;

    preciseCrowd: any = {};

    uploadedFiles: any[] = [];

    crowdList:any [] = [];

    crowdInfo:any;

    show:boolean;

    select2:boolean = false;
    preciseCrowdName: string;

    csvFileId: string = '';
    
    csvFileName: string = '';

    csvCrowdName: string = '';

    csvData: any = {};

    csvDataCount: any = [];

    tableTitle: any = [];

    tableList: any = [];

    quotes: any = [];

    inputEvent: any;   //存放input框 event内容

    tempUploadUUID: any;   //文件数据临时存放位置

    changeBg: boolean = false; //文件上传禁用之后背景的class

    showUpdate: boolean = false;
    //上传文件限制大小
    maxFileSize: number = 2 * 1024 * 1024;
    isDisabled: boolean = false;

    isErr: boolean = false;     //是否有错
    errMsg: string;     //错误详情
    
    isFileErr: boolean = false;  //上传的文件是否有错
    isFileErrMsg: string;       //上传文件错误详情

    getHistoryCrowdTimeOut: any; //用于存放历史人群搜索时 生成Timeout的id

    showLoadMore: boolean = false;//显示更多人群

    //精准人群分页信息
    preciseConfig: any = { 
        page: 1,
        pageSize: 10,
        total: 1
    };

    @Input()
    set showPreciseCrowdDialog(bl:boolean){
        this.show = bl;
    }

    @Input()
    set promotionCrowdId(id: number) {
        this.crowdId = id;
    }

    @Output() hidePreciseCrowdDialog = new EventEmitter<boolean>();
    
    @Output() hideParentDialog = new EventEmitter<boolean>();

    @Output() isUpdatePreciesCrowd = new EventEmitter<boolean>();

    noFile: boolean = false;//展示没有文件时的提示

    constructor(
        private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication,
        private campaignDetailDataCommunication: CampaignDetailDataCommunication,
        private attachmentResourceService: AttachmentResourceService,
        private campaignLaunchUnitResourceService: CampaignLaunchUnitResourceService,
        private crowdResourceService: CrowdResourceService,
        private errorHandlingService: ErrorHandlingService
    ){
        let that = this;
        //默认选择历史人群列表
        that.preciseCrowd.crowdType = 3;
        that.getHistoryCrowd();
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
        that.inputEvent = event;
        that.noFile = false;
        that.isFileErr = false;
        that.isFileErrMsg = '';

        if (that.checkFileName(event.target.value)){
			let infos = event.target.value.split('\\');
			that.csvFileName = infos[infos.length - 1];
            let formData = new FormData();
			let bin = event.target.files[0];
            formData.append('uploadFiles', bin);
            formData.append('type', 'accurate');  //类型为一方人群 type: 一方人群(accurate),权益表(equity),短信黑名单(blacklist)
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
            }).then((data) => {
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
                        that.inputEvent.target.value = "";
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
            })
            // that.attachmentResourceService.uploadFile(formData).then((data: any) => {
            //     that.onCsvUpload(data);
            // })
		}else{
			that.error("上传的文件格式不正确");
		}
    }

    //选择某个table后 获取选中的table index
    onTableSelect(e: any) {
        this.preciseCrowd.crowdType = e.index + 3;
    }

    //搜索已输入的人群名称
    change() {
        let that = this;
        if (that.getHistoryCrowdTimeOut) {
            clearTimeout(that.getHistoryCrowdTimeOut);
        }
        that.getHistoryCrowdTimeOut = setTimeout(function () {
            that.crowdList = [];
            that.preciseConfig.page = 1;
            that.getHistoryCrowd(that.preciseCrowdName);
        }, 1000)
    }

    //删除已经输入的搜索人群名称
    delText() {
        this.preciseCrowdName = '';
        this.getHistoryCrowd();
    }

    //获取历史人群列表
    getHistoryCrowd(name?: string) {
        let that = this;
        let json = {
            campaignId: that.campaignDetailDataCommunication.campaignId,
            page: that.preciseConfig.page,
            pageSize: that.preciseConfig.pageSize
        }
        if(!name) {
            json['refName'] = '';
        } else {
            json['refName'] = name;
        }
        that.crowdResourceService.getPreciseCrowdHistory(json)
            .then((result: any) => {
                if (result && (result.retCode || result.msgDes)) {
                    that.error(result);
                    return; 
                }
                that.preciseConfig.total = result.total;
                if (that.preciseConfig.page === 1) {
                    that.crowdList = result.rows;
                } else {
                    that.crowdList = that.crowdList.concat(result.rows);
                }
                if (!result.rows){
                    that.showLoadMore = false;
                } else {
                    if (result.total > (that.preciseConfig.page - 1) * that.preciseConfig.pageSize + result.rows.length) {
                        that.showLoadMore = true;
                    } else {
                        that.showLoadMore = false;
                    }
                }
                if (!that.crowdInfo) {
                    that.crowdInfo = that.crowdList[0];
                }
            }).catch((err: any) => {
                that.error(err);
            });
    }
    
    //加载更多
    loadMoreCrowd(){
        let that = this;
        if (!that.showLoadMore) {
            return;
        }
        that.preciseConfig.page = that.preciseConfig.page + 1;
        that.getHistoryCrowd(that.preciseCrowdName);

    }

    //获取人群信息 占时未使用
    getDetailCrowd(id: number) {
        let that = this;
        // that.createPreciseCrowdService.get(id)
        //     .then((result: any) => {
        //         // console.log('===>>', result);
        //     }).catch((err: any) => {
        //         that.error(err);
        //     });
    }

    //编辑精准人群
    updateCrowd(data: any) {
        let that = this;
        that.crowdResourceService.update(data)
            .then((result) => {
                // console.log('data=>', result);
            }).catch((err) => {
                that.campaignDetailExceptionalCommunication.exceptionalMission(err);
            });
    }

    //保存
    save(){
        let that = this;
        that.isDisabled = true;//提交后把按钮禁用
        //campaign_id 应为父组件传过来
        that.preciseCrowd.campaignId = that.campaignDetailDataCommunication.campaignId;
        if (that.preciseCrowd.crowdType === 3 && that.crowdInfo) {
            that.preciseCrowd.crowdName = that.crowdInfo.name || '';
            that.preciseCrowd.refId = that.crowdInfo.id;
        } else if (that.preciseCrowd.crowdType === 4) {
            that.preciseCrowd.crowdName = that.csvCrowdName || '';
            if(!that.preciseCrowd.crowdName){
                that.errMsg = "请输入人群名称";
                that.isErr = true;
                that.isDisabled = false;
                return ;
            }
            if(!that.csvFileName){
                that.noFile = true;
                that.isDisabled = false;
                return ;
            }
            that.preciseCrowd.fileName = that.csvFileName;
        }
        if (!that.crowdId) {
            if (that.preciseCrowd.crowdType === 4) {
                if (that.tempUploadUUID.uploadUUID) {
                    that.preciseCrowd['uploadUUID'] = that.tempUploadUUID.uploadUUID;
                }
                that.campaignLaunchUnitResourceService.createUnit(that.preciseCrowd).then((result: any) => {
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
                    that.hidePreciseCrowdDialog.emit(that.show);
                    that.hideParentDialog.emit(that.show);
                }).catch(err => {
                    that.campaignDetailExceptionalCommunication.exceptionalMission(err);
                    that.isDisabled = false;
                });
            } else {
                that.campaignLaunchUnitResourceService.createUnit(that.preciseCrowd).then((result: any) => {
                    that.isDisabled = false;
                    if (result && (result.retCode || result.msgDes)) {
                        let error = that.errorHandlingService.getMsg(result);
                        //TODO 未处理页面内报错 所有报错走右上角
                        that.error(error);
                        // if (error.code === 1) {
                        //     that.error(error);
                        // } else if (error.code === 2) {
                        //     that.errMsg = error.message;
                        //     that.isErr = true;
                        // }
                        return;
                    }
                    that.show = false;
                    that.hidePreciseCrowdDialog.emit(that.show);
                    that.hideParentDialog.emit(that.show);
                }).catch((err: any) => {
                    that.campaignDetailExceptionalCommunication.exceptionalMission(err);
                    that.isDisabled = false;
                });
            }
        } else {
            that.crowdResourceService.update(that.preciseCrowd).then(result => {
                if (result && (result._body || result._body.retCode)) {
                    let error = that.errorHandlingService.getMsg(result._body);
                    if (error.code === 1) {
                        that.error(error);
                    } else if (error.code === 2) {
                        that.errMsg = error.message;
                        that.isErr = true;
                    }
                    return;
                }
                that.show = false;
                that.hidePreciseCrowdDialog.emit(that.show);
                that.hideParentDialog.emit(that.show);
                that.isUpdatePreciesCrowd.emit(true);
                that.isDisabled = false;
            }).catch(err => {
                that.campaignDetailExceptionalCommunication.exceptionalMission(err);
                that.isDisabled = false;
            })
            // that.promotionCrowdService.updateCrowd(that.preciseCrowd)
            // .then(result => {
            //     this.show = false;
            //     this.hidePreciseCrowdDialog.emit(this.show);
            //     this.hideParentDialog.emit(this.show);
            // }).catch(err => {
            //     that.error(err);
            // })
        }
        
    }

    cancel(){
        //TODO:取消
        let that = this;
        that.show = false;
        that.afterDialogHide();
    }

    showdiv(){
        let that = this;
        that.select2 = !that.select2;
        this.preciseCrowd.crowdType = 4;
    }

    showdivfirst(){
        let that = this;
        that.select2 = !that.select2;
        this.preciseCrowd.crowdType = 3;
    }
    afterDialogHide(){
        this.hidePreciseCrowdDialog.emit(this.show);
    }

    ngOnChanges() {
        let that = this;
         //判断是不是编辑状态
        if(that.crowdId) {
            that.crowdResourceService.get(that.crowdId).then(result => {
                if (result && (result.retCode || result.msgDes)) {
                    that.error(result);
                    return;
                }
                that.preciseCrowd = result;
                if (result.crowdType === 4) {
                    that.csvCrowdName = result.refName;
                    that.attachmentResourceService.query({crowdId: result.id})
                    .then((result: any) => {
                        if (result && (result.retCode || result.msgDes)) {
                            that.error(result);
                            return;
                        }
                        that.csvFileId = result[0].id;
                        that.csvFileName = result[0].name;
                        return that.crowdResourceService.getPreciseCrowdIdDv({uploadUUID: that.csvFileId});
                    }).then((result: any) => {
                        if (result && (result.retCode || result.msgDes)) {
                            that.error(result);
                            return;
                        }
                        that.csvData['tdId'] = result.tdId;
                        that.csvData['phoneNum'] = result.phoneNum;
                        that.csvData['IMEI'] = result.IMEI;
                        that.csvData['IDFA'] = result.IDFA;
                        that.csvData['AndroidId'] = result.AndroidId;
                        that.csvData['MAC'] = result.MAC;
                        that.csvData['email'] = result.email;
                        return that.crowdResourceService.getDetail(that.csvFileId);
                    }).then((result: any) => {
                        if (result && (result.retCode || result.msgDes)) {
                            that.error(result);
                            return;
                        }
                         that.formatePreviewData(result);
                    }).catch(err => {
                        that.campaignDetailExceptionalCommunication.exceptionalMission(err);
                    })
                }
            }).catch(err => {
                that.campaignDetailExceptionalCommunication.exceptionalMission(err);
            })
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


    //error处理
    error(err: any) {
        let that = this;
        that.campaignDetailExceptionalCommunication.exceptionalMission(err);
    }

    //清除文件
    clearFile() {
        let that = this;
        that.quotes = [];
        that.csvFileName = '';
        that.csvData = {};
        that.tableTitle = [];
        that.tableList = [];
        that.inputEvent.target.value = "";
        that.tempUploadUUID = '';
        that.changeBg = false;
        that.showUpdate = false;
    }

    //修改人群名称  err 隐藏
    changeName() {
        this.isErr = false;
        this.isDisabled = false;
    }
}