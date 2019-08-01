import { Component, Input, Output, EventEmitter } from '@angular/core';
import { 
    SelectItem,
    Message
} from 'primeng/primeng';
import * as lodash from 'lodash';
import { FunnelService }from '../../../../services/report/funnel.communication.service';
import { FunnelCommunicationService } from './../../../../services/communication/funnel.communication.service';
import { CampaignDetailExceptionalCommunication } from "../../../../services/exceptional/campaign-detail-exceptional.service";
import { ErrorHandlingService } from "../../../../services/exceptional/error-handling.service";

@Component({
    selector: 'add-funnel',
    templateUrl: 'add-funnel.component.html',
    styleUrls: ['add-funnel.component.css'],
    providers: [FunnelService]
})

export class AddFunnelComponent {
    display: boolean;
    funnelName: string = '';
    putCrowd: SelectItem[];
    selectedCrowd: any;
    selectedBl:any = 1;//是||不是选择
    selectedFunel:any;
    blList: any[] = []; 
    funnelList:any[] = []; //下拉选择
    eventList: any[] = [];
    eventMap: any = {};//事件映射
    events: any[] = [];//选择的事件
    eventName: any = '事件名称';//事件名称
    stepsList: any[] = []; //步骤列表
    attrList: any[] = [];   //属性列表
    stepName: any = '';  //步骤名称
    pageName: any = '';  //页面名称
    nameTip: any = '请填写漏斗名称。';//提示语
    indexCode: any = ''; //key
    msgs: Message[] = [];
    nameTipShow: boolean = false;  //名称提示
    stepTipShow: boolean = false;  //步骤提示
    isDisabled:boolean = false;     //确定按钮是否禁用
    stepTip: any = '请填写步骤名称。';
    @Input()
    set showAddFunnel(bl: boolean) {
        this.display = bl;
    }

    @Output() hideAddFunnel = new EventEmitter<boolean>();
    @Output() showSuccessDialog = new EventEmitter<boolean>();

    pannelTitle: string = "添加漏斗";
    funnelDetail: any;//漏斗详情
    isSubmit: boolean = false;//提交后按钮不可用

    constructor(
        private funnelService:FunnelService,
        private funnelCommunicationService: FunnelCommunicationService,
        private errorHandlingService: ErrorHandlingService,
        private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication
    ){
        let that = this;
        that.putCrowd = [];
        that.putCrowd.push({label: 'Analytics', value: '1'});
        that.blList.push({label: '是', value: '1'});
        that.blList.push({label: '不是', value: '2'});
        //查询事件名称名称下拉数据
        funnelService.queryFunnelSel({pageSize: 9999}).then((data:any) => {
            if (data && (data.retCode || data.msgDes)) {
                campaignDetailExceptionalCommunication.exceptionalMission(data);
                return;
            }
            data = data.data;
            for (let i = 0; i < data.length; i++) {
                that.funnelList.push({
                    label:data[i].name,
                    value:data[i].eventId
                });
                that.eventMap[data[i].eventId] = data[i].name;
            }
            //默认第一条
            that.selectedFunel = {
                eventId:data[0].eventId,
                name:data[0].name,
            };

            if (that.funnelCommunicationService.isEditFunnel) {//修改漏斗
                that.pannelTitle = "修改漏斗";
                that.getFunnelDetail();
            } else {//添加不做操作
                //步骤 （最低三步）
                for (let j = 0; j < 3; j++) {
                    that.addSteps();
                }
            }
        }).catch(err => {
            campaignDetailExceptionalCommunication.exceptionalMission(err);
        });
    }

    //获取漏斗详情
    getFunnelDetail(){
        let that = this;
        that.funnelService.queryFunnelDetail(that.funnelCommunicationService.selectedFunnelId).then((data: any) => {
            if (data && (data.retCode && data.msgDes)) {
                that.campaignDetailExceptionalCommunication.exceptionalMission(data);
                return;
            }
            that.funnelDetail = data;
            that.funnelName = data.funnelName;
            that.stepsList = data.funnelStepDefinitionExts;
        }).catch(err => {
            that.campaignDetailExceptionalCommunication.exceptionalMission(err);
        });
    }

    changeFunnel (i:any,j:any, event: any){
        let that = this;
        that.stepsList[i].funnelStepConditionDefinitions[j].key = event.value;
        that.stepsList[i].funnelStepConditionDefinitions[j].value = that.eventMap[event.value];
        
    }
    //添加步骤
    addSteps (){
        let param = [{
            "key": this.selectedFunel.eventId,
            "operator": this.selectedBl,
            "value": this.selectedFunel.name
        }];
        
        this.stepsList.push({
            "funnelStepConditionDefinitions":param,
            "name": "",
            "order": 0,
            "type": 1,
        });
    }
    //删除步骤
    delSteps (index: number){
        this.stepsList.splice(index,1);
    }
    //添加属性
    addAttr (step:any){
        let that =this;
        step.funnelStepConditionDefinitions.push({
            "key": this.selectedFunel.eventId,
            "operator": that.selectedBl,
            "value": that.selectedFunel.name
        });
    }
    //删除属性
    delAttr (index: number){
        this.attrList.splice(index,1);
    }
    submit(){
        let that = this;
        that.isSubmit = true;

        for (let i = 0; i < that.stepsList.length; i++) {
            that.stepsList[i].order = i + 1;
        }

        if (!that.funnelName) {
            that.nameTipShow = true;
            that.isSubmit = false;
            return ;
        }

        if (that.funnelName.trim().length == 0) {
            that.nameTip = '漏斗名称不能都是空格';
            that.nameTipShow = true;
            that.isSubmit = false;
            return ;
        } else {
            that.funnelName = that.funnelName.trim();
        }

        if (that.funnelName.length > 16) {
            that.nameTipShow = true;
            that.nameTip = '漏斗名称不超过16个字符';
            that.isSubmit = false;
            return;
        }
        if (that.checkRepName()) {
            that.nameTip = '漏斗名称重复，请重新填写';
            that.nameTipShow = true;
            that.isSubmit = false;
            return;
        }
        if (!that.checkName()) {
            that.stepTip = '请填写步骤名称。';
            that.stepTipShow = true;
            that.isSubmit = false;
            return;
        }
        if (that.checkStepsLen()) {
            that.stepTipShow = true;
            that.stepTip = '漏斗步骤名称不超过26个字符';
            that.isSubmit = false;
            return;
        }
        if (that.checkRepStep()) {
            that.stepTip = '步骤名称重复，请重新填写';
            that.stepTipShow = true;
            that.isSubmit = false;
            return;
        }
        if (that.checkFunnelEvent()) {
            that.stepTip = '漏斗事件重复，不同步骤请选择不同漏斗事件';
            that.stepTipShow = true;
            that.isSubmit = false;
            return
        }

        let param = {
            "campaignId": that.funnelCommunicationService.campaignId,
            "funnelName" : that.funnelName,
            "funnelStepDefinitionExts" : that.stepsList
        };

        if (that.funnelCommunicationService.isEditFunnel) {//修改漏斗
            param["funnelDefinitionId"] = that.funnelCommunicationService.selectedFunnelId;
            param["campaignFunnelConfigId"] = that.funnelDetail.campaignFunnelConfigId;
            param["defaultFlag"] = that.funnelDetail.defaultFlag;
            that.funnelService.updateFunnel(param).then((data:any)=>{
                that.isSubmit = false;
                if (data && data._body) {
                    data = JSON.parse(data._body);
                }
                if (data && (data.retCode && data.msgDes)) {
                    let err = that.errorHandlingService.getMsg(data);
                    if (err.code == 1) {
                        that.campaignDetailExceptionalCommunication.exceptionalMission(err);
                    } else {
                        that.nameTip = err.message;
                        that.nameTipShow = true;
                    }
                    return;
                }
                //that.showMsg("success","保存成功！");
                that.display = false;
                that.isDisabled = false;
                that.funnelCommunicationService.selectedFunnelId = data;
                that.hideAddFunnel.emit(that.display);
                that.showSuccessDialog.emit(true);
            }).catch(err => {
                that.showMsg("error", "系统繁忙，请稍后再试！");
            });
        } else {//保存漏斗
            that.isDisabled = true;
            that.funnelService.createFunnel(param).then((data:any)=>{
                that.isSubmit = false;
                if (data && data._body) {
                    data = JSON.parse(data._body);
                }
                if (data && (data.retCode && data.msgDes)) {
                    let err = that.errorHandlingService.getMsg(data);
                    if (err.code == 1) {
                        that.campaignDetailExceptionalCommunication.exceptionalMission(err);
                    } else {
                        that.nameTip = err.message;
                        that.nameTipShow = true;
                    }
                    return;
                }
                that.display = false;
                that.isDisabled = false;
                that.funnelCommunicationService.selectedFunnelId = data;
                that.hideAddFunnel.emit(that.display);
                that.showSuccessDialog.emit(true);
                that.stepsList.length = 1;
                that.stepsList[0].name = '';
                that.attrList[0].value = '';
                that.funnelName = '';
            }).catch(err => {
                that.showMsg("error", "系统繁忙，请稍后再试！");
            });
        }
    }

    /**
     * 检测是否有重复漏斗事件
     */
    checkFunnelEvent() {
        let that = this;
        let len = that.stepsList;
        let strArry: any[] = [];
        for (let i = 0; i < len.length; i++) {
            if (strArry.indexOf(len[i].funnelStepConditionDefinitions[0].key) != -1) {
                return true;
            } else {
                strArry.push(len[i].funnelStepConditionDefinitions[0].key);
            }
        }
        return false;
    }

    checkName () {
        let that = this;
        let len = that.stepsList;
        for (let i = 0; i < len.length; i++) {
            if (!len[i].name || len[i].name.trim().length == 0) {
                return false;
            }
        }
        return true;
    }
    //检验是否漏斗名称重复
    checkRepName () {
        let that = this;
        let len = that.funnelCommunicationService.funnelListName.length;
        if (!that.funnelCommunicationService.isEditFunnel) {
            for (let i = 0; i < len; i++) {
                if (that.funnelName == that.funnelCommunicationService.funnelListName[i].funnelName) {
                    return true;
                }
            }
        }
        return false;
    }
    //校验是否有重复步骤名称
    checkRepStep () {
        let that = this;
        let len = that.stepsList.length;
        let arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(that.stepsList[i].name);
        }
        let newArr =  lodash.uniq(arr);
        if (len > 1) {
            if (arr.length != newArr.length) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
                
    }
    //校验步骤字数是否超过26个字符
    checkStepsLen () {
        let that = this;
        let len = that.stepsList.length;
        for (let i = 0; i < len; i++) {
            if (that.stepsList[i].name.length > 26) {
                return true;
            } else {
                return false;
            }
        }
    }
    checkValue () {
        let that = this;
        let len = that.stepsList;
        for (let i = 0; i < len.length; i++) {
            for (let j = 0; j < len[i].funnelStepConditionDefinitions.length; j++) {
                if (!len[i].funnelStepConditionDefinitions[j].value) {
                    return false;
                }
            }
        
        }
        return true;
    }
    //输入漏斗名称触发
    changeName() {
        this.nameTipShow = false;
    }
    //输入步骤别名触发
    changeStepName() {
        this.stepTipShow = false;
    }
    closeDialog () {
        this.display = false;
        this.funnelName = '';
        this.stepsList[0] = {"name" : ""};
        this.hideAddFunnel.emit(this.display);
    }
    //展示提示信息
    showMsg(msgType:string,msg:string){
        let that = this;
        that.msgs = [];
        that.msgs.push({severity:msgType, summary:msgType+' Message', detail:msg});
    }
}