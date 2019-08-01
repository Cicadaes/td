import {Component, Injector, OnInit, OnChanges} from '@angular/core';
import {MarketingActivitiesService} from './marketing-activities.service';
import {BaseComponent} from '../../common/base-component';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {getMessageByEventType} from '../../utils/post-message';

@Component({
    selector: 'app-marketing-activities',
    templateUrl: './marketing-activities.component.html',
    styleUrls: ['./marketing-activities.component.less']
})
export class MarketingActivitiesComponent extends BaseComponent implements OnInit, OnChanges {

    setTimeoutParam: any;

    campaignId: number;

    actVO: any = {
        name: null,
        time: [new Date(), new Date()],
        creator: null,
        updater: null,
        desc: null,
        status: 1
    };

    globalControlList: any = [];

    globalControlMap: any = {};

    // 计划目标
    planTargetList: any = [];

    planTargetCodeList: any = [];  // 请求获取计划目标列表时使用；

    indicatorList = [];

    indicatorMap: any = {};
    indicatorCodeMap: any = {};

    // 权益设置
    equityList: any = [];
    equityMap: any = {};

    // pipeline
    pipelineList: any = [];

    nameEdit: any = false;
    timeEdit: any = false;
    descEdit: any = false;

    disabledDate = (current: Date): boolean => {
        return differenceInCalendarDays(current, new Date()) < 1;
    };

    targetValueMap: any = {};

    addPipelineDisalbe: any = false;
    addDisalbeDesc: any = '';

    equitySettingEnable: any = true;

    // -----------pipeline--------------
    pipelineStateMap: any = {
        1: '草稿',
        2: '申请中',
        3: '审批未通过',
        4: '审批通过（等待运行）',
        5: '运行中',
        6: '已下线',
        7: '流程已结束',
        8: '流程已结束提前终止',
    };

    pipelineConfigStatus: any = false;
    // -----------pipeline_end--------------
    customRequest: any = (config: any) => {
        config.onSuccess = (response: any) => {
        };
    }

    // 文件上传事件
    handleChange(event: any, item: any) {
        if (event.type === 'success') {
            const responseFile = event.file.response;
            if (responseFile.code === 200) {
                item.uploadUUID = responseFile.data.uploadUUID;
                item.uuidChange = true;
                item.rightsFile = event.file.name;

                const _item = item;
                this.marketingActivitiesService.getEquityAmount(item.uploadUUID).subscribe((response: any) => {
                    if (response.code && response.code === 200) {
                        _item.total = response.data;
                    } else if (response.code) {
                        this.message.create('error', response.message);
                    }
                });
            } else if (responseFile.code) {
                this.message.create('error', responseFile.message);
            }
        }
    }

    beforeUpload = (file: File) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            this.message.error('文件大小不能超过2M');
        }
        return isLt2M;
    }

    constructor(public marketingActivitiesService: MarketingActivitiesService,
                private injector: Injector) {

        super(injector);
        this.initRouterList('活动详情');
    }

    ngOnInit() {
        const _that = this;

        const campaignId = _that.route.snapshot.params['campaignId'];
        if (campaignId) {
            this.campaignId = parseInt(campaignId);
        }

        // ========================
        getMessageByEventType('buttonList');
        window.addEventListener('message', function (event: any) {
            if (event.data && typeof event.data === 'string') {
                const data = JSON.parse(event.data);
                if (data && data.eventInfo && data.eventInfo.data) {
                    const buttonList = data.eventInfo.data;
                    for (let i = 0; i < buttonList.length; i++) {
                        const obj = buttonList[i];
                        if (obj.action === 'equitySetting') {
                            _that.equitySettingEnable = true;
                        }
                    }
                }
            }
        });
        // ========================

        // 活动查询
        this.marketingActivitiesService.getCampaignById(this.campaignId).subscribe((response: any) => {

            if (response.data) {
                _that.actVO.name = response.data.name;
                _that.actVO.nameOld = response.data.name;
                _that.actVO.desc = response.data.description;
                _that.actVO.descOld = response.data.description;
                _that.actVO.creator = response.data.creator;
                _that.actVO.updater = response.data.updater;
                _that.actVO.status = response.data.status;
            }
            if (response.data && response.data.startTime && response.data.endTime) {
                const startTime = new Date(response.data.startTime);
                const endTime = new Date(response.data.endTime);
                _that.actVO.time = [startTime, endTime];
            }

            if (response.data && response.data.endTime) {

                let endTime = response.data.endTime.substr(0, 10);
                let today = new Date();
                let todayStr = this.commonService.getDateStr(today);
                if (endTime === todayStr) {
                    this.addPipelineDisalbe = true;
                    this.addDisalbeDesc = '营销活动剩余时间不足一天无法创建pipeline';
                }
            }

        });

        // 全局管控
        this.marketingActivitiesService.getGlobalControlOptions().subscribe((response: any) => {
            if (response.data) {
                for (const propKey in response.data) {

                    const obj = {
                        desc: response.data[propKey],
                        propKey: propKey,
                        propValue: 1,
                        selected: false
                    };

                    _that.globalControlMap[propKey] = obj;
                    _that.globalControlList.push(obj);
                }

                // 全局管控
                this.marketingActivitiesService.getGlobalControlByCampaignId(this.campaignId).subscribe((response2: any) => {
                    if (response2.data) {
                        for (let i = 0; i < response2.data.length; i++) {
                            const obj = response2.data[i];
                            const storedObj = _that.globalControlMap[obj.propKey];
                            storedObj.propValue = obj.propValue;
                            storedObj.selected = obj.selected === 1;

                            storedObj.id = obj.id;
                            storedObj.campaignId = obj.campaignId;
                        }
                    }
                });
            }
        });

        // // 计划目标配置-列表
        // this.marketingActivitiesService.targetConfigs().subscribe((response: any) => {
        //     if (response.data && response.data.data && response.data.data.length > 0) {
        //         const tmpList = [];
        //         for (let i = 0; i < response.data.data.length; i++) {
        //             const obj = response.data.data[i];
        //             tmpList.push({
        //                 value: obj.id,
        //                 name: obj.name
        //             });
        //             _that.indicatorMap[obj.id] = obj.name;
        //             _that.indicatorCodeMap[obj.id] = obj.code;
        //         }
        //         _that.indicatorList = tmpList;
        //     }

        //     _that.getTargetList();
        // });
        this.processTarget();

        this.getEquityList();

        this.getPipelineList();

    }

    /**
     * 处理计划目标
     */
    async processTarget(){
        const _that = this;
        
        await _that.getTargetList();

        await _that.getAllTarget();

        _that.configIndiList();
    }

    configIndiList() {
        // 准备已选值map
        this.targetValueMap = {};
        for (let i = 0; i < this.planTargetList.length; i++) {
            const obj = this.planTargetList[i];
            if (obj.targetConfigId) {
                this.targetValueMap[obj.targetConfigId] = 1;
            }
        }

        // 根据已选值筛选备选列表
        for (let i = 0; i < this.planTargetList.length; i++) {
            const obj = this.planTargetList[i];

            const indicatorListMin = [];
            for (let j = 0; j < this.indicatorList.length; j++) {
                const obj1 = this.indicatorList[j];

                if (!this.targetValueMap[obj1.value] || obj.targetConfigId == obj1.value) {
                    indicatorListMin.push(obj1);
                }
            }
            obj.indicatorListMin = indicatorListMin;
        }
    }

    private getAllTarget() {
        const _that = this;
        return new Promise((resolve,reject)=>{
            // 计划目标配置-列表
            // this.marketingActivitiesService.targetConfigs().subscribe((response: any) => {
            this.marketingActivitiesService.targetConfigsEcho(_that.planTargetCodeList).subscribe((response: any) => {
                if (response.data && response.data.data && response.data.data.length > 0) {
                    const tmpList = [];
                    for (let i = 0; i < response.data.data.length; i++) {
                        const obj = response.data.data[i];
                        tmpList.push({
                            value: obj.id,
                            name: obj.name,
                            status: obj.status
                        });
                        _that.indicatorMap[obj.id] = obj.name;
                        _that.indicatorCodeMap[obj.id] = obj.code;
                    }
                    _that.indicatorList = tmpList;
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    // 计划目标
    private getTargetList() {
        const _that = this;
        return new Promise((resolve,reject)=>{
            this.marketingActivitiesService.getCampaignTargets(this.campaignId).subscribe((response: any) => {
                if (response.data) {
                    const tmplist = [];
                    for (let i = 0; i < response.data.data.length; i++) {
                        const obj = response.data.data[i];
                        // 最多四条，多出的忽略
                        if (i > 3) {
                            break;
                        }
                        tmplist.push({
                            id: obj.id,
                            campaignId: obj.campaignId,
                            targetConfigId: obj.targetConfigId + '',
                            epected: obj.value,
                            name: obj.name,
                            isEdit: false
                        });
                        _that.planTargetCodeList.push(obj.targetConfigCode);
                    }
                    _that.planTargetList = tmplist;
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    // 权益设置
    private getEquityList() {
        const _that = this;
        this.marketingActivitiesService.findEquityByCampaignId(this.campaignId).subscribe((response: any) => {
            if (response.data) {
                const tmplist = [];
                for (let i = 0; i < response.data.length; i++) {
                    const obj = response.data[i];
                    tmplist.push({
                        id: obj.id,
                        campaignId: obj.campaignId,
                        name: obj.name,
                        rightsFile: obj.attachmentName,
                        remain: obj.remain,
                        total: obj.total,
                        remainPrecent: obj.remainPrecent,
                        usePrecent: obj.usePrecent,
                        isEdit: false
                    });
                    _that.equityMap[obj.id] = obj.total;
                }
                _that.equityList = tmplist;
            }
        });
    }

    getPipelineList() {
        const _that = this;
        this.marketingActivitiesService.getPipelineList(this.campaignId).subscribe((response: any) => {
            if (response && response.code === 200) {
                const tmplist = [];
                for (let i = 0; i < response.data.length; i++) {
                    const obj = response.data[i];
                    let start = '';
                    if (obj.startTime && obj.startTime.length >= 10) {
                        start = obj.startTime.substr(0, 10);
                    }
                    let end = '';
                    if (obj.endTime && obj.endTime.length >= 10) {
                        end = obj.endTime.substr(0, 10);
                    }

                    // 兼容，将precent转成percent
                    for (let j = 0; j < obj.pipelineEquityVos.length; j++) {
                        const obj1 = obj.pipelineEquityVos[j];
                        obj1.percent = obj1.precent;
                    }
                    tmplist.push({
                        id: obj.id,
                        name: obj.name,
                        date: start + ' ~ ' + end,
                        status: obj.status,
                        reason: obj.reason,
                        configList: obj.pipelineEquityVos
                    });
                }
                _that.pipelineList = tmplist;

                _that.caculatePipelineMax();
            } else {
                _that.message.create('error', response.message);
            }
        });
    }

    // =================活动管理==================

    checkCampagion() {
        if (!this.actVO.name) {
            this.message.create('error', '请输入活动名称');
            this.nameEdit = true;
            return false;
        }
        if (this.actVO.name && this.actVO.name.length > 26) {
            this.message.create('error', '活动名称应不大于26个字符');
            this.timeEdit = true;
            return false;
        }

        if (this.actVO.desc && this.actVO.desc.length > 80) {
            this.message.create('error', '描述应不大于80个字符');
            this.descEdit = true;
            return false;
        }

        return true;
    }

    saveCampagin(time?: any) {
        if (!this.checkCampagion()) {
            return;
        }

        this.nameEdit = false;
        this.timeEdit = false;
        this.descEdit = false;

        const body = {
            'id': this.campaignId,
            'name': this.actVO.name,
            'description': this.actVO.desc,
            'startTime': this.commonService.getDateStr(this.actVO.time[0]) + ' 00:00:00',
            'endTime': this.commonService.getDateStr(this.actVO.time[1]) + ' 23:59:59'
        };

        if (time) {
            this.marketingActivitiesService.updateCampaigns(body).subscribe((response: any) => {
                if (response.code === 200 && response.data) {
                    this.actVO.updater = response.data.updater;
                    this.message.create('success', `保存成功`);
                } else {
                    this.actVO.name = this.actVO.nameOld;
                    this.actVO.desc = this.actVO.descOld;
                    this.actVO.time = this.actVO.timeOld;
                    this.message.create('error', response.message);
                }
            });
        } else {
            this.marketingActivitiesService.updateCampaignsSimple(body).subscribe((response: any) => {
                if (response.code === 200 && response.data) {
                    this.message.create('success', `保存成功`);
                    this.actVO.updater = response.data.updater;
                } else {
                    this.actVO.name = this.actVO.nameOld;
                    this.actVO.desc = this.actVO.descOld;
                    this.message.create('error', response.message);
                }
            });
        }
    }

    // =================全局管控==================

    saveGlobal(item: any) {
        if (!item.propValue) {
            item.propValue = 1;
        }
        const body = {
            'campaignId': item.campaignId || this.campaignId,
            'id': item.id,
            'propKey': item.propKey,
            'propValue': item.propValue,
            'selected': item.selected ? 1 : 0,
        };
        this.marketingActivitiesService.updateGlobalcontrols(body).subscribe((response: any) => {
            if (response.code && response.code === 200) {
                this.message.create('success', `保存成功`);
                // 第一次保存，反写id，并初始化值为0
                if (!item.id) {
                    item.id = response.data;
                    item.propValue = 0;
                }
            } else {
                this.message.create('error', response.message);
            }
        });
    }

    // =================计划目标==================

    // 创建和更新
    updatePlanTarget(target: any) {
        if (!target.targetConfigId || !target.epected) {
            this.message.create('error', '请输入相应的值');
            return;
        }
        const body = {
            'campaignId': target.campaignId,
            'targetConfigId': parseInt(target.targetConfigId),
            'targetConfigCode': this.indicatorCodeMap[target.targetConfigId],
            'name': this.indicatorMap[target.targetConfigId],
            'value': target.epected,
        };

        if (target.id) {
            body['id'] = target.id;
            this.marketingActivitiesService.updateCampaignTargets(body).subscribe((response: any) => {
                if (response.code && response.code === 200) {
                    this.message.create('success', `保存成功`);
                    target.isEdit = false;
                } else if (response.code) {
                    this.message.create('error', response.message);
                }
            });
        } else {
            this.marketingActivitiesService.createCampaignTargets(body).subscribe((response: any) => {
                if (response.code && response.code === 200) {
                    this.message.create('success', `保存成功`);
                    target.id = response.data.id;
                    target.isEdit = false;
                } else if (response.code) {
                    this.message.create('error', response.message);
                }
            });
        }
    }

    // 删除
    deletePlanTarget(target: any, index: any) {
        const _this2 = this;
        if (target.id) {
            this.modalService.confirm({
                nzTitle: '提示',
                nzContent: `确定要删除？`,
                nzOnOk: () => { 
                    this.marketingActivitiesService.deleteCampaignTargets(target.id).subscribe(async (response: any) => {
                        if (response.code && response.code === 200) {
                            _this2.message.create('success', `删除成功`);
                            await _this2.getTargetList();
                            _this2.configIndiList();
                        }
                    });
                }
            });

        } else {
            this.planTargetList.splice(index, 1);
            this.configIndiList();
        }
    }

    cachePlanTarget(item: any) {
        item.targetConfigIdOld = item.targetConfigId;
        item.epectedOld = item.epected;
    }

    restorePlanTarget(item: any, index: any) {
        if (!item.id) {
            this.planTargetList.splice(index, 1);
            this.configIndiList();
        } else {
            item.targetConfigId = item.targetConfigIdOld;
            item.epected = item.epectedOld;
        }
    }

    // =================权益配置==================

    // 创建和更新
    updateEquity(target: any) {
        if (!target.name || !target.total) {
            this.message.create('error', '请输入相应的值');
            return;
        }

        if (target.name && target.name.length > 26) {
            this.message.create('error', '权益名称不能大于26个字符');
            return;
        }

        const reg = /^[A-Za-z0-9\u4e00-\u9fa5\-_]+$/;
        if (target.name && !reg.test(target.name)) {
            this.message.error('权益名称中含有特殊字符');
            return;
        }

        const _that = this;
        const body: any = {
            name: target.name,
        };
        if (target.id) {
            body['equityConfigId'] = target.id;
            if (target.uuidChange) {
                body['total'] = target.total;
                body['uploadUUID'] = target.uploadUUID;
            }
            this.marketingActivitiesService.updateEquity(body).subscribe((response: any) => {
                if (response.code && response.code === 200) {
                    this.message.create('success', `保存成功`);
                    this.getPipelineList();
                    target.isEdit = false;
                    target.uuidChange = false;
                } else if (response.code) {
                    this.message.create('error', response.message);
                }
            });
        } else {
            body['campaignId'] = this.campaignId;
            body['total'] = target.total;
            body['uploadUUID'] = target.uploadUUID;
            this.marketingActivitiesService.createEquity(body).subscribe((response: any) => {
                if (response.code && response.code === 200) {
                    this.message.create('success', `保存成功`);
                    this.getPipelineList();
                    target.isEdit = false;
                    target.id = response.data.id;
                    target.uuidChange = false;

                    // 补充数据供pipeline配比使用
                    _that.equityMap[target.id] = target.total;
                } else if (response.code) {
                    this.message.create('error', response.message);
                }
            });
        }
    }

    // 删除
    deleteEquity(target: any, index: any) {
//        const _this2 = this;
        if (target.id) {
            this.modalService.confirm({
                nzTitle: '提示',
                nzContent: `确定要删除？`,
                nzOnOk: () => {
                    this.marketingActivitiesService.deleteEquity(target.id).subscribe((response: any) => {
                        if (response.code && response.code === 200) {
                            this.message.create('success', `删除成功`);
                            this.getPipelineList();
                            this.getEquityList();
                        } else {
                            this.message.create('error', response.message);
                        }
                    });
                }
            });
        } else {
            this.equityList.splice(index, 1);
        }
    }

    cacheEquity(item: any) {
        item.nameOld = item.name;
        item.rightsFileOld = item.rightsFile;
        item.totalOld = item.total;
    }

    restoreEquity(item: any, index: any) {
        if (!item.id) {
            this.equityList.splice(index, 1);
        } else {
            item.name = item.nameOld;
            item.rightsFile = item.rightsFileOld;
            item.total = item.totalOld;
        }

    }

    // =================Pipeline==================
    createPipeline() {
        if (this.addPipelineDisalbe) {
            return;
        }
        this.marketingActivitiesService.createPipeline(this.campaignId).subscribe((response: any) => {
            if (response.code && response.code === 200) {
                this.message.create('success', `创建成功`);
                this.gotoPipeline(response.data);
            } else {
                this.message.create('error', response.message);
            }
        });
    }

    updatePipeline(item: any) {

        const that = this;

        const postList = [];
        for (let i = 0; i < item.configList.length; i++) {
            const obj = item.configList[i];
            postList.push({
                'code': obj.code,
                'count': obj.count,
                'equityId': obj.equityId,
                'id': obj.id,
                'name': obj.name,
                'pipelineId': obj.pipelineId,
                'precent': obj.percent,
            });
        }

        this.marketingActivitiesService.updatePipelineEquity(postList).subscribe((response: any) => {
            if (response.code && response.code === 200) {

                if (that.setTimeoutParam) {
                    clearTimeout(that.setTimeoutParam);
                }
                that.setTimeoutParam = setTimeout(function () {
                    that.message.create('success', `更新成功`);
                    that.getPipelineList();
                }, 500);

            } else {
                this.message.create('error', response.message);
            }
        });
    }

    // 调整pipeline配比
    changePipelineEquity(config: any, propName: any, item: any) {

        const total = this.equityMap[config.equityId];
        if (propName === 'count') {
//            if (config.count > config.countMax) {
//                config.count = config.countMax;
//            }
            let tmpValue = config.count * 100 / total;
            if (tmpValue > config.percentMax) {
                tmpValue = config.percentMax;
            }
            config.percent = tmpValue.toFixed(2);
        } else if (propName === 'percent') {
//            if (config.percent > config.percentMax) {
//                config.percent = config.percentMax;
//            }
            let tmpValue = config.percent * total / 100;
            if (tmpValue > config.countMax) {
                tmpValue = config.countMax;
            }
            config.count = Math.round(tmpValue);
        }
        this.caculatePipelineMax();
//        this.updatePipeline(item);
    }

    updatePipelineAll() {
        for (let i = 0; i < this.pipelineList.length; i++) {
            const obj = this.pipelineList[i];

            if ((this.actVO.status == 1 || this.actVO.status == 2 || this.actVO.status == 3)
                && !(obj.status === 2 || obj.status === 4 || obj.status === 5 || obj.status === 7)) {
                this.updatePipeline(obj);
            }
        }
    }

    caculatePipelineMax() {

        // 储存所有已录入的值
        let equityCountMap = {};
        let equityPercentMap = {};
        for (let i = 0; i < this.pipelineList.length; i++) {
            const obj = this.pipelineList[i];
            for (let j = 0; j < obj.configList.length; j++) {
                const obj1 = obj.configList[j];
                if (!equityCountMap[obj1.name]) {
                    equityCountMap[obj1.name] = [];
                }
                if (!equityPercentMap[obj1.name]) {
                    equityPercentMap[obj1.name] = [];
                }
                equityCountMap[obj1.name].push(obj1.count);
                equityPercentMap[obj1.name].push(obj1.percent ? parseFloat(obj1.percent) : 0);
            }
        }

        for (let i = 0; i < this.pipelineList.length; i++) {
            const obj = this.pipelineList[i];
            for (let j = 0; j < obj.configList.length; j++) {
                const obj1 = obj.configList[j];

                // 根据已录入的值和总量，计算可用余量
                const equityCountList = equityCountMap[obj1.name];
                let countColl = 0;
                for (let k = 0; k < equityCountList.length; k++) {
                    if (k !== i) {
                        countColl += equityCountList[k]
                    }
                }
                obj1.countColl = countColl;
                obj1.countMax = this.equityMap[obj1.equityId] - countColl;

                // 根据已录入的值和总量，计算可用余量
                const equityPercentList = equityPercentMap[obj1.name];
                let percentColl = 0;
                for (let k = 0; k < equityPercentList.length; k++) {
                    if (k !== i) {
                        percentColl += equityPercentList[k]
                    }
                }
                obj1.percentColl = percentColl;
                obj1.percentMax = 100 - percentColl;
            }
        }
    }

    deletePipeline(id: any) {
        const _this2 = this;
        this.modalService.confirm({
            nzTitle: '提示',
            nzContent: `确定要删除？`,
            nzOnOk: () => {
                this.marketingActivitiesService.deletePipeline(id).subscribe((response: any) => {
                    if (response.code && response.code === 200) {
                        _this2.message.create('success', `删除成功`);
                        _this2.getPipelineList();
                    }
                });
            }
        });
    }

    gotoPipeline(pipelineId: any) {
        this.goInto({
            name: '',
            url: '/pipeline',
            params: {
                campaignId: this.campaignId,
                pipelineId: pipelineId
            }
        });
    }

    restorePipeline() {
        this.getPipelineList();
    }

    // =================页面行为==================

    clearFile(item: any) {
        item.rightsFile = null;
        item.total = null;
    }

    isoDateToStr(date) {
        const dateLong = date.getTime() + 8 * 3600 * 1000;
        const str = (new Date(dateLong)).toISOString();
        const retValue = str.replace('T', ' ').replace('Z', '');
        return retValue;
    }

    timeClick(event) {
        event.stopPropagation();
        if (this.actVO.status === 1) {
            this.timeEdit = true;
            this.actVO.timeOld = this.actVO.time;
        }
    }

    timeChange() {
        this.timeEdit = false;
        this.saveCampagin('time');
    }

    pageClick(event) {
        this.timeEdit = false;
        if (this.descEdit) {
            if (this.actVO.desc !== this.actVO.descOld) {
                this.saveCampagin();
            } else {
                this.descEdit = false;
            }
        }
    }

    descClick(event) {
        event.stopPropagation();
        if (this.actVO.status === 1 || this.actVO.status === 2 || this.actVO.status === 3) {
            this.actVO.descOld = this.actVO.desc;
            this.descEdit = true;
        }
    }

    addPlanTarget() {
        if (this.planTargetList.length >= 4) {
            return;
        }
        for (let i = 0; i < this.planTargetList.length; i++) {
            const obj = this.planTargetList[i];
            if (obj.isEdit) {
                this.message.create('error', '请先保存计划目标');
                return;
            }
        }

        this.planTargetList.push({
            id: null,
            campaignId: this.campaignId,
            targetConfigId: null,
            name: null,
            epected: null,
            isEdit: true
        });
        this.configIndiList();
    }

    addRightsSetting() {
        if (this.equityList.length < 4) {
            this.equityList.push({
                name: null,
                rightsFile: null,
                total: 0,
                isEdit: true
            });
        }
    }

    gotoReport() {
        this.goInto({
            name: '',
            url: '/effect-report/report',
            params: {
                campaignId: this.campaignId
            }
        });
    }
}
