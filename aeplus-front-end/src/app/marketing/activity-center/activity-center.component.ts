import {Component, Injector, ViewChild, ElementRef, OnInit, OnChanges} from '@angular/core';
import {NzModalRef} from 'ng-cosmos-ui';
import {TABLE_PAGE_SIZE_OPTIONS} from '../../common/config/page.size.config';
import {ActivityCenterAddMcpComponent} from './activity-center-add-mcp/activity-center-add-mcp.component';
import {ActivityCenterAddSclComponent} from './activity-center-add-scl/activity-center-add-scl.component';
import {ActivityCenterService} from './activity-center.service';
import {SegmentDataService} from './segment-data.service';
import {ActivityCenterSmComponent} from './activity-center-sm/activity-center-sm.component';
import {ActivityCenterAppEdmComponent} from './activity-center-app-edm/activity-center-app-edm.component';
import {ActivityCenterAppPushComponent} from './activity-center-app-push/activity-center-app-push.component';
import {BaseComponent} from '../../common/base-component';
import {DomSanitizer} from '../../../../node_modules/@angular/platform-browser';

let $scope: any;

@Component(
    {
        selector: 'app-activity-center',
        templateUrl: './activity-center.component.html',
        styleUrls: ['./activity-center.component.less'],
        providers: [ActivityCenterService, SegmentDataService]
    }
)

export class ActivityCenterComponent extends BaseComponent implements OnInit, OnChanges {

    descEditGlobalIndex: any = -1;

    public nls: any;

    public vm: any;
    oneDotData: any;
    manyDotData: any;
    removeFlag = false; // 删除操作提示框
    itemObj: any; // 向删除提示框传入数据
    _item: any; // 要删除的当前数据
    flag = false;

    segmentId: number; // 投放id  修改时存入
    campaignId: number; // 活动id  修改时存入

    crowdMap: any = {}; // 人群map

    autoSubmit: any; // 定时器
    intervalTime: number = 1000 * 60 * 3; // 三分钟
    isAutoSaved: boolean = false; // 是否已经自动保存

    reportObj: any;  // 投放报告弹框组件传递参数

    dwIframeUrl: any;           // 嵌入的dw页面

    dwUrl = {
        create: 'https://aeplus.beta.data-whisper.com/account/0/mass/message',
        detail: 'https://aeplus.beta.data-whisper.com/account/mass/detail',
        report: 'https://aeplus.beta.data-whisper.com/account/mass/articledetail'
    }

    @ViewChild('modalContent_addScl') private modalContent_addScl: ElementRef;

    @ViewChild('modalContent_addMcp') private modalContent_addMcp: ElementRef;

    @ViewChild('modalTitle_sm') private modalTitle_sm: ElementRef;

    @ViewChild('modalContent_sm') private modalContent_sm: ElementRef;

    @ViewChild('modalFooter') private modalFooter: ElementRef;

    @ViewChild('modalTitle_push') modalTitle_push: ElementRef;

    @ViewChild('activityCenterAppPush') activityCenterAppPush: ElementRef;

    @ViewChild('modalTitle_edm') modalTitle_edm: ElementRef;

    @ViewChild('activityCenterAppEdm') activityCenterAppEdm: ElementRef;

    @ViewChild('report_email') report_email: ElementRef;

    @ViewChild('report_push') report_push: ElementRef;

    @ViewChild('report_sms') report_sms: ElementRef;

    @ViewChild('dwPage') dwPage: ElementRef;

    @ViewChild(ActivityCenterAddMcpComponent) private mcp: ActivityCenterAddMcpComponent;
    @ViewChild(ActivityCenterAddSclComponent) private scl: ActivityCenterAddSclComponent;

    @ViewChild(ActivityCenterAppPushComponent) private app: ActivityCenterAppPushComponent;
    @ViewChild(ActivityCenterSmComponent) private sms: ActivityCenterSmComponent;
    @ViewChild(ActivityCenterAppEdmComponent) private edm: ActivityCenterAppEdmComponent;

    modalRef: NzModalRef;

    constructor(private activityCenterService: ActivityCenterService,
                private segmentDataService: SegmentDataService,
                private domSanitizer: DomSanitizer,
                private injector: Injector) {
        super(injector);

        this.initRouterList('活动管理');

        $scope = this;

        window.addEventListener('message', (event: any) => {
            if (event.data && typeof event.data === 'string') {
                const data = JSON.parse(event.data);
                if (data && data.eventInfo && data.eventType === 'dwClose') {
                    // const list = data.eventInfo.data;
                    $scope.modalRef.close();
                    $scope.initContentData();
                }
            }
        });
    }

    ngOnInit() {

        $scope.nls = {
            operationSingleContactLaunch: '新建单触点投放',
            operationMultiContactProcess: '新建多触点流程',
            modalTitleSingleContactLaunch: '新建单触点投放',
            modalTitleSingleContactLaunchUpdate: '修改单触点投放',
            modalTitleSingleContactLaunchLook: '查看单触点投放',
            modalTitleMultiContactProcess: '新建多触点流程',
            modalTitleShortMessageLaunch: '新建短信投放',
            modalTitlePushLaunch: '新建应用推送',
            modalTitleEdmLaunch: '新建邮件投放',
            modalTitleShortMessageLaunchUpdate: '修改短信投放',
            modalTitlePushLaunchUpdate: '修改应用推送',
            modalTitleEdmLaunchUpdate: '修改邮件投放',
            modalTitlePushLaunchLook: '查看应用推送',
            modalTitleShortMessageLaunchLook: '查看短信投放',
            modalTitleEdmLaunchLook: '查看邮件投放',
            modalTitleAutoSave: '自动保存间隔3分钟',
            modalOperationNext: '下一步',
            modalOperationPrev: '上一步',
            modalOperationGiveUpAdd: '放弃新建',
            modalOperationGiveUpUpdate: '放弃修改',
            modalOperationGiveUpLook: '关闭',
            modalOperationSaveDraft: '保存草稿',
            modalOperationAffirmSubmit: '确认提交',
            contentHeader1: '共',
            contentHeader2: '0',
            contentHeader3: '个营销活动',
            contentFilterPlaceholder: '请输入活动名称进行检索',
            contentFilterCondition: '筛选',
            contentFilterConditionActivityNameLabel: '活动名称',
            contentFilterConditionActivityTypeLabel: '活动类别',
            contentFilterConditionActivityTimeLabel: '活动时间',
            contentFilterConditionActivityStateLabel: '活动状态',
            contentFilterConditionActivityNamePlaceholder: '请输入活动名',
            contentFilterConditionLookUp: '查看',
            contentTableColumn1: '活动名称',
            contentTableColumn2: '活动类别',
            contentTableColumn3: '活动时间',
            contentTableColumn4: '活动状态',
            contentTableColumn5: '创建人',
            contentTableColumn6: '描述',
            contentTableColumn7: '操作',
            contentActivityType1: '单触点投放',
            contentActivityType2: '多触点流程',
            contentActivityState0: '草稿',
            contentActivityState1: '等待开始',
            contentActivityState2: '进行中',
            contentActivityState3: '已结束',
            contentActivityState4: '已删除',
            contentOperationInfo: '详情',
            contentOperationEdit: '编辑',
            contentOperationReport: '报告',
            contentOperationDelete: '删除',
            contentOperationClone: '克隆',
            contentNotificationDelete: '删除成功'
        };

        $scope.vm = {

            filter: {
                activityNameValue: '',
                activityTypeRadio: [],
                activityTypeValue: undefined,
                activityTimeValue: [],
                activityStateRadio: [],
                activityStateValue: undefined,
                advanced: false
            },

            content: {
                data: [],
                total: 0,
                pageIndex: 1,
                pageSize: 10,
                pageSizeOption: TABLE_PAGE_SIZE_OPTIONS,
                loading: false,
                orderBy: 'startTime',
                order: 'desc',
            },

            singleContactLaunch: {
                launchCrowdSelect: [],
                launchWaysRadio: []
            },

            manyDotData: {},

            oneDotData: {},

        };

        // 执行初始化
        $scope.initFilterCondition();
        $scope.initContentData();
        $scope.initSingleContactLaunch();

    }

    changeIndex(index: any, item?: any) {

        // 选中条目，备份当前值
        if (index !== -1) {
            item.description_old = item.description;
        }

        // 处理之前条目
        const indexToSave = this.descEditGlobalIndex;
        if (indexToSave !== -1) {

            const actVO: any = $scope.vm.content.data[indexToSave];

//            const reg = /^[A-Za-z0-9\u4e00-\u9fa5\-_]+$/;
//            if (actVO.description && !reg.test(actVO.description)) {
//                this.message.create('error', '描述中含有特殊字符');
//                actVO.description = actVO.description_old;
//                return;
//            }

            if (actVO.description && actVO.description.length > 80) {
                this.message.create('error', '描述信息不能大于80个字符');
                actVO.description = actVO.description_old;
                return;
            }

            // 如果条目值改变，才保存
            if (actVO.description !== actVO.description_old) {
                const body = {
                    'id': actVO.id,
                    'name': actVO.activityName,
                    'description': actVO.description,
                };
                this.activityCenterService.updateCampaigns(body).subscribe((response: any) => {
                    if (response.code == 200) {
                        this.message.create('success', `保存成功`);
                    } else {
                        this.message.create('error', response.message);
                        actVO.description = actVO.description_old;
                    }
                });
            }
        }

        // 选中条目改为当前
        this.descEditGlobalIndex = index;
    }

    initFilterCondition($next ?: any) {
        const $data = {
            activityType: {
                radio: [
                    {
                        label: '全部',
                        value: undefined
                    },
                    {
                        label: '单触点投放',
                        value: 1
                    },
                    {
                        label: '多触点流程',
                        value: 2
                    }
                ],
                value: undefined
            },
            activityState: {
                radio: [
                    {
                        label: '全部',
                        value: undefined
                    },
                    {
                        label: '等待开始',
                        value: 1
                    },
                    {
                        label: '进行中',
                        value: 2
                    },
                    {
                        label: '已结束',
                        value: 3
                    },
                    {
                        label: '草稿',
                        value: 0
                    }
                ],
                value: undefined
            }
        };
        $scope.vm.filter.activityTypeRadio = $data.activityType.radio;
        $scope.vm.filter.activityTypeValue = $data.activityType.value;
        $scope.vm.filter.activityStateRadio = $data.activityState.radio;
        $scope.vm.filter.activityStateValue = $data.activityState.value;

        // 执行下一步
        if ($next) {
            $next();
        }

    }

    initContentData($next ?: any) {

        let paraObj: any = {
            productId: $scope.productId,
            name: $scope.vm.filter.activityNameValue,
            page: $scope.vm.content.pageIndex,
            pageSize: $scope.vm.content.pageSize,
            orderBy: $scope.vm.content.orderBy,
            order: $scope.vm.content.order,
        };

        let activityType = $scope.vm.filter.activityTypeValue;
        if (activityType) {
            paraObj.type = activityType;
        }

        let activityState = $scope.vm.filter.activityStateValue;
        if (activityState != null) {
            paraObj.status = activityState;
        }

        let activityTime = $scope.vm.filter.activityTimeValue;
        if (activityTime.length > 0) {
            let startTimeBegin;
            let startTimeEnd;
            if (activityTime && activityTime[0]) {
                const date1 = activityTime[0];
                startTimeBegin = this.commonService.getDateStr(date1);
            }
            if (activityTime && activityTime[1]) {
                const date2 = activityTime[1];
                startTimeEnd = this.commonService.getDateStr(date2);
            }
            paraObj.startTimeBegin = startTimeBegin;
            paraObj.startTimeEnd = startTimeEnd;
        }

        $scope.vm.content.loading = true;
        $scope.activityCenterService.getContentDataTmpTrue(paraObj).subscribe((response: any) => {
            if (response.code === 200) {
                let list = response.data.data;
                let listNew = [];
                for (let i = 0; i < list.length; i++) {
                    const b = list[i];
                    listNew.push({
                        id: b.id,
                        activityName: b.name,
                        activityType: b.type,
                        activityTime: $scope.getContentData_formatActivityTime(b),
                        activityState: b.status,
                        creator: b.creator,
                        description: b.description,
                        type: b.type,
                        segmentType: b.attr2,
                        attr3: b.attr3
                    });
                }

                $scope.vm.content.data = listNew;
                $scope.vm.content.total = response.data.total;
                $scope.vm.content.loading = false;
                $scope.nls.contentHeader2 = response.data.total;

                // 执行下一步
                if ($next) {
                    $next();
                }
            }
        });
    }

    getContentData_formatActivityTime($data: any) {
        switch ($data.type) {
            case 1 :
                return $data.startTime ? $data.startTime.substring(0, 16) : '';
            case 2 :
                return ($data.startTime ? $data.startTime.substring(0, 10) : '')
                    + ' ~ '
                    + ($data.endTime ? $data.endTime.substring(0, 10) : '');
        }
    }

    initSingleContactLaunch($next ?: any) {

        let successByLaunchCrowdSelect, successByLaunchWaysRadio;

        successByLaunchCrowdSelect = function ($data: any) {

            $scope.vm.singleContactLaunch.launchCrowdSelect = $data;

        };

        successByLaunchWaysRadio = function ($data: any) {

            $scope.vm.singleContactLaunch.launchWaysRadio = $data;

        };

        $scope.activityCenterService.getSingleContactLaunch_launchCrowdSelect(successByLaunchCrowdSelect);
        $scope.activityCenterService.getSingleContactLaunch_launchWaysRadio(successByLaunchWaysRadio);

    }

    /**
     * 处理过滤
     */
    handlerFilter($event: any) {

        // 处理活动类别和活动状态筛选条件的联动
        const type = $scope.vm.filter.activityTypeValue;
        const stateList = $scope.vm.filter.activityStateRadio;
        if (!$scope.vm.filter.activityStateRadioMin) {
            const stateListTmp = [];
            for (let i = 0; i < stateList.length; i++) {
                const obj = stateList[i];
                if (obj.value !== 0) {
                    stateListTmp.push({
                        label: obj.label,
                        value: obj.value
                    });
                }
            }
            $scope.vm.filter.activityStateRadioMin = stateListTmp;
            $scope.vm.filter.activityStateRadioMax = stateList;
        }
        if (type === 2) {
            $scope.vm.filter.activityStateRadio = $scope.vm.filter.activityStateRadioMin;
            // 由单触点切换到多触点，如果筛选状态为草稿，改为全部
            if ($scope.vm.filter.activityStateValue === 0) {
                $scope.vm.filter.activityStateValue = undefined;
            }
        } else {
            $scope.vm.filter.activityStateRadio = $scope.vm.filter.activityStateRadioMax;
        }

        // 处理其他
        if ($scope.vm.filter.advanced || $event.keyCode === 13) {
            $scope.vm.content.pageIndex = 1;
            $scope.initContentData();
        }
    }

    handlerFilter_advanced() {
//        if ($scope.vm.filter.activityNameValue && $scope.vm.filter.activityNameValue !== '') {
//            $scope.vm.filter.activityNameValue = '';
//        }
        $scope.vm.filter.advanced = !$scope.vm.filter.advanced;

    }

    /**
     * 处理内容
     */
    handlerContent_formatActivityType($data: any) {

        switch ($data) {

            case 1 :
                return $scope.nls.contentActivityType1;

            case 2 :
                return $scope.nls.contentActivityType2;

        }

    }

    handlerContent_formatActivityState($data: any) {

        switch ($data) {

            case 0 :
                return $scope.nls.contentActivityState0;  // 草稿

            case 1 :
                return $scope.nls.contentActivityState1;  // 等待开始

            case 2 :
                return $scope.nls.contentActivityState2;  // 进行中

            case 3 :
                return $scope.nls.contentActivityState3;  // 已结束

            case -1 :
                return $scope.nls.contentActivityState4;  // 已删除

        }

    }

    handlerContent_pageIndex($i: any) {

        $scope.vm.content.pageIndex = $i, $scope.initContentData();

    }

    handlerContent_pageSize($i: any) {

        $scope.vm.content.pageIndex = 1, $scope.vm.content.pageSize = $i, $scope.initContentData();

    }

    /**
     * 处理新建单触点投放
     * @param type 0 查看   1编辑    2新建
     */
    handlerScl(type: number, e?: any) {
        if (e) {
            e.target.blur();
        }

        this.segmentDataService['isUpdate'] = type;
        let title = $scope.nls.modalTitleSingleContactLaunch;
        if (type === 1) {
            title = $scope.nls.modalTitleSingleContactLaunchUpdate;
        } else if (type === 0) {
            title = $scope.nls.modalTitleSingleContactLaunchLook;
        }

        $scope.modalRef = $scope.modalService.create(
            {
                nzTitle: title,
                nzOkText: $scope.nls.modalOperationNext,
                // nzCancelText: cancelText,
                nzCancelText: null,
                nzContent: $scope.modalContent_addScl,
                nzOnOk: $scope.handlerScl_ok,
                nzOnCancel: $scope.handlerScl_close,
                nzWidth: 488,
                nzMask: true,
                nzMaskClosable: false
            }
        );

        $scope.activityCenterService.getCrowdList().subscribe((response: any) => {
            if (response.code === 200) {
                if (response.data) {
                    response.data.forEach(element => {
                        $scope.crowdMap[element.id] = element.name;
                    });
                }
                $scope.vm.singleContactLaunch.launchCrowdSelect = response.data || [];
            }
        });
    }

    /**
     * 单触点确认按钮（下一步）
     */
    async handlerScl_ok() {

        // 必填校验
        if (!await $scope.scl.handlerOk()) {
            return false;
        }

        const sclData = $scope.scl.vm;

        if (sclData.launchWaysValue === 1) {
            $scope.handlerOperation_push();
        } else if (sclData.launchWaysValue === 2) {
            $scope.handlerSm();
        } else if (sclData.launchWaysValue === 3) {
            $scope.handlerOperation_edm();
        } else if (sclData.launchWaysValue === 4) {
            $scope.handlerDwPage('create');
        }

        const info = {
            name: sclData.launchNameValue,
            channelType: sclData.launchWaysValue,
            crowdRefId: sclData.launchCrowdValue,
            crowdName: $scope.crowdMap[sclData.launchCrowdValue],
            description: sclData.launchDescriptionValue
        };

        // 自动保存，不实现。
//        if ($scope.segmentDataService.isUpdate === 2 || $scope.segmentDataService.isUpdate === 1) {
//            $scope.autoSubmit = setInterval(function () {
//                // 编辑投放数据的时候传入2  草稿第二次触发时，不走该处
//                if ($scope.segmentDataService.isUpdate === 1 && $scope.segmentDataService.segmentInfo['status'] === 2) {
//                    $scope.saveSingle(2, true); // 修改时，定时器传的值为2 投放数据
//                } else {
//                    $scope.saveSingle(1, true); // 新建时，定时器传的值为1 草稿
//                }
//            }, $scope.intervalTime);
//        }

        $scope.segmentDataService.segmentInfo = Object.assign($scope.segmentDataService.segmentInfo, info);

    }

    /**
     * 单触点弹窗关闭
     */
    handlerScl_close() {
        $scope.vm.oneDotData = {};
        $scope.segmentDataService.segmentInfo = {};
        $scope.segmentId = undefined;
        $scope.campaignId = undefined;
    }

    /**
     * 处理新建多出点流程
     */
    handlerMcp(e: any) {
        e.target.blur();

        $scope.vm.manyDotData = {};

        $scope.modalService.create(
            {
                nzTitle: $scope.nls.modalTitleMultiContactProcess,
                nzContent: $scope.modalContent_addMcp,
                nzOnOk: $scope.handlerMcp_ok,
                nzWidth: 488,
                nzMask: true,
                nzMaskClosable: false
            }
        );

    }

    // 应用推送
    handlerOperation_push() {

        $scope.modalRef = $scope.modalService.create(
            {
                nzTitle: $scope.modalTitle_push,
                nzContent: $scope.activityCenterAppPush,
                nzFooter: $scope.modalFooter,
                nzOnCancel: $scope.prev,
                nzWidth: 1000,
                nzMask: true,
                nzMaskClosable: false,
                nzStyle: {top: '75px'}
            }
        );

    }

    // 邮件投放
    handlerOperation_edm() {

        $scope.modalRef = $scope.modalService.create(
            {
                nzTitle: $scope.modalTitle_edm,
                nzContent: $scope.activityCenterAppEdm,
                nzFooter: $scope.modalFooter,
                nzOnCancel: $scope.prev,
                nzWidth: 932,
                nzMask: true,
                nzMaskClosable: false,
                nzStyle: {top: '75px'}
            }
        );

    }

    /**
     * dw嵌入的微信页面
     * @param type create 创建； detail 详情；report  报告；
     */
    handlerDwPage(type: any, dwSegmentId: number) {
        let url;
        if (type === 'create') {
            const sclData = $scope.scl.vm;
            url = `${this.dwUrl.create}?winId=${this.guid()}&name=${sclData.launchNameValue}&productId=${this.productId}&token=${localStorage.getItem('token')}`;
            if (sclData.launchDescriptionValue) {
                url += `&desc=${sclData.launchDescriptionValue}`;
            }
        } else if (type === 'detail') {
            url = `${this.dwUrl.detail}?winId=${this.guid()}&id=${dwSegmentId}&token=${localStorage.getItem('token')}`;
        } else if (type === 'report') {
            url = `${this.dwUrl.report}?winId=${this.guid()}&id=${dwSegmentId}&token=${localStorage.getItem('token')}`;
        }
        this.dwIframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
        $scope.modalRef = $scope.modalService.create(
            {
                // nzTitle: '',
                nzContent: $scope.dwPage,
                // nzClosable: false,          // 右上角关闭按钮
                nzFooter: null,
                nzWidth: 932,
                nzMask: true,
                nzMaskClosable: false,
                nzStyle: {top: '75px'},
                nzBodyStyle: {padding: '0', overflow: 'hidden'}
            }
        );
    }

    async handlerMcp_ok() {
        const aa = await $scope.mcp.handlerOk();
        if (!aa) {
            return false;
        }
    }

    // 回来的type
    putManyDotData(campaignId: any) {

        this.goInto({
            name: '',
            url: '/marketing-activities/activities',
            params: {
                campaignId: campaignId
            }
        });
    }

    /**
     * 处理新建短信投放
     */
    handlerSm() {

        $scope.modalRef = $scope.modalService.create(
            {
                nzTitle: $scope.modalTitle_sm,
                nzContent: $scope.modalContent_sm,
                nzFooter: $scope.modalFooter,
                nzOnCancel: $scope.prev,
                nzWidth: 932,
                nzMask: true,
                nzMaskClosable: false,
                nzStyle: {top: '75px'}
            }
        );

    }

    handlerOperation_detail($data: any) {

        this.goInto({
            name: '',
            url: '/marketing-activities/activities',
            params: {
                campaignId: $data.id
            }
        });
    }

    /**
     * 单触点投放详情
     * @param data
     * @param isUpdate
     */
    handlerSclOperation_detail(data: any, isUpdate: number) {
        const that = this;
        that.activityCenterService.getSegmentList(data.id).subscribe(response => {
            if (response.code !== 200) {
                that.notification.create('warning', '错误提示', response.message);
                return;
            }
            that.segmentId = response.data[0].id;
            that.campaignId = response.data[0].campaignId;
            const segmentInfo = JSON.parse(response.data[0].message); // 单触点活动只有一个投放
            segmentInfo['description'] = response.data[0]['campaignDescription'];
            that.segmentDataService.segmentInfo = {};
            if (segmentInfo.channelType === 1) { // 应用推送
                that.segmentDataService.segmentInfo = that.formatSegmentData(segmentInfo);
            } else { // 邮件和短信的，不需要处理数据
                that.segmentDataService.segmentInfo = segmentInfo;
            }

            $scope.vm.oneDotData = that.segmentDataService.segmentInfo;
            // 如果是公众号群发，就打开iframe弹框
            if (response.data[0].dwWechatSegmentId) {
                $scope.handlerDwPage('detail', response.data[0].dwWechatSegmentId);
            } else {
                $scope.handlerScl(isUpdate);
            }
        });
    }

    /**
     * 活动报告
     * @param $data
     */
    handlerOperation_report($data: any) {

        if ($data.type === 1) {

            this.activityCenterService.getSegmentByCampaignId($data.id).subscribe((response: any) => {
                if (response.code === 200) {
                    if (response.data && response.data.length > 0) {

                        const segmentObj = response.data[0];
                        const message = JSON.parse(segmentObj.message);
                        const channelType = message.channelType;

                        this.reportObj = {
                            campaignId: $data.id,
                            segmentId: segmentObj.id,
                            name: segmentObj.name,
                            right: segmentObj.type === 2
                        };

                        let contentTmp = null;
                        if (channelType === 1) {
                            contentTmp = $scope.report_push;
                        } else if (channelType === 2) {
                            contentTmp = $scope.report_sms;
                        } else if (channelType === 3) {
                            contentTmp = $scope.report_email;
                        }

                        if (segmentObj.dwWechatSegmentId) {
                            $scope.handlerDwPage('report', response.data[0].dwWechatSegmentId);
                        } else {
                            $scope.modalService.create(
                                {
                                    nzTitle: '投放报告',
                                    nzContent: contentTmp,
                                    nzCancelText: null,
                                    nzOkText: null,
                                    nzWidth: '80%',
                                    nzMask: true,
                                    nzMaskClosable: false,
                                    nzFooter: null,
                                    nzBodyStyle: {
                                        background: '#eef0f3',
                                        padding: '0px 0px 16px 0px'
                                    }
                                }
                            );
                        }

                    } else {
                        this.message.create('error', '没有投放信息');
                    }
                } else {
                    this.message.create('error', response.message);
                }
            });

        } else {
            this.goInto({
                name: '',
                url: '/effect-report/report',
                params: {
                    campaignId: $data.id
                }
            });

        }
    }

    handlerOperation_clone($data: any) {
        if ($data.type === 1) { // 单触点克隆
            this.activityCenterService.getSegmentList($data.id).subscribe(response => {
                if (response.code !== 200) {
                    this.notification.create('warning', '错误提示', response.message);
                    return;
                }
                this.segmentId = null;
                const segmentInfo = JSON.parse(response.data[0].message); // 单触点活动只有一个投放
                segmentInfo['name'] = '';
                this.segmentDataService.segmentInfo = {};
                if (segmentInfo.channelType === 1) { // 应用推送
                    this.segmentDataService.segmentInfo = this.formatSegmentData(segmentInfo);
                } else { // 邮件和短信的，不需要处理数据
                    this.segmentDataService.segmentInfo = segmentInfo;
                }

                $scope.vm.oneDotData = this.segmentDataService.segmentInfo;
                $scope.handlerScl(2);
            });
        } else {
            $scope.activityCenterService.manyDotClon($data.id).subscribe((response: any) => {
                if (response.code === 200) {
                    $scope.modalService.create(
                        {
                            nzTitle: $scope.nls.modalTitleMultiContactProcess,
                            nzContent: $scope.modalContent_addMcp,
                            nzOnOk: $scope.handlerMcp_ok,
                            nzWidth: 488,
                            nzMask: true,
                            nzMaskClosable: false
                        }
                    );
                    $scope.vm.manyDotData = response.data;
                }
            });
        }
    }

    // 取消删除提示框
    hideItemDialog(type: any) {
        this.removeFlag = false;
        $scope.flag = false;
    }

    deleteFunc() {
        $scope.activityCenterService.setContentDeleteTrue($scope._item.id).subscribe((response: any) => {
            $scope.removeFlag = false;
            $scope.vm.content.pageIndex = 1;
            $scope.vm.content.loading = false;
            $scope.initContentData();
        });
    }

    handlerOperation_delete($data: any) {
        this._item = $data;
        this.modalService.confirm({
            nzTitle: '提示',
            nzContent: `确定要删除活动"${this._item['activityName']}"？`,
            nzOnOk: () => {
                this.deleteFunc();
            }
        });
    }

    /**
     * 上一步  或   关闭弹框
     * @param type true的时候上一步
     */
    prev(type: boolean) {
        if (type) { // 触发上一步
            $scope.modalRef.close();
            $scope.vm.oneDotData = this.segmentDataService.segmentInfo;
            $scope.handlerScl(this.segmentDataService.isUpdate);
        } else {
            $scope.vm.oneDotData = {};
            $scope.segmentDataService.segmentInfo = {};
            $scope.segmentId = undefined;
            $scope.campaignId = undefined;
        }
        clearInterval($scope.autoSubmit);
    }

    /**
     * 处理请求数据
     * @param data 投放数据
     * @param type 投放类型
     */
    processReqData(data: any, type: number) {
        const json = JSON.parse(JSON.stringify(data));
        let pushData;

        if (this.segmentId) {
            json['id'] = this.segmentId;
            json['campaignId'] = this.campaignId;
        }
        json['type'] = 1; // 单触点
        json['appid'] = localStorage.getItem('appkey');

        if (json.ttlType) {
            json['timeToLive'] = +json.timeToLive || 4;
        } else {
            delete json['timeToLive'];
        }
        delete json.ttlType;

        if (type === 1) { // push 投放
            if (json.platform === 'ios') {
                delete json.androidData;
                pushData = json.iosData;
            } else {
                delete json.iosData;
                pushData = json.androidData;
            }
            const length = pushData && pushData.length || 0;
            for (let i = 0; i < length; i++) {
                if (json.platform === 'android') {
                    pushData[i].vibrate ? pushData[i]['vibrate'] = 1 : pushData[i]['vibrate'] = 0;
                    pushData[i].wakeup ? pushData[i]['wakeup'] = 1 : pushData[i]['wakeup'] = 0;
                    pushData[i].clearable ? pushData[i]['clearable'] = 0 : pushData[i]['clearable'] = 1;
                }

                if (json.platform === 'ios') {
                    if (pushData[i].sound) {
                        pushData[i]['sound'] = 1;
                    } else {
                        pushData[i]['sound'] = 0;
                        delete pushData[i]['soundName'];
                    }
                    pushData[i].digitalAngle ? delete pushData[i].digitalAngle : delete pushData[i].badge;
                }

                pushData[i].action ? pushData[i]['action'] = 1 : pushData[i]['action'] = 0;
                pushData[i]['groupOption'] = pushData[i].groupOption || 'A';
                pushData[i]['ratio'] = pushData[i].ratio || 0;

                if (pushData[i]['customParameters'] && pushData[i]['customParameters'].length > 0) {
                    for (let j = pushData[i]['customParameters'].length - 1; j >= 0; j--) {
                        const element = pushData[i]['customParameters'][j];
                        if (pushData[i]['message'].indexOf('${' + element + '}') === -1) {
                            pushData[i]['customParameters'].splice(j, 1);
                        }
                    }
                }

                if (pushData[i].isVibration) {
                    if (pushData[i].extendAttr && pushData[i].extendAttr.length > 0) {
                        const temp = pushData[i].extendAttr.length;
                        const tempJson = [];
                        for (let j = 0; j < temp; j++) {
                            if (pushData[i].extendAttr[j]['key'] && pushData[i].extendAttr[j]['value']) {
                                tempJson.push({
                                    key: pushData[i].extendAttr[j]['key'],
                                    value: pushData[i].extendAttr[j]['value']
                                });
                            }
                        }
                        pushData[i]['extendAttr'] = tempJson;
                    }
                } else {
                    delete pushData[i]['extendAttr'];
                }

                delete pushData[i].isVibration;
            }
        } else if (type === 2) { // 短信投放
            if (json['customParameters'] && json['customParameters'].length > 0) {
                for (let j = json['customParameters'].length - 1; j >= 0; j--) {
                    const element = json['customParameters'][j];
                    if (json['content'].indexOf('${' + element + '}') === -1) {
                        json['customParameters'].splice(j, 1);
                    }
                }
            }
        }

        return json;
    }

    /**
     * 保存单触点投放
     * @param type 1:草稿   2:等待开始
     * @param isAutoSub 自动提交（是自动提交的时候会传该值，不是自动的时候不传）
     */
    saveSingle(type: number, isAutoSub?: boolean) {
        // 确认提交时才去校验
        if (type === 2) {
            // 应用推送校验
            if (this.segmentDataService.segmentInfo['channelType'] === 1 && !this.app.checkParam()) {
                return false;
            }
            // 短信校验
            if (this.segmentDataService.segmentInfo['channelType'] === 2 && !this.sms.checkParam()) {
                return false;
            }
            // 邮件校验
            if (this.segmentDataService.segmentInfo['channelType'] === 3 && !this.edm.checkParam()) {
                return false;
            }
        }

        this.segmentDataService.segmentInfo['status'] = type; // 投放类型  草稿还是提交投放

        const requestObj = this.processReqData(this.segmentDataService.segmentInfo, this.segmentDataService.segmentInfo['channelType'])

        if (!this.segmentId) { // 新建投放
            this.activityCenterService.saveSingleSegment(requestObj).subscribe(data => {
                if (data.code === 200) {
                    this.segmentId = data['data']['id'];
                    this.segmentDataService.isUpdate = 1;

                    if (!isAutoSub) {
                        this.notification.create('success', '提示', '创建成功');
                        $scope.modalRef.triggerCancel();
                        $scope.initContentData();
                    } else {
                        $scope.isAutoSaved = true;
                    }
                } else {
                    this.notification.create('warning', '错误提示', data.message);
                }
            });
        } else { // 修改投放
            this.activityCenterService.updateSingleSegment(requestObj).subscribe(data => {
                if (data.code === 200) {
                    if (!isAutoSub) {
                        this.notification.create('success', '提示', '修改成功');
                        $scope.modalRef.triggerCancel();
                        $scope.initContentData();
                    }
                } else {
                    this.notification.create('warning', '错误提示', data.message);
                }
            });
        }
    }

    // 处理回显的应用投放数据
    formatSegmentData(data: any) {
        if (data.timeToLive) {
            data['ttlType'] = true;
        }
        let length = data.iosData && data.iosData.length || 0;
        for (let i = 0; i < length; i++) {
            if (data.iosData[i].action === 1) {
                data.iosData[i].action = true;
            } else {
                data.iosData[i].action = false;
            }
            // if (data.iosData[i].timeToLive) {
            //     data.iosData[i].ttlType = true;
            // }
            data.iosData[i].sound === '1' ? data.iosData[i].sound = true : data.iosData[i].sound = false;
            data.iosData[i].badge ? data.iosData[i].digitalAngle = true : data.iosData[i].digitalAngle = false;
            if (data.iosData[i].extendAttr && data.iosData[i].extendAttr.length) {
                data.iosData[i].isVibration = true;
                const length1 = data.iosData[i].extendAttr.length;
                const tempArray: any = [];
                for (let j = 0; j < length1; j++) {
                    if (data.iosData[i].extendAttr[j].key) {
                        tempArray.push(data.iosData[i].extendAttr[j]);
                    }
                }
                data.iosData[i].extendAttr = tempArray;
            }
        }

        length = data.androidData && data.androidData.length || 0;
        for (let i = 0; i < length; i++) {
            data.androidData[i].vibrate = !!data.androidData[i].vibrate;
            data.androidData[i].wakeup = !!data.androidData[i].wakeup;
            data.androidData[i].clearable ? data.androidData[i].clearable = false : data.androidData[i].clearable = true;
            if (data.androidData[i].action === 1) {
                data.androidData[i].action = true;
            } else {
                data.androidData[i].action = false;
            }
            // if (data.androidData[i].timeToLive) {
            //     data.androidData[i].ttlType = true;
            // }
            if (data.androidData[i].extendAttr && data.androidData[i].extendAttr.length) {
                data.androidData[i].isVibration = true;
                const length2 = data.androidData[i].extendAttr.length;
                const tempArray: any = [];
                for (let j = 0; j < length2; j++) {
                    if (data.androidData[i].extendAttr[j].key) {
                        tempArray.push(data.androidData[i].extendAttr[j]);
                    }
                }
                data.androidData[i].extendAttr = tempArray;
            }
        }

        return data;
    }

    // 生成UUID
    guid() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    sort(sort: {key: string, value: string}): void {
        $scope.vm.content.orderBy = sort.key;
        $scope.vm.content.order = sort.value === 'ascend' ? 'asc' : 'desc'
        $scope.initContentData();
//        this.sortName = sort.key;
//        this.sortValue = sort.value;
//        this.search();
    }

    downloadData() {
        let _that = this;

        let paraObj: any = {
            productId: $scope.productId,
            name: $scope.vm.filter.activityNameValue,
            page: $scope.vm.content.pageIndex,
            pageSize: $scope.vm.content.pageSize,
            orderBy: $scope.vm.content.orderBy,
            order: $scope.vm.content.order,
        };

        if ($scope.vm.filter.advanced) {
            let activityType = $scope.vm.filter.activityTypeValue;
            if (activityType) {
                paraObj.type = activityType;
            }

            let activityState = $scope.vm.filter.activityStateValue;
            if (activityState != null) {
                paraObj.status = activityState;
            }

            let activityTime = $scope.vm.filter.activityTimeValue;
            if (activityTime.length > 0) {
                let startTimeBegin;
                let startTimeEnd;
                if (activityTime && activityTime[0]) {
                    const date1 = activityTime[0];
                    startTimeBegin = this.commonService.getDateStr(date1);
                }
                if (activityTime && activityTime[1]) {
                    const date2 = activityTime[1];
                    startTimeEnd = this.commonService.getDateStr(date2);
                }
                paraObj.startTimeBegin = startTimeBegin;
                paraObj.startTimeEnd = startTimeEnd;
            }
        }

        this.activityCenterService.download(paraObj).subscribe((response: any) => {
//            if (response && response.code === 200) {
//                _that.message.create('error', response.message);
//            }
        });
    }

    goPage(hash) {
        this.commonService.goPage(hash);
    }
}
