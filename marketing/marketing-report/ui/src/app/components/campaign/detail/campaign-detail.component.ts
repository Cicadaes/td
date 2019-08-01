import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from "moment";

import { CampaignResourceService } from "../../../services/campaign/campaign.resource.service";
import { CampaignDetailDataCommunication } from "../../../services/communication/campaign-detail-data.communication.service";
import { CampaignDetailExceptionalCommunication } from "../../../services/exceptional/campaign-detail-exceptional.service";
import { ChangeBreadNameCommunicationService } from "../../../services/communication/change-bread-name.communication.service"
import { Message } from "primeng/primeng";
import { ErrorHandlingService } from "../../../services/exceptional/error-handling.service";
import { EquityConfigResourceService } from '../../../services/campaign/equity_config.resource.service';
import { PipelineDefinitionResourceService } from '../../../services/admin/pipeline-definition.resource.service';
import { AuthResourceService } from '../../../services/admin/auth.resource.service';
import { AllDetailDataCommunication } from '../../../services/communication/all-detail-data.communication.service';

@Component({
    selector: 'campaign-detail',
    templateUrl: 'campaign-detail.component.html',
    styleUrls: ['campaign-detail.component.css'],
    providers: [
        CampaignResourceService,
        CampaignDetailDataCommunication,
        CampaignDetailExceptionalCommunication,
        EquityConfigResourceService,
        PipelineDefinitionResourceService,
        AuthResourceService
    ]
})

export class CampaignDetailComponent {
    private beforeUpdateName: string; //修改前的名字    
    campaignId: number;
    campaignData: any = {};
    msgs: Message[] = [];
    ttl: number = 3000;    //右上角弹框消失时间
    disabledTime: boolean = true;  //禁止修改时间
    disabledName: boolean = true;  //禁止修改名字
    isEditName: boolean = true; //是否修改名字
    isEditDesc: boolean = false;
    tipShow: boolean = false;   //活动名为空的时候提示
    descTipShow: boolean = false; //描述字数超限提示
    warnTip: string = ''; //提示语内容
    oneDay: number = 1 * 24 * 60 * 60 * 1000;//一天
    loading: boolean = false;
    processResourceList: any = []; // 营销流程列表
    processResourceListLength: number = 0; // 营销流程列表
    equityList: any[] = []; // 权益列表数据    
    beforeUpdateDesc: string; //修改前的描述    
    marketingValue: any = { //时间插件使用数据
        showIcon: true,
        ranges: [{
            label: '今天', day: 1
        },
        {
            label: '最近七天', day: 7
        },
        {
            label: '最近一个月', day: 30
        },
        {
            label: '季度', day: 90
        }],
        dateRanges: { max: null, min: new Date(moment().startOf('day').add(1, 'd').format('YYYY-MM-DD HH:mm:ss')) }
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public campaignResourceService: CampaignResourceService,
        public campaignDetailDataCommunication: CampaignDetailDataCommunication,
        public campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication,
        public changeBreadNameCommunicationService: ChangeBreadNameCommunicationService,
        public errorHandlingService: ErrorHandlingService,
        public equityConfigResourceService: EquityConfigResourceService,
        public pipelineDefinitionResourceService: PipelineDefinitionResourceService,
        public authResourceService: AuthResourceService,
        public allDetailDataCommunication: AllDetailDataCommunication
    ) {
        let that = this;
        that.campaignId = that.route.params['value']['id'];
        that.campaignDetailDataCommunication.campaignId = that.campaignId;
        that.allDetailDataCommunication.campaignId = that.campaignId;

        authResourceService.getUserInfo().then(data => {
            let roles = data.roles;
            for (let i = 0; i < roles.length; i++) {
                if (that.campaignDetailDataCommunication.userRight && that.campaignDetailDataCommunication.userRight === 'marketing_ADMIN') {
                    break;
                }
                that.campaignDetailDataCommunication.userRight = roles[i].roleCode;
            }
            // that.campaignDetailDataCommunication.userRight = data.roles[0].roleCode; 
            // that.campaignDetailDataCommunication.userRight = 'marketing_ADMIN';
        }).catch(err => { });

        that.campaignData = that.allDetailDataCommunication.campaignData;
        that.initialEquityList();
        if (that.campaignData) {
            that.init();
        }
        
        allDetailDataCommunication.GetCampaign$.subscribe(data => {
            that.campaignData = data;
            that.init();
        })
        
        campaignDetailExceptionalCommunication.missionExceptional$.subscribe(data => {
            that.error(data);
        })
    }

    ngOnInit() {
        let that = this;
    }

    init() {
        let that = this;
        that.campaignDetailDataCommunication.campaignData = that.campaignData;
        that.marketingValue.data = {};
        that.marketingValue.data.start = new Date(that.campaignData.startTime);
        that.marketingValue.data.end = new Date(that.campaignData.endTime);
        let time = Date.now();
        //进行中
        if (that.campaignData.startTime < time && time < that.campaignData.endTime) { // 进行中
            that.disabledTime = true;
            that.disabledName = false;
            that.campaignDetailDataCommunication.isFinish = false;
            that.campaignDetailDataCommunication.campaignStatus = 2;
        } else if (that.campaignData.startTime > time) {  // 未开始
            that.disabledTime = false
            that.disabledName = false;
            that.campaignDetailDataCommunication.isFinish = false;
            that.campaignDetailDataCommunication.campaignStatus = 1;
        } else {                             // 已结束
            that.disabledTime = true;
            that.disabledName = true;
            that.campaignDetailDataCommunication.isFinish = true;
            that.campaignDetailDataCommunication.campaignStatus = 3;
        }
    }

    editNameInput() {
        let that = this;
        that.beforeUpdateName = that.campaignData.name;
        that.isEditName = false;
    }

    editDescInput() {
        let that = this;
        that.beforeUpdateDesc = that.campaignData.description;
        that.isEditDesc = true;
    }

    //修改名称
    updateName() {
        let that = this;
        if (that.campaignData.name) {
            if (that.campaignData.name.length > 26) {
                that.warnTip = '活动名称不能超过26个中文字符。';
                that.tipShow = true;
            } else {
                let json = {
                    id: that.campaignData.id,
                    name: that.campaignData.name
                };
                that.campaignResourceService.update(json).then((data: any) => {
                    if (data._body) {
                        let respone = data.json();
                        if (respone && (respone.retCode || respone.msgDes)) {
                            let error = that.errorHandlingService.getMsg(respone);
                            if (error.code === 1) {
                                that.error(error);
                            } else if (error.code === 2) {
                                that.warnTip = respone.msgDes;
                                that.tipShow = true;
                            }
                        }
                    } else {
                        that.isEditName = true;
                        that.tipShow = false;
                        that.changeBreadNameCommunicationService.announceMission(that.campaignData.name);

                    }

                }).catch(err => {
                    that.msgs.push({ severity: 'error', summary: '错误', detail: err });
                });
            }

        } else {
            that.warnTip = '活动名称不能为空。';
            that.tipShow = true;
        }

    }

    //取消名称修改
    cancelUpdateName() {
        let that = this;
        that.campaignData.name = that.beforeUpdateName;
        that.isEditName = true;
        that.tipShow = false;
    }

    //修改描述
    updateDesc() {
        let that = this;
        if (that.campaignData.description && that.campaignData.description.length > 80) {
            that.descTipShow = true;
        } else {
            let json = {
                id: that.campaignData.id,
                name: that.campaignData.name,
                description: that.campaignData.description
            };
            that.campaignResourceService.update(json).then((data: any) => {
                let result = data._body && JSON.parse(data._body);
                if (data && (data.retCode || data.msgDes)) {
                    let error = that.errorHandlingService.getMsg(data);
                    //TODO 未做页面错题提示
                    that.error(error);
                }
                if (result && (result.retCode || result.msgDes)) {
                    let error = that.errorHandlingService.getMsg(result);
                    //TODO 未做页面错题提示
                    that.error(error);
                }
                if (data.ok) {
                    that.isEditDesc = false;
                    that.descTipShow = false;
                }
            }).catch(err => {
                that.msgs.push({ severity: 'error', summary: '错误', detail: err });
            });
        }

    }

    //取消描述修改
    cancelUpdateDesc() {
        let that = this;
        that.campaignData.description = that.beforeUpdateDesc;
        that.isEditDesc = false;
        that.descTipShow = false;
    }

    //选择时间区间后，更新营销活动时间
    onSelect(date: any) {
        let that = this;
        let json = {
            id: that.campaignData.id,
            startTime: date.start,
            endTime: date.end
        }
        that.campaignResourceService.update(json).then((data: any) => {
            let result = data._body && JSON.parse(data._body);
            if (data && (data.retCode || data.msgDes)) {
                that.marketingValue.data.start = new Date(that.campaignData.startTime);
                that.marketingValue.data.end = new Date(that.campaignData.endTime);
                let error = that.errorHandlingService.getMsg(data);
                //TODO 未处理页面显示错误
                that.error(error);
            } else if (result && (result.retCode || result.msgDes)) {
                that.marketingValue.data.start = new Date(that.campaignData.startTime);
                that.marketingValue.data.end = new Date(that.campaignData.endTime);
                let error = that.errorHandlingService.getMsg(result);
                //TODO 未处理页面显示错误
                that.error(error);
            } else {
                that.campaignDetailDataCommunication.campaignData.startTime = date.start;
                that.campaignDetailDataCommunication.campaignData.endTime = date.end;
            }
            that.initialMktProcessResource();
        }).catch(err => {
            that.msgs.push({ severity: 'error', summary: '错误', detail: err });
        });
    }

    goReport() {
        let that = this;
        that.router.navigate(['/marketing/report', this.campaignId]);
        that.loading = true;
    }

    //input输入校验
    inputChange() {
        if (this.campaignData.name) {
            this.tipShow = false;
        }
    }

    //错误处理
    error(err: any) {
        let that = this;
        if (err) {
            let errMsg = '';
            if (err && err.msgDes) {
                errMsg = err.msgDes;
            } else if (err.message) {
                errMsg = err.message;
            } else if ((typeof err == 'string') && err.constructor == String) {
                errMsg = err;
            }
            that.msgs.push({ severity: 'error', summary: '错误', detail: errMsg });
        }
    }

    // loading 是否显示
    changeLoading(bl: boolean) {
        this.loading = bl;
    }

    // 初始化权益列表
    initialEquityList() {
        let that = this;
        let ID = that.campaignId;

        let params = {
            campaignId: ID,
        };


        // 获取权益列表的数据
        that.equityConfigResourceService.query(params).then((data) => {
            that.equityList = data.filter((eq) => {
                return true;
            });
            that.equityList.map((eq: any) => {
                eq['isAdding'] = false;
                eq['isNeedClear'] = false;
                eq['count'] = 0;
                eq['precent'] = 0;
            });
            that.initialMktProcessResource();
        }).catch((err) => {
            console.log(err)
        });
    }

    // 初始化营销流程列表
    initialMktProcessResource() {
        let that = this;

        let campaignId: number = that.campaignId;

        return that.pipelineDefinitionResourceService.findPipeLineByCampaignId(campaignId).then((data) => {
            // 将获得的数据深拷贝后放入
            that.processResourceList = data.filter(() => {
                return true;
            });
            that.processResourceList.map((prEl: any) => {
                prEl['isAdding'] = false;
                prEl['processNameEditing'] = false;
                let minDate = new Date(that.marketingValue.data.start);
                //如果活动已经开始了 营销活动开始时间必须大于当前时间
                if (minDate < new Date(moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'))) {
                    minDate = new Date(moment().startOf('day').add(1, 'd').format('YYYY-MM-DD HH:mm:ss'));
                }
                prEl['marketingValue'] = { //时间插件使用数据
                    showIcon: true,
                    ranges: [{
                        label: '今天', day: 1
                    },
                    {
                        label: '最近七天', day: 7
                    },
                    {
                        label: '最近一个月', day: 30
                    },
                    {
                        label: '季度', day: 90
                    }],
                    dateRanges: { max: new Date(that.marketingValue.data.end), min: minDate },
                    data: { start: new Date(prEl.startTime), end: new Date(prEl.endTime) }
                };
                if (prEl.pipelineEquityConfigDefinitionDtos.length === 0) {
                    that.equityList.map((eqEl: any, eqIndex: number) => {
                        let initEl = {};
                        initEl['name'] = eqEl.name;
                        initEl['precent'] = 0;
                        initEl['count'] = 0;
                        initEl['total'] = eqEl.total;
                        initEl['isRight'] = true;
                        initEl['remain'] = 0;
                        prEl.pipelineEquityConfigDefinitionDtos.push(initEl);
                    });
                } else {
                    that.equityList.map((eqEl: any, eqIndex: number) => {
                        prEl.pipelineEquityConfigDefinitionDtos.map((initEl: any, i: number) => {
                            if (eqIndex === i) {
                                initEl['total'] = eqEl.total;
                                initEl['isRight'] = true;
                            }
                        });
                    });
                }
            });
        }).catch((err: any) => {
            that.error('系统繁忙，请稍后再试！');
        });
    }
}