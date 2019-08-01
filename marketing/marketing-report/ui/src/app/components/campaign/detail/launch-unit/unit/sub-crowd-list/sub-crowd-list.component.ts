import {Component, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from "primeng/components/common/api";
import { CrowdResourceService } from "../../../../../../services/campaign/crowd.resource.service";
import { CampaignDetailDataCommunication } from "../../../../../../services/communication/campaign-detail-data.communication.service";
import { SegmentCommunicationService } from "../../../../../../services/communication/segment.communication.service";
import { CampaignDetailExceptionalCommunication } from "../../../../../../services/exceptional/campaign-detail-exceptional.service";
import { ShowCreateSegmentCommunicationService } from "../../../../../../services/communication/show-create-segment.communication.service";
import { UnitDataCommunicationService } from '../../../../../../services/communication/unit-data.communication.service';

@Component({
    selector: 'sub-crowd-list',
    templateUrl: 'sub-crowd-list.component.html',
    styleUrls: ['sub-crowd-list.component.css'],
    providers: [ConfirmationService, CrowdResourceService]
})
export class SubCrowdListComponent {

    subCrowdList: any = [];
    total: number = 0;

    showLookalikeCrowdDialog: boolean = false;

    showCreatePutDialog: boolean = false;   //新建投放窗口
    
    parentId: any;

    unitId:any;

    dialogData: any = {
        tp: 'childCrowd'
    };

    defaultDownloadUrl: string;

    createPutCrowdId: number;   //创建投放的子人群Id

    createPutCrowdVersion: any; //创建投放的子人群版本

    searchData: string;   //搜索字段
    
    searchKeyCode: string = ''; //确定的搜索字段

    currentRows:any = 10;

    tempSetIntervalId: any;

    page: number = 1;

    display:boolean = false;
    value: any = {
        totalRecords: 0, //总条数
        rows: this.currentRows, //每页显示条数
        pageLinkSize: 10, //页码显示数量
        rowsPerPageOptions: [10, 20, 50, 100] //条数切换
    }

    acceptLabel: string = '确认更新';  //弹框按钮文字

    @Input() 
    set launchUnit (data: any) {
        let that = this;
        if (data) {
            that.parentId = {
                crowd_id: data.crowdId,
                parent_id: data.refId,
                parent_tp: data.crowdType
            };
            that.unitId = data.id;
        }
    };

    @Input() isFinish: any;    //活动是否结束

    constructor(
        private crowdResourceService: CrowdResourceService,
        private campaignDetailDataCommunication: CampaignDetailDataCommunication,
        private segmentCommunicationService: SegmentCommunicationService,
        private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication,
        private confirmationService: ConfirmationService,
        private showCreateSegmentCommunicationService: ShowCreateSegmentCommunicationService,
        private unitDataCommunicationService: UnitDataCommunicationService,
        public router: Router,
        public route: ActivatedRoute,
    ){
        let that = this;
        that.defaultDownloadUrl = crowdResourceService.baseUrl + crowdResourceService.getRouter;
        showCreateSegmentCommunicationService.hide$.subscribe((bl: boolean) => {
            that.showCreatePutDialog = bl;
            that.getChildCrowdList(1);
        })
    }

    ngOnInit() {
       let that = this;
       that.getChildCrowdList(1);
    }

    getChildCrowdList(page: number, keyCode?: string) {
        let that = this;
        let params: any = {
            parentId: that.parentId.crowd_id,
            refName: keyCode || '',
            page: page || 1,
            campaignId: that.campaignDetailDataCommunication.campaignId,
            pageSize: 10
        };
        that.crowdResourceService.getChildCrowdList(params).then(result => {
            if (result && (result.retCode || result.msgDes)) {
                that.campaignDetailExceptionalCommunication.exceptionalMission(result);
                return;
            }
            that.subCrowdList = result.data;
            that.value.totalRecords = result.total;
        }).catch(err => {
            that.campaignDetailExceptionalCommunication.exceptionalMission(err);
        });
    }

    recountCrowd(data: any, index: number) {
        let that = this;
        that.confirmationService.confirm({
            message: '人群更新过程可能耗时较长，请确认是否要更新人群',
            header: '更新人群', 
            accept: () => {
                that.crowdResourceService.recountCrowd(data.id).then(result => {
                    if (result && (result.retCode || result.msgDes)) {
                        that.campaignDetailExceptionalCommunication.exceptionalMission(result);
                        return;
                    }
                    that.tempSetIntervalId = setInterval(function () {
                        that.crowdResourceService.get(data.id).then(data => {
                            if (!data || !data.calc_status) {
                                clearInterval(that.tempSetIntervalId);
                                return 
                            }
                            that.subCrowdList[index].calc_status = data.calc_status;
                            if (data.calc_status <= 0) {
                                clearInterval(that.tempSetIntervalId);
                            } else if (data.calc_status === 2) {
                                that.subCrowdList[index].estimate_size = data.estimate_size;
                                that.subCrowdList[index].estimate_push = data.estimate_push;
                                that.subCrowdList[index].estimate_sms = data.estimate_sms;
                                that.subCrowdList[index].estimate_ad = data.estimate_ad;
                                clearInterval(that.tempSetIntervalId);
                            } else {
                                that.subCrowdList[index].status = data.status
                            }
                        });
                    }, 10000);
                }).catch(err => {});
            }
        });
    }

    hideLookalikeCrowdDialog(bl: boolean) {
        let that = this;
        that.showLookalikeCrowdDialog = bl;
        that.getChildCrowdList(1);
    }

    newSubCrowd(){
        let that = this;
        that.showLookalikeCrowdDialog = !that.showLookalikeCrowdDialog;
    }

    crowdPortrait(data: any){
        //查看人群画像 TODO传入人群id
        if (data.status != 2) {
            return ;
        }
        let that = this;
        let id = that.route.params['value'].id;
        let url = '/marketing/' + id + '/childPortrait';
        this.router.navigate([url, {crowdId: data.refId}]);
    }

    createPush(data: any){
        //创建投放
        let that = this;
        if (data.status != 2) {
            return ;
        }

        that.createPutCrowdId = data.id;
        that.createPutCrowdVersion = data.lastVersion;
        that.showCreatePutDialog = !that.showCreatePutDialog;
        that.segmentCommunicationService.subCrowdName = data.segmentId ? data.refName.substr(data.refName.lastIndexOf("-")+1) : data.refName;
        that.segmentCommunicationService.panelIndex = 0;
        that.segmentCommunicationService.unitId = that.unitId;
        that.segmentCommunicationService.isUpdate = 2;
        let json = {
            crowdId: that.createPutCrowdId,
            subCrowdVersion: that.createPutCrowdVersion,
            showCreatePutDialog: that.showCreatePutDialog,
            isSceneCrowd: that.unitDataCommunicationService.isSceneCrowd,
            segmentListLength: that.unitDataCommunicationService.segmentListLength,
            unitCrowdId: that.unitDataCommunicationService.crowdId,
            crowdVersion: that.unitDataCommunicationService.crowdVersion,
            crowdType: that.unitDataCommunicationService.crowdType,
            subCrowdId: data.id,
            subCrowdName: data.refName
        }
        that.showCreateSegmentCommunicationService.showDialogMission(json);
    }

    //分页
    paginate(params: any) {
        let that = this;
        that.currentRows = params.rows;
        that.page = params.page + 1;
        that.getChildCrowdList(params.page + 1, that.searchKeyCode);
    }

    search(event: any) {
        let that = this;
        that.page = 1;
        that.searchKeyCode = that.searchData;
        that.getChildCrowdList(that.page, that.searchKeyCode);
    }

    delText() {
        let that = this;
        that.page = 1;
        that.searchData = '';
        that.searchKeyCode = '';
        that.getChildCrowdList(that.page);
    }

    //获取下载信息
    getDownload(id:any){
        //debugger
        this.crowdResourceService.getDownload(id).then( (data:any) => {
            if (data.ok){
                //TODO 提示信息???
                this.display = true;
            }
        } ).catch(err => {
            console.log(err);
        });
    }
    //关闭弹框按钮
    afterDialogHide (){
        this.display = false;
    }
    //确定
    confirm (){
        this.afterDialogHide();
    }
    //取消
    cancel (){
        this.afterDialogHide();
    }
}