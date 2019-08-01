import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem, Message } from 'primeng/primeng';
import * as moment from 'moment';

import { UtilesService } from './../../../../common/utiles.service';
import { PipelineNodeCommunicationService } from './../../../../services/communication/pipeline-node.communication.service';
import { AppConfResourceService } from './../../../../services/campaign/app_conf.resource.service';
import { EquityConfigResourceService } from '../../../../services/campaign/equity_config.resource.service';
import { PipelineDefinitionResourceService } from '../../../../services/admin/pipeline-definition.resource.service';
import { PipelineSegmentGroups } from '../../../../services/campaign/pipeline_segment_groups.resource.service';
import { ErrorHandlingService } from '../../../../services/exceptional/error-handling.service';
import { CampaignDetailExceptionalCommunication } from '../../../../services/exceptional/campaign-detail-exceptional.service';

@Component({
    selector: 'push-pipe',
    templateUrl: 'push-pipe.component.html',
    styleUrls: ['push-pipe.component.scss'],
    providers: [
        UtilesService,
        AppConfResourceService,
        EquityConfigResourceService,
        PipelineDefinitionResourceService,
        PipelineSegmentGroups
    ]
})

//push推广管道
export class PushPipeComponent {
    campaignId: number; // 活动id
    pipelineDefinitionId: number;
    isRightNow: boolean = false; // 立即发送
    isFixTime: boolean = false; // 定时发送
    isLoopTime: boolean = false; // 循环发送

    selectedLoop: boolean = false; // 选择循环发送

    sendType: number;//发送类型  1：立即  2：定时  3：循环
    subTriggerType: number; // 循环发送选择类型

    //页面初始化所需值
    groupList: SelectItem[];
    period: SelectItem[];
    outlineTime: SelectItem[];
    week: SelectItem[];
    month: SelectItem[];
    hours: SelectItem[];
    minutes: SelectItem[];

    isAndroid: boolean = true; // 是Android平台
    isIOS: boolean = false; // 是IOS平台

    channels: SelectItem[]; // app列表
    appConfig: any;

    sendTime: any;//发送的时间
    selectedHous: number = 0; // 定时发送选中的小时
    selectedMins: number = 0; // 定时发送选中的分钟
    cycleVal: number = 1; // 循环类型是每周或每月时使用
    cycleHour: number = 0; // 循环发送选中的小时
    cycleMinute: number = 0; // 循环发送选中的分钟

    androidPushTypes: SelectItem[]; // Android推送类型
    iosPushTypes: SelectItem[]; // IOS推送类型
    offLinePushTimes: SelectItem[]; // 保留推送的时间
    keyValues: any = []; // 键值对参数

    isCustomSound: boolean = false; // 是否自定义声音
    isCustomBadge: boolean = false; // 是否自定义角标

    customArgumentsFlag: boolean = false; // 是否存在自定义参数

    offlineDataRetentionTimeFlag: boolean = false; // 是否为离线用户保留推送消息

    msgs: Message[] = [];

    quoteList: SelectItem[] = [];

    isListenQuillEvent: boolean = false;  //是否已经监听富文本框文本改变事件
    rangeIndex: number; // 光标位置

    showGroupList: boolean = false; //显示投放组下拉列表
    pipelineGroupList: any[] = [];  //投放组下拉列表

    @Input() nodeData: any;
    @Input() startTime: any;
    @Input() endTime: any;

    @ViewChild('androidEditor') androidEditor: any;
    @ViewChild('iosEditor') iosEditor: any;

    constructor(
        public pipelineNodeCommunicationService: PipelineNodeCommunicationService,
        public utilesService: UtilesService,
        public appConfResourceService: AppConfResourceService,
        private activatedRoute: ActivatedRoute,
        private equityConfigResourceService: EquityConfigResourceService,
        private pipelineDefinitionResourceService: PipelineDefinitionResourceService,
        public pipelineSegmentGroups: PipelineSegmentGroups,
        public errorHandlingService: ErrorHandlingService,
		public campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication
    ) {
        let that = this;
        that.period = [
            { label: '每天', value: 3 },
            { label: '每周', value: 4 },
            { label: '每月', value: 5 }
        ];
        that.outlineTime = [
            { label: '4小时', value: null },
            { label: '8小时', value: null },
            { label: '1天', value: null },
            { label: '2天', value: null }
        ];
        that.week = [
            { label: '星期一', value: 2 },
            { label: '星期二', value: 3 },
            { label: '星期三', value: 4 },
            { label: '星期四', value: 5 },
            { label: '星期五', value: 6 },
            { label: '星期六', value: 7 },
            { label: '星期日', value: 1 },
        ];

        that.month = [];
        for (let i = 1; i < 32; i++) {
            that.month.push({ label: i + '号', value: i });
        };
        that.month.push({ label: '最后一天', value: 'last' });
        that.hours = [];
        for (let i = 0; i < 24; i++) {
            that.hours.push({ label: i + '时', value: i });
        }
        that.minutes = [];
        for (let i = 0; i < 60; i++) {
            that.minutes.push({ label: i + '分', value: i });
        }
        that.androidPushTypes = [];
        that.androidPushTypes.push({ label: 'TD推送', value: 'td' });

        that.iosPushTypes = [];
        that.iosPushTypes.push({ label: 'APNS生产通道', value: 'prod' });        
        that.iosPushTypes.push({ label: 'APNS测试通道', value: 'dev' });

        that.offLinePushTimes = [];
        that.offLinePushTimes.push({ label: "请选择时间", value: "" });
        that.offLinePushTimes.push({ label: "4小时", value: "4" });
        that.offLinePushTimes.push({ label: "8小时", value: "8" });
        that.offLinePushTimes.push({ label: "1天", value: "24" });
        that.offLinePushTimes.push({ label: "2天", value: "48" });
    }

    ngOnChanges() {
        let that = this;
        that.rangeIndex = undefined;
        that.appConfig = null;
        that.campaignId = that.activatedRoute.snapshot.params['id'];
        that.pipelineDefinitionId = that.activatedRoute.snapshot.params['pipeLineId'];
        // 当切换组件时，需要将一些变量初始化
        that.keyValues = [];

        that.isIOS = false;
        that.isAndroid = true;

        that.offlineDataRetentionTimeFlag = false;

        that.isCustomSound = false;
        that.isCustomBadge = false;

        that.isFixTime = false;
        that.isRightNow = false;
        that.isLoopTime = false;

        that.customArgumentsFlag = false;

        that.sendTime = '';
        that.selectedHous = 0;
        that.selectedMins = 0;
        that.cycleHour = 0;
        that.cycleMinute = 0;
        that.cycleVal = 1;
        that.sendType = 1;

        that.selectedLoop = false; // 是否选择循环发送重置为false

        if (that.nodeData.appid) {
            that.changeApp(that.nodeData.appid);
        }
        // 判断目标平台
        if (that.nodeData.platform) {
            if (that.nodeData.platform === 'ios') {
                that.isIOS = true;
                that.isAndroid = false;
                that.pipelineNodeCommunicationService.nodeData.channel = that.nodeData.channel ? that.nodeData.channel : 'td';
            }
            if (that.nodeData.platform === 'android') {
                that.isIOS = false;
                that.isAndroid = true;
                that.pipelineNodeCommunicationService.nodeData.channel = that.nodeData.channel ? that.nodeData.channel : 'prod';
            }
        } else {
            that.pipelineNodeCommunicationService.nodeData.platform = 'android';
            that.pipelineNodeCommunicationService.nodeData.channel = 'td';
        }
        //初始化投放时间
        if (that.nodeData.triggerType) {
            that.sendType = that.nodeData.triggerType;
            if (that.sendType == 1) {
                that.isRightNow = true;
            } else if (that.sendType == 2) {
                that.isFixTime = true;
                that.selectedLoop = false;
                // 初始化定时发送

                that.sendTime = that.nodeData.appointedTime ? that.nodeData.appointedTime : '';
                that.selectedHous = that.nodeData.appointedTime ? moment(that.sendTime).hours() : 0;
                that.selectedMins = that.nodeData.appointedTime ? moment(that.sendTime).minutes() : 0;
                that.sendTime = that.nodeData.appointedTime ? new Date((moment(that.sendTime).startOf('day')).toString()) : 0;
            } else if (that.sendType == 3) {
                that.isLoopTime = true;
                that.selectedLoop = true;
                // 解析cron并赋值
                let loopDate;
                if (that.nodeData.cronExpression) {
                    loopDate = that.utilesService.transformToObj(that.nodeData.cronExpression);
                } else {
                    loopDate = {};
                }
                that.subTriggerType = that.nodeData.subTriggerType;
                that.cycleVal = loopDate['cycleVal'] ? loopDate['cycleVal'] : 1;
                that.cycleHour = loopDate['cycleHour'] ? loopDate['cycleHour'] : 0;
                that.cycleMinute = loopDate['cycleMinute'] ? loopDate['cycleMinute'] : 0;
            }
        } else {
            let nowDate = new Date().getTime();
            let startTime = new Date(that.startTime).getTime();
            let endTime = new Date(that.endTime).getTime();
            if (nowDate < startTime || nowDate > endTime) {
                that.isFixTime = true;
                that.sendType = that.pipelineNodeCommunicationService.nodeData.triggerType = 2;
            } else {
                that.isRightNow = true;
                that.sendType = that.pipelineNodeCommunicationService.nodeData.triggerType = 1;
            }
        }

        // 初始化离线用户保存时间
        if (that.nodeData.timeToLive) {
            that.offlineDataRetentionTimeFlag = true;
        }

        // 初始化声音文件名
        if (that.nodeData.soundName) {
            that.isCustomSound = true;
        }

        // 初始化角注
        if (that.nodeData.badge) {
            that.isCustomBadge = true;
        }

        // 初始化自定义参数
        if (that.nodeData.extendAttr) {
            that.customArgumentsFlag = true;
            that.nodeData.extendAttr.map((el: any) => {
                that.keyValues.push({'key': el.key, 'value': el.value});
            });
        }
    }

    ngOnInit() {
        let that = this;

        // 初始化app列表
        that.channels = [];
        that.appConfResourceService.getAppList().then(data => {
            if (data && (data.retCode || data.msgDes)) {
                // campaignDetailExceptionalCommunication.exceptionalMission(res);
                return;
            }
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    that.channels.push({ label: data[i].appName, value: data[i].appId });
                }
            }
        }).catch();

        // 获取权益列表的数据
        that.pipelineDefinitionResourceService.getRemainEquity(that.pipelineDefinitionId).then((data) => {
            data.map((eq: any) => {
                that.quoteList.push({ label: eq.name, value: eq.name });
            });
            return that.pipelineDefinitionResourceService.getShortMessageLabel(that.pipelineDefinitionId)
        }).then((data) => {
            data.map((item: any) => {
                that.quoteList.push({ label: item, value: item });
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    ngAfterViewInit() {
        let that = this;
        //当编辑的时候 如果上次保存的为ios 这时候 that.androidEditor 并不存在
        if (that.androidEditor) {
            that.isListenQuillEvent = true;
            let quill = that.androidEditor.quill; //获取quill实例
            let limit = 240; // 限制富文本编辑器的长度
            quill.on('text-change', function (delta: any, old: any, source: any) {
                if (quill.getLength() > limit) {
                    quill.deleteText(limit, quill.getLength());
                }
                that.rangeIndex = quill.getLength() - 1;
            });
            quill.on('selection-change', function (range: any, oldRange: any, source: any) {
                if (range) {
                    if (range.length == 0) {
                        that.rangeIndex = range.index;
                    }
                }
            });
        }
    }

    //改变目标平台
    changePlatform(type: string) {
        let that = this;
        if (!that.pipelineNodeCommunicationService.editFlag) {
            return;
        }
        that.isIOS = false;
        that.isAndroid = false;
        that.appConfig = null;

        delete that.pipelineNodeCommunicationService.nodeData.appid;
        delete that.pipelineNodeCommunicationService.nodeData.action;
        delete that.pipelineNodeCommunicationService.nodeData.title;
        delete that.pipelineNodeCommunicationService.nodeData.message;
        delete that.pipelineNodeCommunicationService.nodeData.clearable;
        delete that.pipelineNodeCommunicationService.nodeData.vibrate;
        delete that.pipelineNodeCommunicationService.nodeData.wakeup;
        delete that.pipelineNodeCommunicationService.nodeData.soundName;
        delete that.pipelineNodeCommunicationService.nodeData.badge;

        if ('ios' === type) {
            that.isIOS = true;
            that.pipelineNodeCommunicationService.nodeData.platform = 'ios';
            that.isListenQuillEvent = false;
            that.pipelineNodeCommunicationService.nodeData.channel = 'prod';
        } else if ('android' === type) {
            that.isAndroid = true;
            that.pipelineNodeCommunicationService.nodeData.platform = 'android';
            that.pipelineNodeCommunicationService.nodeData.channel = 'td';
            if (!that.isListenQuillEvent) {
                setTimeout(function () {
                    if (that.androidEditor) {
                        that.isListenQuillEvent = true;
                        let quill = that.androidEditor.quill; //获取quill实例
                        let limit = 240; // 限制富文本编辑器的长度
                        quill.on('text-change', function (delta: any, old: any, source: any) {
                            if (quill.getLength() > limit) {
                                quill.deleteText(limit, quill.getLength());
                            }
                            that.rangeIndex = quill.getLength() - 1;
                        });
                        quill.on('selection-change', function (range: any, oldRange: any, source: any) {
                            if (range) {
                                if (range.length == 0) {
                                    that.rangeIndex = range.index;
                                }
                            }
                        });
                    }
                }, 1);
            }
        }
    }

    delKeyValue(index: any) {
        let that = this;
        that.keyValues.splice(index, 1);
        that.pipelineNodeCommunicationService.nodeData.extendAttr = that.keyValues;
    }

    addKeyValue() {
        let that = this;
        if (!that.pipelineNodeCommunicationService.editFlag) {
            return;
        }
        let keyValues = that.keyValues;
        let flag = that.checkKeyValues(keyValues);
        if (flag) {
            keyValues.push({key: '', value: ''});
        } else {
            that.showMessageNews('error', '填写完整的键值对后方可新增！');
        }
    }

    /**
     * 静默消息推送
     */
    changeAction() {
        let that = this;
        if (!that.pipelineNodeCommunicationService.editFlag) {
            return;
        }
        that.pipelineNodeCommunicationService.nodeData.action = !that.pipelineNodeCommunicationService.nodeData.action;
    }

    // 检查键值对
    checkKeyValues(keyvalues: any) {
        for (let el of keyvalues) {
            if (el.key === '' || el.value === '') {
                return false;
            }
        }
        return true;
    }

    bindKeyValues() {
        if (this.pipelineNodeCommunicationService.nodeData) {
            this.pipelineNodeCommunicationService.nodeData.extendAttr = this.keyValues;
        }
    }

    //初始化发送类型
    initSendType() {
        let that = this;
        that.isRightNow = false;
        that.isFixTime = false;
        that.isLoopTime = false;

        delete that.pipelineNodeCommunicationService.nodeData.appointedTime;
        delete that.pipelineNodeCommunicationService.nodeData.cronExpression;
        delete that.pipelineNodeCommunicationService.nodeData.subTriggerType;

        that.sendTime = '';
        that.selectedHous = 0;
        that.selectedMins = 0;
        that.cycleHour = 0;
        that.cycleMinute = 0;
        that.cycleVal = 1;
    }

	/*
	 *triggerType:调度类型： 1、立即发送 2、定时发送 3、循环发送
	 */
    //选中立即发送
    changeRightNow() {
        let that = this;
        if (!that.pipelineNodeCommunicationService.editFlag) {
            return;
        }
        that.initSendType();

        that.sendType = that.pipelineNodeCommunicationService.nodeData.triggerType = 1;
        that.selectedLoop = false;
        that.isRightNow = true;
    }

    //选择定时发送
    changeFixTime() {
        let that = this;
        if (!that.pipelineNodeCommunicationService.editFlag) {
            return;
        }
        that.initSendType();

        that.sendType = that.pipelineNodeCommunicationService.nodeData.triggerType = 2;
        that.selectedLoop = false;
        that.isFixTime = true;
    }

    //选择循环发送
    changeLoop() {
        let that = this;
        if (!that.pipelineNodeCommunicationService.editFlag) {
            return;
        }
        that.initSendType();

        that.sendType = that.pipelineNodeCommunicationService.nodeData.triggerType = 3;
        that.isLoopTime = true;
        that.selectedLoop = true;
    }

    //改变定时推送的时间
    changeTime(type: string) {
        let that = this;
        if (that.sendTime) {
            let dateTmp = moment(that.sendTime).set({
                'hour': that.selectedHous,
                'minute': that.selectedMins
            }).format('YYYY-MM-DD HH:mm:ss');

            that.pipelineNodeCommunicationService.nodeData.appointedTime = dateTmp;
        }
    }

    //修改循环发送的时间触发
    changeLoopTime() {
        let that = this;
        that.rebuildCron();
    }

    //修改循环发送的类型触发
    sLoop(event: any) {
        let that = this;
        if (event.value == 3) {
            that.cycleHour = 0;
            that.cycleMinute = 0;
        } else {
            that.cycleVal = 1;
            that.cycleHour = 0;
            that.cycleMinute = 0;
        }
        that.pipelineNodeCommunicationService.nodeData.subTriggerType = event.value;
    }

	/**
	 * 在改变checkbox的同时，如果处于为选中状态，删除nodeData里对应键值
	 * @param {boolean} e checkbox是否被选中
	 * @param {string} bindDataStr 字段名
	 */
    updateBindingData(e: any, bindDataStr: string) {
        let that = this;
        if (bindDataStr === 'extendAttr' && that.keyValues.length === 0) {
            that.addKeyValue();
        }
        if (!e) {
            delete this.pipelineNodeCommunicationService.nodeData[bindDataStr];
        }
    }

    //重新生成cron表达式
    rebuildCron() {
        let that = this;
        let cron = that.utilesService.transformToCron(that.subTriggerType, that.cycleVal, that.cycleHour, that.cycleMinute);
        that.pipelineNodeCommunicationService.nodeData.cronExpression = cron;
    }

    // 检查输入的值
    checkInput() {

    }

    // 提示信息
    showMessageNews(type: any, detail: any) {
        let that = this;
        let message = '';
        if (type === 'info') {
            message = '成功';
        } else if (type === 'error') {
            message = '失败';
        }
        that.msgs.push({ severity: type, summary: message, detail: detail })
    }

    // 向内容框里插入变量
    jsonInsert(data: any, type: string) {
        let that = this;
        if (!that.pipelineNodeCommunicationService.nodeData.message) {
            that.pipelineNodeCommunicationService.nodeData.message = '';
        }

        if (type === 'ios') {
            if (that.iosEditor && that.rangeIndex >= 0) {
                let inputText = that.iosEditor.nativeElement;
                that.setCaretPosition(inputText, that.rangeIndex);
                that.insertAfterText(inputText, `\$\{${data}\}`);
            } else {
                that.pipelineNodeCommunicationService.nodeData.message += `\$\{${data}\}`
            }
            that.pipelineNodeCommunicationService.nodeData.message = that.pipelineNodeCommunicationService.nodeData.message.slice(0, 240);
            that.rangeIndex = that.pipelineNodeCommunicationService.nodeData.message.length;            
        } else {
            let quill = that.androidEditor.quill;
            if (that.androidEditor && that.rangeIndex >= 0) {
                quill.insertText(that.rangeIndex, "${" + data + "}");
            } else {
                that.pipelineNodeCommunicationService.nodeData.message = that.pipelineNodeCommunicationService.nodeData.message.slice(0, -4) + "${" + data + "}</p>";
            }
            that.rangeIndex = quill.getLength() - 1;
        }
    }

    // 获取光标位置
    getCursortPosition() {
        let textDom = this.iosEditor.nativeElement;
        var cursorPos = 0;
        if (document['selection']) {
            // IE Support
            textDom.focus();
            var selectRange = document['selection'].createRange();
            selectRange.moveStart('character', -textDom.value.length);
            cursorPos = selectRange.text.length;
        } else if (textDom['selectionStart'] || textDom['selectionStart'] == '0') {
            // Firefox support
            cursorPos = textDom['selectionStart'];
        }
        this.rangeIndex = cursorPos;
    }

    // 设置光标位置
    setCaretPosition(textDom: any, pos: any) {
        if (textDom['setSelectionRange']) {
            // IE Support
            textDom.focus();
            textDom.setSelectionRange(pos, pos);
        } else if (textDom['createTextRange']) {
            // Firefox support
            var range = textDom.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }

    /**
    * 在光标后插入文本
    * 参数：
    *  textDom [JavaScript DOM String] 当前对象
    *  value [String] 要插入的文本
    */
    insertAfterText(textDom: any, value: any) {
        var selectRange;
        if (document['selection']) {
            // IE Support
            textDom.focus();
            selectRange = document['selection'].createRange();
            selectRange.text = value;
            textDom.focus();
        } else if (textDom['selectionStart'] || textDom['selectionStart'] == '0') {
            // Firefox support
            var startPos = textDom.selectionStart;
            var endPos = textDom.selectionEnd;
            var scrollTop = textDom.scrollTop;
            textDom.value = textDom.value.substring(0, startPos) + value + textDom.value.substring(endPos, textDom.value.length);
            textDom.focus();
            textDom.selectionStart = startPos + value.length;
            textDom.selectionEnd = startPos + value.length;
            textDom.scrollTop = scrollTop;
        } else {
            textDom.value += value;
            textDom.focus();
        }
        this.pipelineNodeCommunicationService.nodeData.message = textDom.value;
    }

    // 选择app后会根据appid获取app相关信息
    changeApp(appId: any) {
        let that = this;
        that.appConfResourceService.getAppByAppId(appId).then((data: any) => {
            that.appConfig = data;
            that.androidPushTypes = [{ label: 'TD推送', value: 'td' }];
            if (that.appConfig.jpushKey) {
                that.androidPushTypes.push({ label: '极光推送', value: 'jiguang' });
            }
            if (that.appConfig.getuiKey) {
                that.androidPushTypes.push({ label: '个推', value: 'getui' });
            }
        }).catch(err => { })
    }

    /**
	 * 获取投放组列表
	 */
	getGroupList() {
        let that = this;
		if (that.pipelineNodeCommunicationService.nodeData.groupName) {
            that.pipelineSegmentGroups.getGroupList(that.pipelineNodeCommunicationService.nodeData.groupName)
            .then((data: any) => {
                that.groupList = data;
            }).catch((err: any) => {});
        } else {
            that.pipelineSegmentGroups.query()
            .then((data: any) => {
                that.groupList = data;
            }).catch((err) => {});
        }
    }
    
    /**
     * 选中下拉列表中的某个分组
     * @param group 
     */
    selectGroup(group: any) {
        let that = this;
        that.showGroupList = false;
        that.pipelineNodeCommunicationService.nodeData.groupName = group.groupName;
        that.pipelineNodeCommunicationService.nodeData.groupId = group.id;
    }

    showGroups(e: any) {
        e.stopPropagation();
        let that = this;
        if (!that.showGroupList) {
            if (that.pipelineNodeCommunicationService.nodeData.groupName) {
                that.pipelineSegmentGroups.getGroupList(that.pipelineNodeCommunicationService.nodeData.groupName)
                .then((data: any) => {
                    that.groupList = data;
                    that.showGroupList = !that.showGroupList;
                }).catch((err: any) => {});
            } else {
                that.pipelineSegmentGroups.query()
                .then((data: any) => {
                    that.groupList = data;
                    that.showGroupList = !that.showGroupList;
                }).catch((err) => {});
            }
        } else {
            that.showGroupList = !that.showGroupList;
        }
    }

    saveGroup(e: any) {
        if (e && e.keyCode === 13) {
            let that = this;
            that.pipelineSegmentGroups.save(that.pipelineNodeCommunicationService.nodeData.groupName)
            .then((data: any) => {
                that.getGroupList();
            }).catch((err: any) => {});
        }
    }

    /**
     * 隐藏分组下拉列表
     */
    hideGroupList(e: any) {
        this.showGroupList = false;
    }

    deleteGroup(data: any) {
		let that = this;
		if (data && data.groupName) {
			that.pipelineSegmentGroups.deleteGroup(data.groupName)
			.then((data: any) => {
                if (data && (data.retCode || data.msgDes)) {
					let error = that.errorHandlingService.getMsg(data);
					that.campaignDetailExceptionalCommunication.exceptionalMission(error.message);
					return;
                }
				that.getGroupList();
			}).catch((err: any) => {})
		}
	}
}