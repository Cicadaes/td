import { Component, Input, Output, EventEmitter } from '@angular/core';
import {SelectItem} from "primeng/components/common/api";
import { Message, ConfirmationService } from 'primeng/primeng';

import { UtilesService } from './../../../../common/utiles.service';
import { CampaignTargetConfigResourceService } from "../../../../services/campaign/campaign_target_config.resource.service";
import { CampaignTargetDefinitionResourceService } from "../../../../services/admin/campaign_target_definition.resource.service";
import { CampaignDetailExceptionalCommunication } from "../../../../services/exceptional/campaign-detail-exceptional.service";
import { CampaignDetailDataCommunication } from './../../../../services/communication/campaign-detail-data.communication.service';
import { ErrorHandlingService } from "../../../../services/exceptional/error-handling.service";
import {  Router, ActivatedRoute  } from "@angular/router";
import * as moment from 'moment';
import { PipelineDefinitionResourceService } from "../../../../services/admin/pipeline-definition.resource.service";
import { PipelineEquityConfigDefinitionResourceService } from '../../../../services/campaign/pipeline-equity-config-definitions.resource.service';

@Component({
    selector: 'mkt-process',
    templateUrl: 'mkt-process.component.html',
    styleUrls: ['mkt-process.component.css'],
    providers: [
        UtilesService,
        CampaignTargetConfigResourceService, 
        CampaignTargetDefinitionResourceService, 
        ConfirmationService, 
        PipelineDefinitionResourceService,
        PipelineEquityConfigDefinitionResourceService
    ]
})

export class MktProcessComponent {
    @Input() campaignId:number; // 营销活动id
    @Input() equityList: any[]; // 权益设置列表
    @Input() campaignStatus: number; // 营销活动状态
    @Input() processResourceList: any = []; // 营销流程列表   
    @Input() userRight: string; // 用户权限 
    @Input() campaignStartTime: any;
    @Input() campaignEndTime: any;

    @Output() changeLoading = new EventEmitter<boolean>();  
    @Output() getProcessResourceList = new EventEmitter();  // 获取音效流程列表

    msgs: any; // 系统提示信息
    marginReConfigBool: boolean = false; // 余量重配状态
    warnTip: string = '余量不能超过总量！'; // 提示语内容s

    constructor(
        public utilesService: UtilesService,
        private confirmationService: ConfirmationService,
        public errorHandlingService: ErrorHandlingService,
        public campaignDetailDataCommunication: CampaignDetailDataCommunication,
        public campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication,
        public pipelineDefinitionResourceService: PipelineDefinitionResourceService,
        public pipelineEquityConfigDefinitionResourceService: PipelineEquityConfigDefinitionResourceService,
        private route: ActivatedRoute,
        private router: Router,
    ){
        let that = this;
    }

    ngOnInit(){
        let that = this;
    }

    // 余量 和 配比 联动
    preAndMarginRel(index1: number,index2: number, isCounter: boolean) {
        let that = this;
        that.processResourceList[index1].pipelineEquityConfigDefinitionDtos.map((initEl: any) => {
            if(isCounter) {
                initEl.precent = Math.round(initEl.count / initEl.total * 100 * 10) / 10;
            }else {
                initEl.count = Math.round(initEl.total * initEl.precent / 100);
            }
        }); 
        that.checkMarginStandard(index1, index2);
    }

    // 检查余量是否规范  -- 不能超出100%
    checkMarginStandard(index1:number, index2: number) {
        let that = this;
        let precent:any = {}; // precent的value作为权益设置的和

        // 初始化precent列表，并且让所有的value值都为0
        for(let i = 0; i < that.equityList.length; i++) {
            precent[i] = 0;
        }

        // 计算每一个权益设置总量的和
        for(let m = 0; m < that.processResourceList.length; m++) {
            let prEq = that.processResourceList[m];

            for(let n = 0; n < prEq.pipelineEquityConfigDefinitionDtos.length; n++) {
                precent[n] += Math.round(prEq.pipelineEquityConfigDefinitionDtos[n].count);
                that.processResourceList[m].pipelineEquityConfigDefinitionDtos[n]['isRight'] = true;
            }
        }

        // 如果配置的总量之和大于它实际总量，那么提示错误
        for(let m = 0; m < that.processResourceList.length; m++) {
            let prEq = that.processResourceList[m];

            for(let n = 0; n < prEq.pipelineEquityConfigDefinitionDtos.length; n++) {
                if(precent[n] > that.equityList[n].total) {
                    that.processResourceList[index1].pipelineEquityConfigDefinitionDtos[n]['isRight'] = false;
                    that.warnTip = '余量不能超过总量！';
                }
            }
        }

    }

    // 检查余量的权益配置之间是否有问题
    checkMarginEquityConfig() {
        let that = this;
        for(let i = 0; i < that.processResourceList.length; i++) {
            let initEl = that.processResourceList[i].pipelineEquityConfigDefinitionDtos;
            for(let j = 0; j < initEl.length; j++) {
                if(!initEl[j].isRight) {
                    return true;
                }
            }
        }
    }

    // 余量重配
    reassignment() {
        let that = this;
        that.marginReConfigBool = true;
        that.processResourceList.map((prEl: any) => {
            prEl['isAdding'] = true;
        });
    }

    // 确认重配
    confirmReassignment() {    
        let that = this;
        let next = that.checkMarginEquityConfig();
        if(next) {
            that.showMsg('info', '提示','余量配比不能超过100%！');
            return;
        }
        that.marginReConfigBool = false;
        that.processResourceList.map((prEl: any) => {
            prEl['isAdding'] = false;
        });
        let equityConfigArr:any = [];
        
        that.processResourceList.map((prEl: any) => {
            prEl.pipelineEquityConfigDefinitionDtos.map((initEl: any) => {
                let precentStr: number = initEl.precent * 1;
                let initEqConfig = {
                    "code": initEl.code,
                    "count": Math.round(initEl.count),
                    "createBy": initEl.createBy,
                    "creator": initEl.creator,
                    "equityConfigId": initEl.equityConfigId,
                    "id": initEl.id,
                    "name": initEl.name,
                    "pipelineDefinitionId": initEl.pipelineDefinitionId,
                    "precent": precentStr.toFixed(1),
                    "tenantId": prEl.tenantId
                };
                equityConfigArr.push(initEqConfig);
            });
        });
        
        that.pipelineEquityConfigDefinitionResourceService.update(equityConfigArr)
        .then((data) => {
            that.getProcessResourceList.emit();
            if(data._body) {
                let body = JSON.parse(data._body);
                if(body.msgDes) {
                    that.error('权益数量越界！');               
                }
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    // 取消重配
    canelReassignment() {
        let that = this;
        that.marginReConfigBool = false;
        that.getProcessResourceList.emit();
    }

    // 编辑余量内容
    editMarginContent(index: number, status: number) {
        let that = this;
        that.changeLoading.emit(true);        
        let url = '/marketing/' + that.campaignDetailDataCommunication.campaignId + '/automation/' + that.processResourceList[index].id;
        that.router.navigate([url]);
    }

    // 删除营销过程
    deletePipeline(id: number) {
        let that = this;
        let pipelineId = id;
        that.confirmationService.confirm({
            message: '该删除行为不可逆，是否继续删除此营销流程？',
            header: '删除营销流程', 
            accept: () => {
				that.pipelineDefinitionResourceService.remove(pipelineId).then((data) => {
                    that.getProcessResourceList.emit();
                }).catch((err) => {
                    that.error('系统繁忙，请稍后再试！');
                });
            }
        });
    }


    //展示提示信息
    showMsg(msgType:string, summary: string, msg:string){
        let that = this;
        that.msgs = [];
        that.msgs.push({severity:msgType, summary:summary, detail:msg});
    }

    addTab() {
        this.changeLoading.emit(true);
        let that = this;
        let diagram: any = {
            nodeDefinitionList: [],
            edgeDefinitionList: []
        }
        let startTime = that.campaignDetailDataCommunication.campaignData.startTime;
        if (startTime < new Date()) {
            startTime = new Date(moment().startOf('day').add(1, 'd').format('YYYY-MM-DD HH:mm:ss'));
        }

        let params = {
            version: '1.0',
            campaignId: that.campaignDetailDataCommunication.campaignId,
            startTime: startTime,
            endTime: that.campaignDetailDataCommunication.campaignData.endTime,
            diagram: JSON.stringify(diagram),
            status: 0
        }
        that.pipelineDefinitionResourceService.savePipeLine(0, params).then((result: any) => {
            if(result.retCode || result.msgDes) {
                that.error(result.msgDes || result.errMessage);
                return;
            }
            let url = '/marketing/' + that.campaignDetailDataCommunication.campaignId + '/automation/' + result.id;
            this.router.navigate([url]);
        }).catch()
    }


    /**
     * 如果营销活动是等待开始状态，
     * @param {number} status 
     * @param {boolean} isAdding 
     * @returns {boolean}
     */
    editFlagWhenWait(status: number, isAdding: boolean) {
        if(status === 1 || status === 2 || status === 4 || status === 6) {
            return isAdding;
        }else {
            return false;
        }
    }

    // 判断是否可以编辑
    editFlag(status: number, isAdding: boolean) {
        if(status === 1 || status === 2 || status === 4 || status === 7) {
            return isAdding;
        }else {
            return false;
        }
    }

    // 判断是否可以删除
    deleteFlag(status: number, campaignStatus: number) {
        if(status === 1 || status === 4 || status === 2) {
            return true;
        }else {
            return false;
        }
    }

    /**
     * 
     * 
     * @param {number} status 
     * @param {boolean} isAdding 
     */
    lookoverFlag(status: number) {
        if(status === 3 || status === 5 || status === 6 || status === 8) {
            return false;
        }else {
            return true;
        }
    }

    /**
     * 1;//草稿                         查看   修改   删除   保存   校验   测试
     * 2;//  校验通过 or 测试通过 -- 草稿  查看   提交   修改
     * 3;// 上线申请 -- 待审核            查看
     * 4;// 审批未通过  -- 审核未通过      查看   修改   删除    保存  提交
     * 5;// 已上线               查看
     * 6;// 运行中    查看
     * 7;// 已下线  -- 已下线            查看   修改    提交
     * 8;// 流程已结束 -- 已结束          查看
     * 9;// 流程测试中
     * @param {number} status
     * @return {object} { tip:'草稿', color: '#43A3FB' }
     * 
     */
    getProcessStatus(status: number) {
        let that = this;
        // 如果营销活动是已结束状态，那么所有的营销流程都将是已结束的，后台以后加验证，前台先限制
        if(that.campaignStatus === 3) {
            return { tip:'已结束', color: '#D9DBE0' };
        }
        switch(status) {
            case 1: return { tip:'草稿', color: '#43A3FB' };
            case 2: return { tip:'草稿', color: '#43A3FB' };
            case 3: return { tip:'待审核', color: '#FF7979' };
            case 4: return { tip:'审核未通过', color: '#F1B154' };
            case 5: return { tip:'等待开始', color: '#59D2C4' };
            case 6: return { tip:'进行中', color: '#59D2C4'}
            case 7: return { tip:'已下线', color: '#D9DBE0' };
            case 8: return { tip:'已结束', color: '#D9DBE0' };
            case 9: return { tip:'流程测试中', color: '#43A3FB' };
            default: return { tip:'未知状态', color: '#43A3FB' };
        }
    }

    // 从 precise-crowd-form.component.ts 里抽的error处理函数
    error(err: any) {
        let that = this;
        that.campaignDetailExceptionalCommunication.exceptionalMission(err);
    }

    resolveNaN(remain: number, count: number) {
        let result = remain / count;
        if(isNaN(result)) {
            return 0;
        }
        return result;
    }

    lastProcessName: string = ''; // 保存旧的流程名

    editProcessName(pr: any) {
        let that = this;
        that.lastProcessName = pr.name;
        pr.processNameEditing = true;
        // console.log(pr)
    }

    cancelProcessName(pr: any) {
        let that = this;
        pr.name = that.lastProcessName;
        pr.processNameEditing = false;
    }

    saveProcessName(pr: any) {
        let that = this;
        pr.name = pr.name?that.utilesService.trim(pr.name):pr.name;
        if (!pr.name) {
            that.showMsg('info', '提示','营销流程名称不能为空!');
            return;
        }
        if(pr.name.length > 26) {
            that.showMsg('info', '提示','营销流程名称不能超过26个字符!');	
			return;		
        }
        that.pipelineDefinitionResourceService.updatePipeline(0, pr).then((data: any) => {
			that.lastProcessName = '';
            pr.processNameEditing = false;
		}).catch();
    }

    onSelect(pr: any, date: any) {
        let that = this;
        
        let preData = {startTime: pr['startTime'], endTime: pr['endTime']};

        pr['startTime'] = date.start;
        pr['endTime'] = date.end;

        that.pipelineDefinitionResourceService.updatePipeline(0, pr).then((data: any) => {
            let result = data._body && JSON.parse(data._body);

            if (result && (result.retCode || result.msgDes)) {
                that.error(result.msgDes || result.errMessage);
                return;
            }
        }).catch(err=>{
            pr['startTime'] = preData.startTime;
            pr['endTime'] = preData.endTime;
        })
    }
}
