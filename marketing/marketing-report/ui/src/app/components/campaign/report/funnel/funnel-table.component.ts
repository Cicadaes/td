import { Component,Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { CampaignFunnelConfigResourceService } from "../../../../services/campaign/campaign_funnel_config.resource.service";
import { CampaignDetailExceptionalCommunication } from "../../../../services/exceptional/campaign-detail-exceptional.service";

@Component({
    selector: 'funnel-table',
    templateUrl: 'funnel-table.component.html',
    styleUrls: ['funnel-table.component.css']
})

export class FunnelTableComponent {
    eventList: any[] = [];   //事件列表
    funnelList: any[] = [];  //数据列表
    // sortList: SelectItem[] = []; //排序列表
    // sort: string; //排序类型
    currentRows:any=10;
    value: any = {
        totalRecords: 0, //总条数
        rows: this.currentRows, //每页显示条数
        pageLinkSize: 10, //页码显示数量
    };
    param:any = {};  //获取列表参数
    pageNum: any = 1;
    private _funnelId: any;
    private _crowdIds: any=[];

    //储存人群对应的颜色，用作列表展示
    crowdColor: any = {};

    @Input() 
    set funnelId(funnelId: any){
        this._funnelId = funnelId;
        if (this._funnelId) {
            this.getFunnelDetailList();
        }
    };
    @Input()
    set crowdIds(crowdIds: any){
        this._crowdIds = [];
        if(this._funnelId){
            this.crowdColor = [];
            for(let i = 0; i < crowdIds.length; i++){
                this._crowdIds.push(crowdIds[i]['id']);
                this.crowdColor.push(crowdIds[i]['color']);
            }
            this.getFunnelDetailList();
        }
        this.pageNum = 1;
    };

    constructor(
        private campaignFunnelConfigResourceService: CampaignFunnelConfigResourceService,
        private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication
    ){
        
    }

    ngOnInit(){
    }

    //获取漏斗详情数据
    getFunnelDetailList(){
        let that = this;
        that.funnelList = [];
        that.param = { 
            "crowdIds": that._crowdIds,
            "page": that.pageNum,
            "pageSize": that.currentRows
        };
        
        that.campaignFunnelConfigResourceService.getFunnelDetail(that._funnelId, that.param)
        .then(data => {
            if (data && (data.retCode || data.msgDes)) {
                that.campaignDetailExceptionalCommunication.exceptionalMission(data);
                return;
            }
            if(data) {
                that.value.totalRecords = data.total;   //总条数赋值
                that.eventList = [];
                that.formateFunnelDetailData(data.data);
            }
        }).catch(err => {
            that.campaignDetailExceptionalCommunication.exceptionalMission(err);
        });
    }

    //处理漏斗详情接口返回的数据
    formateFunnelDetailData(data: any) {
        let that = this;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            let tempLength = data[i].length;
            for (let j = 0; j < tempLength; j++) {
                if (i === 0) {
                    that.eventList.push(data[i][j]);
                } else {
                    if (!that.funnelList[i - 1]) {
                        that.funnelList[i - 1] = {};
                    }
                    that.funnelList[i - 1][that.eventList[j]] = data[i][j];
                }
            }
        }
    }

    //分页
    paginate(params: any) {
        this.currentRows = params.rows;
        this.pageNum = params.page + 1; 
        this.getFunnelDetailList();
        
    }
}