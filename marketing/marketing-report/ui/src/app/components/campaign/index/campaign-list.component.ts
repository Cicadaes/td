import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Router } from '@angular/router';
import {SelectItem, ConfirmationService, Message} from "primeng/components/common/api";
import { CampaignModel } from './../../../models/campaign/campaign.model';
import { CampaignResourceService } from './../../../services/campaign/campaign.resource.service';
import { ErrorHandlingService } from "../../../services/exceptional/error-handling.service";
import { CampaignDeleteCommunicationService } from "../../../services/communication/campaign-delete.communication.service";

@Component({
    selector: 'campaign-list',
    templateUrl: 'campaign-list.component.html',
    styleUrls: ['campaign-list.component.css'],
    providers: [ConfirmationService]
})

export class CampaignListComponent {
    campaignStatus:SelectItem[];

    selectedCampaignStatus:string = '';

    campaigns: any = {};

    queryListParam :any = {};

    message:string = "暂无数据";

    downloadUrl:string = `${this.campaignService.baseUrl}/campaign/campaigns/download?`;
    pageNum:string = '';
    currentRows:any=10;

    getDataListTimeOut: any;   //用于存放列表搜索时 生成Timeout的id

    value: any = {
        totalRecords: 0, //总条数
        rows: this.currentRows, //每页显示条数
        pageLinkSize: 10, //页码显示数量
        rowsPerPageOptions: [10, 20, 50, 100] //条数切换
    }
    //半年前的时间
    halfYear:number = 365 / 2 * 24 * 3600 * 1000;

    msgs: Message[] = [];
    searchText: string = '';
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
            // start:new Date('Date.now() - this.halfYear'),
            start:new Date('2017-05-01'),
            end:new Date(Date.now() + this.halfYear)
        }
    };

    @Output() changeLoading = new EventEmitter<boolean>();

    @Output() errorMessage = new EventEmitter<any>();

    @Output() updateCampaignList = new EventEmitter<any>(); // 用来更新甘特图里的数据

    loading: boolean = true;

    cloneId: number;//克隆的活动ID

    showNewMarketing: boolean = false;//克隆弹框

    constructor(
        private campaignService:CampaignResourceService,
        private confirmationService: ConfirmationService, 
        public errorHandlingService: ErrorHandlingService,
        public campaignDeleteCommunicationService: CampaignDeleteCommunicationService,
        public router: Router
    ){

        this.campaignStatus = [];
        this.campaignStatus.push({label:"全部",value:''});
        this.campaignStatus.push({label:"等待开始",value:'1'});
        this.campaignStatus.push({label:"进行中",value:'2'}); 
        this.campaignStatus.push({label:"已结束",value:'3'});
        
        //初始化查询过滤（查询近半年的营销活动）
        var curDate = new Date().getTime();
        var halfDate = 1493596800000;
        this.queryListParam.startTimeLong = halfDate;
        this.queryListParam.endTimeLong = new Date(Date.now() + this.halfYear).getTime();
        this.queryListParam.page = 1;
        this.queryListParam.pageSize = 10;
        this.queryCampaigns();
        
    }

    //营销活动下载
    downloadCampaignList(){
        let url = this.downloadUrl + this.getDownLoadParams(this.queryListParam);
        window.location.href = this.downloadUrl + this.getDownLoadParams(this.queryListParam);
    }

    //查询营销活动
    queryCampaigns(){
        let that = this;
        that.campaignService.query(this.queryListParam)
        .then((data:any)=>{
            if(data && (data.retCode || data.msgDes)) {
                let err = that.errorHandlingService.getMsg(data);
                that.errorMessage.emit(err.message);
                return;
            }
            this.loading = false;
            this.changeLoading.emit(this.loading);
            this.campaigns = data;
            this.value.totalRecords = data.total;
        }).catch(err=>{
            // this.errorMessage.emit('系统繁忙，请稍后再试!');
        })
    }

    //清空查询内容
    delText(){
        this.searchText = '';
        this.queryListParam.name ="";
        this.queryCampaigns();
    }
    //分页
    paginate(params: any) {
        this.currentRows = params.rows;
        this.queryListParam.page = params.page + 1;
        this.queryCampaigns();
    }
    
    detail(id: number){
        let that = this;
        //跳转详情页现在和创建页面一样 需要通过参数来判断是创建还是详情页 参数未加
        this.router.navigate(['/marketing', id]);
        this.changeLoading.emit(true);
    }

    report(id: number) {
        //跳转营销效果报告 需要通过参数来让页面知道是哪个活动 参数未加
        //感觉需要加loading
        this.router.navigate(['/marketing/report', id]);
        this.changeLoading.emit(true);
    }

    //删除confirm
    delConfirm(data: any){
        let that = this;
        that.confirmationService.confirm({
            message: '该删除行为不可逆,是否继续删除“' + data.name + '”营销活动 ?',
            header: '删除营销活动', 
            accept: () => {
                this.campaignService.remove(data.id)
                .then((data:any)=>{
                    if (data._body) {
                        if(data._body && (data._body.retCode || data._body.msgDes)) {
                            let err = that.errorHandlingService.getMsg(data);
                            that.errorMessage.emit(err.message);
                            return;
                        }
                    }
                    that.updateCampaignList.emit();
                    this.queryCampaigns();
                    that.campaignDeleteCommunicationService.deletCampaignMission(true);
                }).catch(err=>{})
            }
        });
    }

    //时间控件改变后查询
    onSelect(date: any) {
        //选择时间后获取列表页
        this.queryListParam.startTimeLong = date.start;
        this.queryListParam.endTimeLong = date.end;
        this.queryListParam.page = 1;          //时间改变后从第一页开始查询
        this.queryCampaigns();
    }

    //根据状态查询
    changeStatus(data :any){
        this.queryListParam.page = 1;
        this.queryListParam.status = data.value;
        this.queryCampaigns();
        this.changeLoading.emit(true);
    }

    //转换下载的Url
    getDownLoadParams(params: any): string {
        let paramString = "";
        for (let key in params) {
            paramString += key + "=" + params[key] + "&";
        }
        return paramString.substr(0, paramString.length - 1);
    }

    //根据name查询
    searchByName(){
        let that = this;
        that.loading = true;
        that.queryListParam.page = 1;
        that.queryListParam.name = that.searchText;
        if (that.getDataListTimeOut) {
            clearTimeout(that.getDataListTimeOut);
        }
        that.getDataListTimeOut = setTimeout(function () {
            that.changeLoading.emit(that.loading);
            that.queryCampaigns();       
        }, 1000);
    }

    //克隆活动
    cloneCampaign(data: any){
        // console.log("data==>",data);
        let that = this;
        that.cloneId = data.id;
        that.showNewMarketing = !that.showNewMarketing;
    }

    //点击活动时间排序
    sortDate (){
        //TODO排序调接口
    }

    hideMarketingDialog(show :boolean){
        this.showNewMarketing =show;
    }
}