import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import {SelectItem} from "primeng/components/common/api";
import { Message, ConfirmationService } from 'primeng/primeng';
import { CampaignDetailExceptionalCommunication } from "../../../../services/exceptional/campaign-detail-exceptional.service";
import { CampaignDetailDataCommunication } from './../../../../services/communication/campaign-detail-data.communication.service';
import { ErrorHandlingService } from "../../../../services/exceptional/error-handling.service";
import { EquityConfigResourceService } from '../../../../services/campaign/equity_config.resource.service';

@Component({
    selector: 'equity-config',
    templateUrl: 'equity-config.component.html',
    styleUrls: ['equity-config.component.css'],
    providers: [ConfirmationService]
})

export class EquityConfigComponent implements OnInit{
    csvFileName: string; // csv 文件名
    uploadUUID: string;   //当前操作的csv文件的 uuid
    oldEquityNameTmp: string = ''; // 为了保存旧的权益名称而存在的变量
    msgs: Message[] = [];
    tipShow: boolean = false; //提示语显隐
    tipContent: string = '请输入正确的预期达成值'; // 提示语
    acceptLabel: any = "确定"; 
    beforEdit: any; // 修改权益配置时，记录上次修改的内容

    @Input() campaignId: any; // 营销活动id
    @Input() campaignStatus: number; // 营销活动状态
    @Input() equityList: any[]; // 权益列表
    
    @Output() onUpdateEquityList = new EventEmitter();  // 更新权益设置列表
    @Output() getProcessResourceList = new EventEmitter(); // 更新营销流程列表

    constructor(
        private confirmationService: ConfirmationService,
        private campaignDetailDataCommunication: CampaignDetailDataCommunication,
        private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication,
        public errorHandlingService: ErrorHandlingService,
        public equityConfigResourceService: EquityConfigResourceService
    ){

    }

    ngOnInit(){
        let that = this;
    }

    //添加编辑计划的操作
    addTab(){
        let that = this;
        if(that.isAddingStatus()){
            that.showMsg('info', '提示','还有未保存的权益设置。');
        }else if(that.equityList.length > 4){
            that.showMsg('info', '提示','最多创建5个权益设置。');
        }else{
            that.equityList.push({
                "isAdding": true,
                "name": "",   // 权益名称 
                "total": "--",    // 权益总量
                "filename": "",     // 上传csv文件名
                "isNeedClear": true
            });
        }
    }
    
    //取消编辑（取消添加）
    cancel(index:number){
        let that = this;
        that.changeClearRel(index);
        if(that.beforEdit && that.equityList[index].id){
            that.equityList[index] = JSON.parse(that.beforEdit);
            that.equityList[index].isAdding = false;
            that.beforEdit = null;
        }else{
            that.equityList.splice(index,1);
        }
    }

    delEquity(index:number) {
        let that = this;
        let delID = that.equityList[index].id;

        that.equityConfigResourceService.remove(delID).then((data) => {
            that.onUpdateEquityList.emit();
            that.getProcessResourceList.emit();
        }).catch((err) => {
            console.log(err)
        });
    }

    //是否已经存在添加状态
    isAddingStatus():boolean{
        let that = this;
        let flag = false;
        for (let i=0;i<that.equityList.length;i++){
            if(that.equityList[i].isAdding){
                flag = true;
                break;
            }
        }
        return flag;
    }

    //编辑
    reEditPlan(index:number){
        if(!this.isAddingStatus()){
            this.beforEdit = JSON.stringify(this.equityList[index]);
            this.equityList[index].isAdding = true;
        }
    }

    // 修改是否可清除
    changeClearRel(i: number):void {
        this.equityList[i].isNeedClear = true;
        this.uploadUUID = null;
        this.equityList[i].attachmentName = null;
        this.csvFileName = null;
    }

    // 检查是否不规范返回bool
    checkEquityNameBool(equityName: string) {
        if(equityName.length > 26) {
            return 26;
        }else if(equityName.length === 0) {
            return 0;
        }
        return -1;
    }


    // 更改权益状态
    createPlan(i: number) {
        let that = this;
        if(that.checkEquityNameBool(that.equityList[i].name) === 26) {
            that.showMsg('info', '提示','权益名称不能超过26位中文字符！'); 
            return;
        }
        if(that.checkEquityNameBool(that.equityList[i].name) === 0) {
            that.showMsg('info', '提示','权益名称不能为空！'); 
            return;
        }
        if(!that.checkEquityIsRepeated(that.equityList[i].name, i)) {
            that.showMsg('info', '提示','权益名称不能重复！');
            return;
        }
        if(!that.checkCSVIsRemove(i)) {
            that.showMsg('info', '提示', '清除上传的.csv格式权益表后必须再上传新的才能够提交！');
            return;
        }
        // 获取权益ID
        let ID = that.equityList[i].id; // 如果有Id则是新增，没有则为编辑
        if(ID) {
            that.alterCurEquity(i);
        }else {
            if(!that.uploadUUID || !that.equityList[i].total) {
                that.showMsg('info', '提示','请上传.csv格式权益表！');
                return;
            }
            that.createNewEquity();
        }
    }


    // 添加权益
    createNewEquity() {
        let that = this;
        let newFormData = new FormData();

        newFormData.append("uploadUUID", that.uploadUUID);
        newFormData.append("name", encodeURIComponent(that.equityList[that.equityList.length - 1].name));
        newFormData.append("total", that.equityList[that.equityList.length -1].total);
        newFormData.append("campaignId", that.campaignId);

        that.equityConfigResourceService.createNewEquity(newFormData).then(data => {
            that.onUpdateEquityList.emit();
            that.getProcessResourceList.emit();            
            that.uploadUUID = null;
            that.csvFileName = null;
        }).catch(err => {
            if (err) {
                that.error('系统繁忙，请稍后再试！');
            }
        });
    }
    // 修改权益
    alterCurEquity(i: number) {
        let that = this;
        let newFormData = new FormData();

        // 约定url里传入id
        let eqID = that.equityList[i].id;
        let params = {
            'name': encodeURIComponent(that.equityList[i].name),
        }

        if(that.uploadUUID) {
            newFormData.append('uploadUUID', that.uploadUUID);
            params['total'] =  that.equityList[i].total;
        }

        that.equityConfigResourceService.alterCurEquity(eqID, params, newFormData).then(data => {
            that.onUpdateEquityList.emit();
            that.getProcessResourceList.emit();            
            that.uploadUUID = null; // 设置uploadUUID为空，防止uploadUUID被下次修改或新增uploadUUID的时候影响
            that.csvFileName = null;
        }).catch(err => {
            if (err) {
                that.error('系统繁忙，请稍后再试！');
            }
        });
    }

    // 展示提示信息
    showMsg(msgType:string, summary: string, msg:string){
        let that = this;
        that.msgs = [];
        that.msgs.push({severity:msgType, summary:summary, detail:msg});
    }
    //输入change
    inputChange (){
        this.tipShow = false;
    }

    checkCSVIsRemove(index: number) {
        let that = this;
        if(that.equityList[index].isNeedClear && that.uploadUUID === null) {
            return false;
        }else {
            return true;
        }
    }

    //判断上传的文件名称
    checkFileName(fileName:string){
		if(fileName){
			let tp = fileName.substr(fileName.length-3,3);
			if(tp.toUpperCase() === 'CSV'){
				return true;
			}
		}
		return false;
	}

    //选择文件时触发
    selectFile(event: any, i:number){
        let that = this;
        let fileSize = event.target.files[0].size / 1024 / 1024;
        if(fileSize > 10) {
            that.showMsg('info', '提示','上传文件大小不能超过10m！');
            that.csvFileName = null;
            that.uploadUUID = null;
            return;
        }
        
        if(that.checkFileName(event.target.value)){
			let infos = event.target.value.split('\\');
            that.csvFileName = infos[infos.length - 1];
            if(!that.checkCSVFileNameIsRepeated(i)) {
                that.showMsg('info', '提示','上传的.csv文件名重复！');
                that.csvFileName = null;
                that.uploadUUID = null;
                return;
            }
            let formData = new FormData();
			let bin = event.target.files[0];
            formData.append('uploadFiles', bin);
            formData.append('type', 'equity');
            that.equityConfigResourceService.uploadFile(formData).then(data => {
                if (data && (data.retCode || data.msgDes)) {
                    let error = that.errorHandlingService.getMsg(data);
                    that.showMsg('info', '提示', error.message);
                    that.changeClearRel(i);
                    return;
                }
                that.uploadUUID = data.uploadUUID;
                return that.equityConfigResourceService.getTotalEquityByCSVFile({uploadUUID: that.uploadUUID})
            }).then(data => {
                if (data && (data.retCode || data.msgDes)) {
                    let error = that.errorHandlingService.getMsg(data);
                    that.showMsg('info', '提示', error.message);
                    that.changeClearRel(i);
                    return;
                }
                that.equityList[i]['total'] = parseInt(data, 10);
                that.equityList[i]['filename'] = that.csvFileName;
            }).catch(err => {
                if (err) {
                    that.error('系统繁忙，请稍后再试！');
                }
            })
		}else{
			that.error("上传的文件格式不正确");
		}
    }

    // 从 precise-crowd-form.component.ts 里抽的error处理函数
    error(err: any) {
        let that = this;
        that.campaignDetailExceptionalCommunication.exceptionalMission(err);
    }

    
    // 检查权益配置名称是否符合规范给予提示   
    // 1. 不为空
    // 2. 最大为26位
    // checkEquityName(equityNameInput: any) {
    //     let that = this;
    //     let equityName = equityNameInput.value;
    //     if(equityName.length >= 26) {
    //         that.showMsg('info', '提示','权益名称最多不能大于26位！');            
    //         equityNameInput.value = that.oldEquityNameTmp;
    //     }else if(equityName.length === 0) {
    //         that.showMsg('info', '提示','权益名称不能为空！');  
    //     }else {
    //         that.oldEquityNameTmp = equityName;    
    //     }
    // }

    // 检查权益名称是否重复返回bool
    checkEquityIsRepeated(equityName: string, index: number) {
        let that = this;
        let equityNameListTmp = that.equityList.filter((eq: any, i: number):boolean => {
            if(index !== i) {
                return true;
            }
        });
        let equityRepeatedEl = equityNameListTmp.find((eq: any) => {
            return eq.name === equityName ? true : false;
        })
        if(equityRepeatedEl) {
            return false;
        }else {
            return true;
        }
    }
    
    // 检查上传文件名称是否重复返回bool
    checkCSVFileNameIsRepeated(index: number) {
        let that = this;
        let filename = this.csvFileName;
        let equityNameListTmp = that.equityList.filter((eq: any, i: number):boolean => {
            if(index !== i) {
                return true;
            }
        });
        let equityRepeatedEl = equityNameListTmp.find((eq: any) => {
            return eq.attachmentName === filename ? true : false;
        })
        if(equityRepeatedEl) {
            return false;
        }else {
            return true;
        }
    }

}
