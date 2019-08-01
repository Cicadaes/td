import {Component, Input} from '@angular/core';
import {SelectItem} from "primeng/components/common/api";
import { Message, ConfirmationService } from 'primeng/primeng';
import { CampaignTargetConfigResourceService } from "../../../../services/campaign/campaign_target_config.resource.service";
import { CampaignTargetDefinitionResourceService } from "../../../../services/admin/campaign_target_definition.resource.service";
import { CampaignDetailExceptionalCommunication } from "../../../../services/exceptional/campaign-detail-exceptional.service";
import { CampaignDetailDataCommunication } from './../../../../services/communication/campaign-detail-data.communication.service';
import { ErrorHandlingService } from "../../../../services/exceptional/error-handling.service";

@Component({
    selector: 'plan-target',
    templateUrl: 'plan-target.component.html',
    styleUrls: ['plan-target.component.css'],
    providers: [CampaignTargetConfigResourceService, CampaignTargetDefinitionResourceService, ConfirmationService]
})

//TODO  新建多个后 前面的下拉列表未删除后面新建的
export class PlanTargetComponent {

    planTargets: any[] = [];

    @Input() campaignId:number;

    @Input() isFinish: boolean;

    //监控目标
    monitorTarget: SelectItem[] = [];

    monitorTargetMap:any={};

    copyArr:any = [];

    //预期达到
    // expectedReach:SelectItem[];

    planTargetReq :any = {};

    beforEdit:any;
    targetName:any = '';
    //存储已存在的计划目标
    selectTarget: any = [];

    index: any = 0;
    msgs: Message[] = [];
    tipShow:boolean = false; //提示语显隐
    targetShow: boolean = false;
    tipContent:string = '请输入正确的预期达成值';
    targetContent: string = '指标不存在';

    tempData: any; //被删除的数据/新增数据 用来添加检测指标用

    isFirst: boolean = true;    //用来表示是否是第一次进来

    acceptLabel:any = "确定";

    constructor(
        private confirmationService: ConfirmationService,
        private campaignDetailDataCommunication: CampaignDetailDataCommunication,
        private campaignTargetConfigResourceService: CampaignTargetConfigResourceService,
        private campaignTargetDefinitionResourceService: CampaignTargetDefinitionResourceService,
        private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication,
        public errorHandlingService: ErrorHandlingService,
    ){
        let that = this;
        //目前只有这俩个，需要修改时，与后端沟通对应的value
        // that.expectedReach = [];
        // that.expectedReach.push({label:"活动累计到达",value:"1"});
        // that.expectedReach.push({label:"活动结束到达",value:"2"});   
    }

    ngOnInit(){
        let that = this;
        that.getMonitorTargetList();

        //获取所有计划目标下拉框数据 并存放其name
        that.campaignTargetDefinitionResourceService.query().then((data:any)=>{
            if (data && (data.retCode || data.msgDes)) {
                that.campaignDetailExceptionalCommunication.exceptionalMission(data);
                return;
            }
            for(let i=0;i<data.length;i++){
                that.monitorTargetMap[data[i]['id']] = data[i]['name'];
            }
            
        }).catch(err => {
            that.campaignDetailExceptionalCommunication.exceptionalMission('系统繁忙，请稍后重试!');
        });
    }

    //获取监测指标列表
    getMonitorTargetList (){
        let that = this;
        that.monitorTarget = [];
        that.campaignTargetDefinitionResourceService.queryTarList(that.campaignId).then((data:any) => {
            if (data && (data.retCode || data.msgDes)) {
                that.campaignDetailExceptionalCommunication.exceptionalMission(data);
                return;
            }
            if(data.length){
                for(let i = 0;i < data.length; i++){
                    let status = data[i].scope.split(',');
                    status = status[status.length - 1];
                    if(status == 1) {
                        that.monitorTarget.push({label: data[i]['name'], value: data[i]['id']});                        
                    }
                }
                // 这里执行去重操作
                that.monitorTarget = Array.from(new Set(that.monitorTarget));
                that.planTargetReq.name = data[0]['name'];
                that.targetName = data[0].id;
                if (that.tempData) {
                    for (let i = 0; i < that.planTargets.length; i++) {
                        for (let j = 0; j < that.selectTarget.length; j++) {
                            if (that.selectTarget[j].targetDefinitionId === that.planTargets[i].selectedmonTarget) {
                                let temp = [{label: that.selectTarget[j].name, value: that.selectTarget[j].targetDefinitionId}];
                                that.planTargets[i].monitorTarget = temp.concat(that.monitorTarget);
                            }
                        }
                    }
                    that.tempData = null;
                }
            } else {
                //将默认选这个指标置为空 防止无数据时 会传上一次的值
                that.targetName = '';
            }
            if (that.isFirst) {
                that.isFirst = false;
                that.campaignTargetConfigResourceService.getTargetList(that.campaignId).then((data:any)=>{
                    if (data && (data.retCode || data.msgDes)) {
                        that.campaignDetailExceptionalCommunication.exceptionalMission(data);
                        return;
                    }
                    that.campaignDetailDataCommunication.campaignTargetConfig = data;
                    this.selectTarget = data;
                    for(let i = 0; i < data.length;i++){
                        that.respTrans(data[i]);
                    }
                }).catch(err => {
                    that.campaignDetailExceptionalCommunication.exceptionalMission('系统繁忙，请稍后重试!');
                });
            }
        }).catch(err => {
            that.campaignDetailExceptionalCommunication.exceptionalMission('系统繁忙，请稍后重试!');
        });
    }
    
    //添加编辑计划的操作
    addTab(){
        if(this.isAddingStatus()){
            this.showMsg('info', '提示','还有未保存的计划目标。');
        }else if(this.planTargets.length > 3){
            this.showMsg('info', '提示','最多创建4个计划目标。');
        }else{
            this.planTargets.push({
                "isAdding": true,
                "monitorTarget": this.monitorTarget,
                "selectedmonTarget": this.targetName,
                // "expectedReach": this.expectedReach,
                "selectedExpReach": "1",
                "reachCount": ''
            });
            //需要等待页面渲染后获取input框 然后绑定焦点
            setTimeout(function () {
                document.querySelector('.plan-target-box .new-num')['focus']();
            }, 1);
        }
    }
    
    //取消编辑（取消添加）
    cancel(index:number){
        this.targetShow = false;
        this.tipShow = false;
        if(this.beforEdit){
            this.planTargets[index] = JSON.parse(this.beforEdit);
            this.planTargets[index].isAdding = false;
            this.beforEdit = null;
        }else{
            this.planTargets.splice(index,1);
        }
    }

    //是否已经存在添加状态
    isAddingStatus():boolean{
        let flag = false;
        for (let i=0;i<this.planTargets.length;i++){
            if(this.planTargets[i].isAdding){
                flag = true;
                break;
            }
        }
        return flag;
    }

    //创建计划
    createPlan(plan: any, i: any){
        let that = this;
        if (that.transPlan(plan)) {
            if (!that.monitorTargetMap[that.planTargetReq['targetDefinitionId']]) {
                that.beforEdit = null;
                that.targetShow = false;
                that.tipShow = false;
                return ;
            }
            that.planTargetReq.name = that.monitorTargetMap[that.planTargetReq['targetDefinitionId']];
            that.tempData = Object.assign({}, that.planTargetReq);
            if (plan.id) {
                that.planTargetReq.id = plan.id;
                that.campaignTargetConfigResourceService.update(that.planTargetReq).then((data: any) => {
                    delete that.planTargetReq.id;
                    if(data._body){
                        let json = data.json();
                        if (json && (json.retCode || json.msgDes)) {
                            let error = that.errorHandlingService.getMsg(json);
                            if (error.code === 1) {
                                that.campaignDetailExceptionalCommunication.exceptionalMission(error);
                            } else if (error.code === 2) {
                                that.tipContent = error.message;
                                that.tipShow = true;
                            }
                        }
                    }else{
                        plan.isAdding = false;
                        that.beforEdit = null;
                        that.selectTarget[i] = plan;
                        that.planTargets[i]['name'] = that.planTargetReq.name;
                        that.targetShow = false;
                        that.tipShow = false;
                        //调取下拉List接口
                        that.getMonitorTargetList();
                    }
                    
                }).catch(err => {
                    that.tempData = null;
                    that.campaignDetailExceptionalCommunication.exceptionalMission('系统繁忙，请稍后重试!');
                });
            } else {
                that.campaignTargetConfigResourceService.create(that.planTargetReq).then((data: any) => {
                    if (data && (data.retCode || data.msgDes)) {
                        let error = that.errorHandlingService.getMsg(data);
                        if (error.code === 1) {
                            that.campaignDetailExceptionalCommunication.exceptionalMission(data);
                        } else if (error.code === 2){
                            that.tipContent = error.message;
                            that.tipShow = true;
                        }
                        return;
                    } 
                    that.planTargets[i]['id'] = data.id;
                    that.planTargets[i]['name'] = data.name;
                    plan.isAdding = false;
                    that.beforEdit = null;
                    that.selectTarget.push(data);
                    that.targetShow = false;
                    that.tipShow = false;
                    //调取下拉List接口
                    that.getMonitorTargetList();
                }).catch(err => {
                    that.tempData = null;
                    that.campaignDetailExceptionalCommunication.exceptionalMission('系统繁忙，请稍后重试!');
                })
            }
            // that.campaignTargetConfigResourceService.updateTarget(that.planTargetReq).then((data:any)=>{
            //     plan.isAdding = false;
            //     that.beforEdit = null;
            //     that.selectTarget.push(data);
            //     that.tipShow = false;
            //     //调取下拉List接口
            //     that.getMonitorTargetList();
            // }).catch(err=>{
            //     that.tempData = null;
            // });
        }else{
            if (!plan.selectedmonTarget) {
                that.targetShow = true;
            } else {
                that.tipShow = true;
            }
        }
    }

    //删除计划
    delPlan(plan:any,index:number){
        let that = this;
         if(that.isAddingStatus()){
            that.showMsg('info', '提示','还有未保存的计划目标。');
            return;
        }
        //删除最后一个计划目标时，判断是否有投放单元
        if(that.planTargets.length == 1 && that.campaignDetailDataCommunication.campaignLaunchUnits.length > 0){
            that.confirmationService.confirm({
				message: '有投放单元时，不能删除所有计划目标。',
				header: '提示', 
				accept: () => {
				}
			})
            return;
        }

        this.transPlan(plan);
        this.tempData = this.planTargetReq;
        this.campaignTargetConfigResourceService.removeTarget(this.planTargetReq).then((data:any)=>{
            if (data && (data.retCode || data.msgDes)) {
                //未处理页面报错
                that.campaignDetailExceptionalCommunication.exceptionalMission(data);
                return;
            }
            this.planTargets.splice(index,1);
            this.selectTarget.splice(index,1);
            this.targetShow = false;
            this.tipShow = false;
            //调取下拉List接口
            this.getMonitorTargetList();
        }).catch(err=>{
            this.tempData = null;
            this.campaignDetailExceptionalCommunication.exceptionalMission('系统繁忙，请稍后重试!');
        });
    }

    //编辑
    reEditPlan(index:number){
        if(!this.isAddingStatus()){
            this.beforEdit = JSON.stringify(this.planTargets[index]);
            this.planTargets[index].isAdding = true;
        }
    }

    //转换请求后端的数据
    transPlan(plan:any){
        let that = this;
        let re =  /^\+?[1-9][0-9]*$/;//正整数
        that.planTargetReq.targetDefinitionId = plan.selectedmonTarget;
        that.planTargetReq.metricType = plan.selectedExpReach;
        that.planTargetReq.value = plan.reachCount;
        that.planTargetReq.campaignId = that.campaignId;
        if(that.planTargetReq.targetDefinitionId && that.planTargetReq.metricType){
            if(re.test(that.planTargetReq.value)){
                return true;
            }else{
                return false;
            }

        } else {
            return false;
        }
    }

    //转换后端返回的数据格式
    respTrans(data:any){
        let tempTarget: SelectItem[] = [];
        let json = {
            label: data.name,
            value: data.targetDefinitionId
        };
        tempTarget.push(json);
        tempTarget = tempTarget.concat(this.monitorTarget);
        let plan = {
            "isAdding": false,
            "monitorTarget": tempTarget,
            "selectedmonTarget": data["targetDefinitionId"],
            // "expectedReach":this.expectedReach,
            "selectedExpReach": data["metricType"],
            "reachCount": data['value'],
            "id": data.id,
            "name": data['name']
        };
        this.planTargets.push(plan);
    }

    //检查计划目标是否重复插入  TODO 占时不用 逻辑也有问题
    checkTarget(data:any){
        let that = this;
        for(let i = 0;i<that.selectTarget.length;i++){
            let plan = that.selectTarget[i];
            if(data.targetDefinitionId == plan.targetDefinitionId && data.metricType == plan.metricType){
                if(this.beforEdit){//判断是修改已存在的计划目标
                    if(JSON.parse(this.beforEdit).selectedmonTarget != plan.targetDefinitionId || JSON.parse(this.beforEdit).selectedExpReach != plan.metricType){
                        return false;
                    }
                }else{
                    return false;
                }
            }
        }
        return true;
    }

    //展示提示信息
    showMsg(msgType:string, summary: string, msg:string){
        let that = this;
        that.msgs = [];
        that.msgs.push({severity:msgType, summary:summary, detail:msg});
    }
    //输入change
    inputChange (){
        this.targetShow = false;
        this.tipShow = false;
    }
}
