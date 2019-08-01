import { Component, Input, Output, EventEmitter } from '@angular/core';
import { 
    DropdownModule,
    Message,
    DialogModule,
    ButtonModule,
    SelectItem
} from 'primeng/primeng';
import { ConfirmationService } from "primeng/components/common/api";
import { ErrorHandlingService } from './../../../services/exceptional/error-handling.service';
import { CampaignResourceService } from './../../../services/campaign/campaign.resource.service';
import { PipelineDefinitionResourceService } from './../../../services/admin/pipeline-definition.resource.service';
@Component({
    selector: 'process-list',
    templateUrl: 'process-list.component.html',
    styleUrls: ['process-list.component.css'],
    providers: [ConfirmationService,ErrorHandlingService]
})

export class ProcessListComponent {
    msgs: Message[] = [];
    acceptLabel: string = '确认'; //删除弹框按钮默认显示
    rejectLabel: string = '取消'; //删除弹框按钮默认显示
    searchName: any = '';       //搜索名字
    updateTableList:any = [];   //查询的已经提交过的列表数据

    currentRows:any=10;
    queryListParam :any = {}; //查询页码
    value: any = {              //分页配置
        totalRecords: 0,        //总条数
        rows: this.currentRows, //每页显示条数
        pageLinkSize: 10,       //页码显示数量
        rowsPerPageOptions: [10, 20, 50, 100] //条数切换
    };
    searchParam: any = {};
    
    isActive: boolean = false; //活动被占用提示
    
    selectedPublisher: any; //选中的发布者
    campaigns: SelectItem[]; //所有的活动
    selectedCampaign: any; //选中的所属活动

    statusMap: any = {
        1:"草稿", //草稿
        2:"测试通过",//测试通过
        3:"申请上线",//上线申请
        4:"审批未通过",//审批未通过
        5:"已上线",//已上线
        6:"运行中",
        7:"已下线",//已下线
        8:"流程已结束",//流程已结束
        9:"流程测试中"
    };//状态对应的code

    constructor (
        private confirmationService:ConfirmationService,
        public errorHandlingService: ErrorHandlingService,
        private campaignService: CampaignResourceService,
        private pipelineDefinitionResourceService: PipelineDefinitionResourceService
    ) {
        let that = this;
        that.campaigns = [];
        that.queryCampaigns();

        that.queryListParam.page = 1;
        that.queryListParam.pageSize = 10;
        that.queryListParam.statusList = [3,5,6];
        that.queryMktProcess();
    }

    //查询营销活动
    queryCampaigns(){
        let that = this;
        that.campaignService.query({"pageSize":9999})
        .then((data:any)=>{
            if(data && (data.retCode || data.msgDes)) {
                let err = that.errorHandlingService.getMsg(data);
                that.showMsg('Error',err.message);
                return;
            }
            data = data.data;
            for(let i = 0; i < data.length; i++){
                that.campaigns.push({label:data[i].name, value:data[i]});
            }
        })
    }

    //查询营销流程
    queryMktProcess(){
        let that = this;
        that.pipelineDefinitionResourceService.query(that.queryListParam)
        .then((data:any)=>{
            if(data && (data.retCode || data.msgDes)) {
                let err = that.errorHandlingService.getMsg(data);
                that.showMsg('Error',err.message);
                return;
            }
            that.updateTableList = data.data;
            that.value.totalRecords = data.total;
        }).catch(err=>{

        })
    }

    //营销流程操作
    operation(index: number,data: any,status: number){
        let that = this;
        //提示语
        let reminder = "",successReminder = "";

        if(status == 5){
            reminder = '您确定要上线"'+data.name+'"营销流程 ?';
            successReminder = '上线成功！';
        }else if(status == 7){
            reminder = '您确定要下线"'+data.name+'"营销流程 ?';
            successReminder = '下线成功！';
        }else if(status == 2){
            reminder = '您确定要驳回"'+data.name+'"营销流程 ?';
            successReminder = '操作成功！';
        }
        that.confirmationService.confirm({
            message: reminder,
            header: '提示', 
            accept: () => {
                if(status == 5){
                    that.pipelineDefinitionResourceService.onlineProcess(data.id).then((data: any) => {
                        //   console.log("data==>",data);
                        that.showMsg("success",successReminder);
                        that.queryMktProcess();
                    }).catch()
                }else if(status == 7){
                    that.pipelineDefinitionResourceService.offlineProcess(data.id).then((data: any)=>{
                        that.showMsg("success",successReminder);
                        that.queryMktProcess();
                    }).catch()
                }else if(status == 2){
                    that.pipelineDefinitionResourceService.testpassProcess(data.id).then((data: any)=>{
                        //  console.log("data==>",data);                        
                        that.showMsg("success",successReminder);
                        that.queryMktProcess();
                    }).catch()
                }

                /*that.pipelineDefinitionResourceService.updateStatus(data.id,status).then((data:any) =>{
                    that.showMsg("success",successReminder);
                    that.queryMktProcess();
                }).catch();*/
            }
        });
    }

    //点关闭按钮触发
    changeDialogHide (){

    }
    //关闭提示弹框
    noticeDialogHide (){
        this.isActive = false;
    }
    //搜索
    search (){
        let that = this;
        if(that.searchName){
            that.queryListParam['name'] = that.searchName
        }
        if(that.selectedPublisher){
            that.queryListParam['creator'] = that.selectedPublisher
        }
        if(that.selectedCampaign){
            that.queryListParam['campaignId'] = that.selectedCampaign.id;
        }
        that.queryMktProcess();
    }
    //重置
    cancelSearch (){
        let that = this;
        that.searchName = "";
        that.selectedPublisher = "";
        that.selectedCampaign = "";

        that.queryListParam = {
            'page': 1,
            'pageSize': 10,
            'statusList': [3,5,6]
        }
    }
    //分页
    paginate(params: any) {
        let that = this;
        that.currentRows = params.rows;
        that.queryListParam.page = params.page + 1;
        that.queryMktProcess();
    }
    //展示提示信息
    showMsg(msgType:string,msg:string){
        let that = this;
        that.msgs = [];
        that.msgs.push({severity:msgType, summary:msgType+' Message', detail:msg});
    }
}