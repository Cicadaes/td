import { EffectService } from './../../../../services/report/effect.communication.service';
import { Component, Input } from '@angular/core';
import { ErrorHandlingService } from "../../../../services/exceptional/error-handling.service";
import { CampaignDetailExceptionalCommunication } from "../../../../services/exceptional/campaign-detail-exceptional.service";

@Component({
    selector: 'goal-table',
    templateUrl: 'goal-table.component.html',
    styleUrls: ['goal-table.component.css']
})

export class GoalTableComponent {
    display: boolean = false;

    title: string = '';

    @Input() campaignId:number;

    formatedDatas:any[]=[];

    @Input() segmentGroup: any;

    promotionId:number;//用于查看详细的报告

    promotionTp:number;//用于点击投放报告时判断是什么投放方式  1push 2sms

    promitionIdList:any = [];

    isDialogReport: boolean = false;//区分是否是弹出框的报告页面

    newArr:any; 
    @Input() set segments(data: any){
        this.promitionIdList = data;
        if(this.campaignId){
            this.getEffectDetail();
        }
    }

    constructor(
        private effectService:EffectService,
        private errorHandlingService: ErrorHandlingService,
        private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication
    ){

    }

    getEffectDetail(){
        //投放目标贡献详情
        // let that = this;
        let param = {
            "campaignId":this.campaignId,
            "promitionIdList":this.promitionIdList
        }
        this.effectService.getEffectDetail(this.campaignId).then(data => {
            if (data && (data.retCode || data.msgDes)) {
                this.campaignDetailExceptionalCommunication.exceptionalMission(data);
                return;
            }
            // that.formatedDatas = [];
            let as= this.formatRespData(data);
            this.formatedDatas = [].concat(as);
        }).catch(err => {
            this.campaignDetailExceptionalCommunication.exceptionalMission(err);
        });
    }

    /**
     * 将后端返回的数据重新生成
     *
     * 原数据格式：[{"crowdName":"测试人群创建","unitOverview":[{"targetConfigId":65,"actualValue":256,"totalActualValue":329,"expect":122222,"name":"活跃用户"},{"targetConfigId":67,"actualValue":529,"totalActualValue":779,"expect":345654,"name":"cube_test"}],"segments":[{"segmentId":28,"segmentName":"123","items":[{"targetConfigId":65,"actualValue":912,"totalActualValue":654,"expect":122222,"name":"活跃用户"},{"targetConfigId":67,"actualValue":853,"totalActualValue":591,"expect":345654,"name":"cube_test"}]},{"segmentId":29,"segmentName":"测试1","items":[{"targetConfigId":65,"actualValue":404,"totalActualValue":255,"expect":122222,"name":"活跃用户"},{"targetConfigId":67,"actualValue":433,"totalActualValue":846,"expect":345654,"name":"cube_test"}]},{"segmentId":30,"segmentName":"测试1","items":[{"targetConfigId":65,"actualValue":712,"totalActualValue":41,"expect":122222,"name":"活跃用户"},{"targetConfigId":67,"actualValue":125,"totalActualValue":124,"expect":345654,"name":"cube_test"}]}]},{"crowdName":"人群-sh","unitOverview":[{"targetConfigId":65,"actualValue":67,"totalActualValue":764,"expect":122222,"name":"活跃用户"},{"targetConfigId":67,"actualValue":608,"totalActualValue":82,"expect":345654,"name":"cube_test"}],"segments":[{"segmentId":31,"segmentName":"人群测试","items":[{"targetConfigId":65,"actualValue":573,"totalActualValue":386,"expect":122222,"name":"活跃用户"},{"targetConfigId":67,"actualValue":443,"totalActualValue":343,"expect":345654,"name":"cube_test"}]},{"segmentId":32,"segmentName":"人群sh测试2","items":[{"targetConfigId":65,"actualValue":380,"totalActualValue":238,"expect":122222,"name":"活跃用户"},{"targetConfigId":67,"actualValue":354,"totalActualValue":890,"expect":345654,"name":"cube_test"}]},{"segmentId":36,"segmentName":"string","items":[{"targetConfigId":65,"actualValue":767,"totalActualValue":129,"expect":122222,"name":"活跃用户"},{"targetConfigId":67,"actualValue":387,"totalActualValue":497,"expect":345654,"name":"cube_test"}]},{"segmentId":37,"segmentName":"string","items":[{"targetConfigId":65,"actualValue":174,"totalActualValue":157,"expect":122222,"name":"活跃用户"},{"targetConfigId":67,"actualValue":626,"totalActualValue":62,"expect":345654,"name":"cube_test"}]}]}]
     *
     * @param data
     */
    formatRespData(data:any){
        let that = this;
        const arr = [];
        if(data && data.length > 0){
            for(let i = 0; i < data.length; i++) {
                //转换投放数据
                let pros = data[i]['segments'];
                if(pros && pros.length > 0){
                    for (let j = 0; j < pros.length; j++){
                        let obj: any = {};
                        obj['proInfo'] = {};
                        for (let key in pros[j]) {
                            if ('items' != key) {
                                obj['proInfo'][key] = pros[j][key];
                            } else {
                                obj[key] = pros[j][key];
                            }
                        }
                        obj['crowdName'] = data[i].crowdName;
                        obj['rowSpan'] = pros.length + 1;
                        //that.formatedDatas.push(obj);
                        arr.push(obj);
                    }

                    //转换总计数据
                    let oview = data[i]['unitOverview'];
                    let summary:any = {};
                    summary['crowdName'] = data[i].crowdName;
                    summary['proInfo'] = {
                        segmentName:'总计：',
                        segmentId: null
                    };
                    summary['items'] = [];
                    for(let k = 0; k < oview.length; k++){
                        summary['items'].push(oview[k]);
                        /*//动态设置表头
                        that.promotionGroup.push({
                            field: oview[k]['target']+oview[k]['tp'],
                            name: oview[k]['val']+'- 实际：'+oview[k]['actualVal'],
                            value:oview[k]['actualVal']
                        });*/
                    }
                    //that.formatedDatas.push(summary);
                    arr.push(summary);
                }
            }
        }
        return arr;
    }

    reportDetail(paramData:any){
        let that = this;
        if(paramData){
            that.promotionId = paramData.proInfo.segmentId;
            that.promotionTp = paramData.proInfo.channelDefinitionId || 1;
            that.title = "【" + paramData.proInfo.segmentName + "】投放效果报告";
            that.isDialogReport = true;
        }
        that.display = true;
    }
}