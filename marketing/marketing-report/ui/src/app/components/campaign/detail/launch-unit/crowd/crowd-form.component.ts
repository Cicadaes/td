import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CampaignDetailDataCommunication } from "../../../../../services/communication/campaign-detail-data.communication.service";
import { CampaignLaunchUnitResourceService } from "../../../../../services/campaign/campaign_launch_unit.resource.service";
import { CrowdResourceService } from "../../../../../services/campaign/crowd.resource.service";
import { CampaignDetailExceptionalCommunication } from "../../../../../services/exceptional/campaign-detail-exceptional.service";
import { IndexSerivice } from './../../../../../services/campaign/index.service';
import {
	SelectItem,
    Message
} from 'primeng/primeng';
import * as moment from 'moment';

@Component({
    selector: 'crowd-form',
    templateUrl: 'crowd-form.component.html',
    styleUrls: ['crowd-form.component.css'],
    providers: [CampaignLaunchUnitResourceService, CrowdResourceService]
})

export class CrowdFormComponent {
    show: boolean;
    showsence : string;

    getCrowdListTimeOut:any;//用于存放列表搜索时 生成Timeout的id

    defaultUrl: string;
    // defaultUrl: string = 'http://172.23.5.128';
    //defaultUrl: string = 'http://172.26.126.73:8080';

    src: string = this.defaultUrl + '/dmp-web/pageapi#/crowd/crowdCreate/lookalikeCrowd/new/crowdCreate';

    name: string = 'Lookalike人群';
    ht:string = '600'; // 弹框高度
    wt:string = '1030'; // 弹框宽度

    tp: string;
    crowdId: number;

    ourSystemParentId: number;   //营销管家中父人群Id

    parentTp: number;   //营销管家中父人群创建类型 1 lookalike 2 场景 3 历史人群 4 一方id上传 5 子人群

    userCrowdId: number;       //用户管家父人群Id

    crowdTypes: number;       //人群管理type

    selectCrowdId: any;    //选中的funnel id id为表的主键

    selectCrowdData: any;

    startDate: any;

    endDate: any;

    msgs: any = []; //错误提示用

    display: boolean;
    
    flag: boolean = true;

    listShow: boolean = false;
    getPostMessage: any = (e: any): void => {
        let that = this;
        if (e.data) {
            let data: any;
            try {
                data = JSON.parse(e.data);
            } catch (err) {
                data = e.data;
            }
            if (data === 'cancel') {
                that.show = false;
                that.goback();
                return;
            }
            let id: number;
            if (typeof data === 'object') {
                if (data.code === 1001) {
                    if (that.tp == 'lookalike') {
                        id = data.data.crowdId;
                    } else if (that.tp == 'scene') {
                        id = data.data.id;
                        that.startDate = moment(data.startDate).format('YYYY-MM-DD HH:mm:ss');
                        that.endDate = moment(data.endDate).format('YYYY-MM-DD HH:mm:ss');
                    } else if (that.tp == 'childCrowd') {
                        id = data.data.id;
                    }
                    if (!that.crowdId) {
                        that.save(data.data, id);   
                    } else {
                        that.update(data.data.name, that.crowdId);
                    }
                } else if (data.code === 1002) {
                    that.show = false;
                    that.goback();
                    return;
                } else if (data.code === 1003) {
                    that.msgs.push({severity: 'error', summary: '错误', detail: data.message});
                }
            }
        }
    };

    @Input()
    set showLookalikeCrowdDialog( bl: boolean) {
        let that = this;
        that.show = bl;
        
    }

    @Input() 
    set parentId (data: any) {
        let that = this;
        that.ourSystemParentId = data.crowd_id;
        that.userCrowdId = data.parent_id;
        that.parentTp = data.parent_tp;
        if (that.name == '新建子人群' && data.parent_id) {
            that.src = this.defaultUrl + '/dmp-web/pageapi#/crowd/crowdCreate/childCrowdCreate/new/' + that.userCrowdId;
        }
    };

    @Input()
    set dialogData (data: any) {
        let that = this;
        that.tp = data.tp;
        that.showsence = data.tp2 || '1';
        if (data.tp == 'lookalike') {
            that.name = 'Lookalike人群';
            that.ht = '550'; 
            that.wt = '800'; 
            that.crowdTypes = 1;
            that.crowdConfig.page = 1;
            that.getPersonCrowdSelectlList();
            if (!data.crowdId) {
                that.src = this.defaultUrl + '/dmp-web/pageapi#/crowd/lookalikeCrowd/new';
            } else if (data.crowdId) {
                that.crowdId = data.crowdId;
                that.src = this.defaultUrl + '/dmp-web/pageapi#/crowd/lookalikeCrowd/edit/' + data.crowdId;
            }
            
        } else if (data.tp == 'scene') {
            that.name = '场景人群';
            that.ht = '550'; 
            that.wt = '800'; 
            that.crowdTypes = 2;
            that.crowdConfig.page = 1;
            that.getPersonCrowdSelectlList();
            if (!data.crowdId) {
                that.src = this.defaultUrl + '/dmp-web/pageapi#/crowd/sceneCrowd/new';
            } else if (data.crowdId) {
                that.crowdId = data.crowdId;
                that.src = this.defaultUrl + '/dmp-web/pageapi#/crowd/sceneCrowd/edit/' + data.crowdId;
            }
        } else if (data.tp == 'childCrowd') {
            that.name = '新建子人群';
            if (that.userCrowdId) {
                that.src = this.defaultUrl + '/dmp-web/pageapi#/crowd/crowdCreate/childCrowdCreate/new/' + that.userCrowdId;
            }
        }
    }

    @Output() hideLookalikeCrowdDialog = new EventEmitter<boolean>();

    @Output() hideParentDialog = new EventEmitter<boolean>();

    crowdList: any = [];

    showLoadMore: boolean = false;//显示更多人群

    searchCrowdName: string;

    //人群分页信息
    crowdConfig: any = {
        page: 1,
        pageSize: 10,
        total: 1
    };

    constructor(
        public campaignDetailDataCommunication: CampaignDetailDataCommunication,
        public campaignLaunchUnitResourceService: CampaignLaunchUnitResourceService,
        private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication,
        private crowdResourceService: CrowdResourceService,
        private indexSerivice: IndexSerivice
    ) {
        let that = this;
        if (process.env.ENV == "developer") {
            that.defaultUrl = 'http://172.23.6.189';
        } else if (process.env.ENV == "production") {
            that.defaultUrl = 'http://medemo.tenddata.com';  //demo环境
        } else if (process.env.ENV == "test") {
            that.defaultUrl = 'http://172.23.5.49';     //测试环境  
        }

        if (window.addEventListener) {
            window.addEventListener('message', that.getPostMessage, false);
        } else if (window['attachEvent']) {
            window['attachEvent']('message', that.getPostMessage);
        }

        indexSerivice.firstRequest().then(() => {
            indexSerivice.show = true;
        });
    }

    afterDialogHide() {
        this.display = false;
        this.hideLookalikeCrowdDialog.emit(this.display);
        let oLabel = document.querySelector('.choice-box .ui-dropdown-label');
            if (oLabel) {
                oLabel['style'].opacity = 0;
            }

    }

    save(crowd: any, crowdId: number) {
        let that = this;
        let data: any = {
            campaignId: that.campaignDetailDataCommunication.campaignId,
            refId: crowdId,
            crowdName: crowd.name || crowd.tag.name,
            refCode: crowd.code || crowd.tag.code,
            crowdType: 1,
            description: crowd.description
        };
        if(crowd.source || crowd.tag.source) {
            data.source = crowd.source || crowd.tag.source;
        }
        //TODO 这里错误提示方式需要确认
        // if (!data.campaignId) {
        //     that.campaignDetailExceptionalCommunication.exceptionalMission('系统繁忙，请稍后重试');
        //     return;
        // }
        // if ((!data.refId && data.refId !==0) || !data.crowdName || !data.refCode) {
        //     that.campaignDetailExceptionalCommunication.exceptionalMission('系统繁忙，请稍后重试');
        //     return;
        // }
        if (that.tp == 'scene') {
            data.crowdType = 2;
            data.startTime = that.startDate;
            data.endTime = that.endDate;
        }
        if (that.tp == 'childCrowd') {
            //子人群crowdType为5
            data.crowdType = 5;
            data.parentId = that.ourSystemParentId;
            data.refName = data.crowdName;
            delete data.crowdName;
            that.crowdResourceService.create(data).then(result => {
                if (data && (data.retCode || data.msgDes)) {
                    that.campaignDetailExceptionalCommunication.exceptionalMission(data);
                    return;
                }
                that.afterDialogHide();
            }).catch(err => {
                that.campaignDetailExceptionalCommunication.exceptionalMission(err);
            });
        } else {
            that.campaignLaunchUnitResourceService.createUnit(data).then((result: any) => {
                if (data && (data.retCode || data.msgDes)) {
                    that.campaignDetailExceptionalCommunication.exceptionalMission(data);
                    return;
                }
                that.hideParentDialog.emit(false);    //关闭父组件弹框
                that.afterDialogHide();
            }).catch(err => {
                that.campaignDetailExceptionalCommunication.exceptionalMission(err);
            });
        }
    }

    saveOldCrowd() {
        let that = this;
        let data: any = {
            campaignId: that.campaignDetailDataCommunication.campaignId,
            crowdType: 1,
            crowdName: that.selectCrowdData.refName,
            refId: that.selectCrowdData.refId,
            refCode: that.selectCrowdData.refCode
        };
        if (that.selectCrowdData.source) {
            data.source = that.selectCrowdData.source;
        }
        //TODO 这里错误提示方式需要确认
        if (!data.campaignId) {
            that.campaignDetailExceptionalCommunication.exceptionalMission('系统繁忙，请稍后重试');
            return;
        }
        if (!data.crowdName || !data.refCode) {
            that.campaignDetailExceptionalCommunication.exceptionalMission('系统繁忙，请稍后重试');
            return;
        }
        if (that.tp == 'scene') {
            data.crowdType = 2;
            data.startTime = moment(that.selectCrowdData.startTime).format('YYYY-MM-DD HH:mm:ss');
            data.endTime = moment(that.selectCrowdData.endTime).format('YYYY-MM-DD HH:mm:ss');
        }
        that.campaignLaunchUnitResourceService.createUnit(data).then(result => {
            if(result && (result.retCode || result.msgCode)) {
                that.campaignDetailExceptionalCommunication.exceptionalMission(result);
                return;
            }
            that.afterDialogHide();
            that.hideParentDialog.emit(false);
        }).catch(err => {
            that.campaignDetailExceptionalCommunication.exceptionalMission(err);
        })
    }
    //下拉选择
    changeDropdown (){
        let oLabel = document.querySelector('.choice-box .ui-dropdown-label');
            oLabel['style'].opacity = 1;
            // oLabel.classList.remove('change-opacity');
            
    }
    update(name: string, crowdId: number) {
        let that = this;
        let data = {
            campaignId: that.campaignDetailDataCommunication.campaignId,
            refId: crowdId,
            refName: name,
            crowdType: 1
        };
         if (!data.campaignId) {
            that.campaignDetailExceptionalCommunication.exceptionalMission('系统繁忙，请稍后重试');
            return;
        }
        if ((!data.refId && data.refId) || !data.refName) {
            that.campaignDetailExceptionalCommunication.exceptionalMission('系统繁忙，请稍后重试');
            return;
        }
        if (that.tp == 'scene') {
            data.crowdType = 2;
        }
        that.crowdResourceService.update(data).then(result => {
            if (result && (result.retCode || result.msgDes)) {
                that.campaignDetailExceptionalCommunication.exceptionalMission(result);
                return;
            }
            that.hideParentDialog.emit(false);    //关闭父组件弹框
            that.afterDialogHide();
        }).catch(err => {
            that.campaignDetailExceptionalCommunication.exceptionalMission(err);
        });
    }


    // 取消按钮
    cancel(){
        let that = this;
        that.show = true;
        that.afterDialogHide();
    }

    //输入名称模糊搜素
    changeCrowdName(){
        let that = this;
        if (that.getCrowdListTimeOut) {
            clearTimeout(that.getCrowdListTimeOut);
        }
        that.getCrowdListTimeOut = setTimeout(function () {
            that.crowdList = [];
            that.crowdConfig.page = 1;
            that.getPersonCrowdSelectlList(that.searchCrowdName);
        }, 500);
    }

    //删除已经输入的搜索人群名称
    delText() {
        let that = this;
        that.searchCrowdName = "";
        that.getPersonCrowdSelectlList();
    }

    // 存放选择人群下拉数据
    getPersonCrowdSelectlList(name?: string){
        let that = this;
        let json = {
            page: that.crowdConfig.page,
            pageSize: that.crowdConfig.pageSize,
            crowdType: that.crowdTypes,
            status: 2
        }
        if (!name){
            json['refName'] = '';
        } else {
            json['refName'] = name;
        }
        //获取人群列表
		that.crowdResourceService.getOldCrowdList(that.campaignDetailDataCommunication.campaignId, json).then((data: any) => {
            if (!data) {
                that.crowdList = data;
                that.showLoadMore = false;
            } else {
                if (data.retCode || data.msgDes) {
                    that.campaignDetailExceptionalCommunication.exceptionalMission(data);
                    return;
                }
                that.crowdConfig.total = data.total;
                if (that.crowdConfig.page === 1) {
                    that.crowdList = data.data;
                } else {
                    that.crowdList = that.crowdList.concat(data.data);
                }
                if (!data.data) {
                    that.showLoadMore = false;
                } else {
                    if (data.total > (that.crowdConfig.page - 1) * that.crowdConfig.pageSize + data.data.length) {
                        that.showLoadMore = true;
                    } else {
                        that.showLoadMore = false;
                    }
                }
            }
            if(!that.selectCrowdData){
                that.selectCrowdData = that.crowdList[0];
            }
		}).catch(err =>{});
		
    }

    //加载更多
    loadMoreCrowd(){
        let that = this;
        if (!that.showLoadMore) {
            return;
        }
        that.crowdConfig.page = that.crowdConfig.page + 1;
        that.getPersonCrowdSelectlList(that.searchCrowdName);
    }

    addPersonCrowd(type: string){//{event: any,type:ciilcktype}
        let that = this;
        that.ht = '600'; 
        that.wt = '1030';
        that.showsence = "1";
    }

    ngAfterViewInit() {
        // let oLabel = document.querySelector('.choice-box .ui-dropdown-label');
        //     oLabel.classList.add('change-opacity');
        let a = document.querySelector('.crowd_form .ui-dialog-titlebar-icon');
        a['onclick'] = function () {
            return false;
        }
    }

    ngOnDestroy() {
        let that = this;
        that.userCrowdId = null;
        that.ourSystemParentId = null;
        if (window.removeEventListener) {
            window.removeEventListener('message', that.getPostMessage, false);
        } else if (window['detachEvent']) {
            window['detachEvent']('message', that.getPostMessage);
        }
    }

    goback() {
        let that = this;
        that.display = false;
        that.hideLookalikeCrowdDialog.emit(that.display);
        that.showsence = "2";
        that.ht = '230';
        that.wt = '600'; 
    }
}