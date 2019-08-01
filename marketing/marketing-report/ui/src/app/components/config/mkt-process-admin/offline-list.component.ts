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
import { PipelineDefinitionResourceService } from './../../../services/admin/pipeline-definition.resource.service';
import { CampaignResourceService } from './../../../services/campaign/campaign.resource.service';

@Component({
    selector: 'offline-list',
    templateUrl: 'offline-list.component.html',
    styleUrls: ['offline-list.component.css'],
    providers: [ConfirmationService,ErrorHandlingService]
})

export class OfflineListComponent {
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

    selectedOperator: any; //选中的操作者

     @Input() nodeData: any;

    @Input() startTime: any;

    @Input() endTime: any;

    marketingValue: any = {
        showIcon: true,
        ranges: [{
            label:'今天',day:1    
        },
        {
            label:'最近七天',day:7
        },
        {
            label:'最近一个月',day:30
        },
        {
            label:'季度',day:90
        }],
        dateRanges:{max:null, min:null},
        data:{
            start:"",
            end:""
        }
    };

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
        that.queryListParam.statusList = [7];
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
        }).catch(err=>{

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

    //时间控件改变后查询
    onSelect(date: any) {
        //选择时间后获取列表页
        this.queryListParam.updateTime1 = new Date(date.start).getTime();
        this.queryListParam.updateTime2 = new Date(date.end).getTime();
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
            that.queryListParam['campaignId'] = that.selectedCampaign.id
        }
        if(that.selectedOperator){
            that.queryListParam['updater'] = that.selectedOperator
        }
        that.queryListParam.page = 1;
        that.queryMktProcess();
    }
    //重置
    cancelSearch (){
        let that = this;
        that.searchName = '';
        that.selectedPublisher = "";
        that.selectedCampaign = "";
        that.selectedPublisher = "";
        that.selectedOperator = "";
        that.marketingValue.data = {
            start:"",
            end:""
        };

        that.queryListParam = {
            'page': 1,
            'pageSize': 10,
            'statusList': [7]
        }
    }
    //分页
    paginate(params: any) {
        this.currentRows = params.rows;
        this.queryListParam.page = params.page + 1;
    }
    //展示提示信息
    showMsg(msgType:string,msg:string){
        let that = this;
        that.msgs = [];
        that.msgs.push({severity:msgType, summary:msgType+' Message', detail:msg});
    }
}