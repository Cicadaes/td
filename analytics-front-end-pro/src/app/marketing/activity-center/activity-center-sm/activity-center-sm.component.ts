import { Component, Input } from '@angular/core';
import { ActivityCenterService } from '../activity-center.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { SegmentDataService } from '../segment-data.service';
import { ActivityCenterAppPushService } from '../activity-center-app-push/activity-center-app-push.service';

let $scope: any;
@Component({
    selector: 'app-activity-center-sm',
    templateUrl: './activity-center-sm.component.html',
    styleUrls: ['./activity-center-sm.component.less'],
    providers: [ActivityCenterAppPushService]
})

export class ActivityCenterSmComponent {

    public nls: any;
    public vm: any;

    segment: any;                       // 短信投放
    channelType = 2;                    // 短信渠道类型

    sendTime: any;                      // 投放时间（定时）
    hourList: any = [];                 // 小时（定时）
    selectedHour: number = 0;           // 选中的小时（定时）
    minuteList: any = [];               // 分钟（定时）
    selectedMinute: number = 0;         // 选中的分钟（定时）

    channelConfig = [];                 // 渠道配置信息
    signList: any = [];                 // 签名列表
    subCodeList: any = [];              // 通道号码列表
    variableList: any[] = [];           // 插入变量列表
    signContent: string;                // 签名内容
    previewMessage: string = "";        // 预览短信内容

    // numSelectStyle: any = {             // 通道号码下拉框样式
    //     top: '0'
    // };

    constructor(
        private activityCenterService: ActivityCenterService,
        private notification: NzNotificationService,
        public segmentDataService: SegmentDataService,
        private activityCenterAppPushService: ActivityCenterAppPushService,
    ) {

        this.nls = {
            formLaunchChannelLabel: '投放渠道',
            formLaunchChannelPlaceholder: '请选择投放渠道',
            formBlacklistLabel: '黑名单',
            formBlacklistUpload: '上传黑名单列表',
            formBlacklistDescription: '请上传CSV格式列表，每行一个号码，文件大小不能超过2M',
            formSignLabel: '签名',
            formSignPlaceholder: '请选择签名',
            formSignRadio1: '显示在文前',
            formSignRadio2: '显示在文后',
            formSmContentLabel: '短信内容',
            formSmContentDescription1: '还可以输入 ',
            formSmContentDescription2: ' 字符，当前内容作为 ',
            formSmContentDescription3: ' 条短信发送',
            formLaunchTimeLabel: '投放时间',
            formLaunchTimeRadio1: '立即发送',
            formLaunchTimeRadio2: '定时发送',
            formLaunchTimeHourPlaceholder: '小时',
            formLaunchTimeMinutePlaceholder: '分钟',
            formChannelNumberLabel: '通道号码',
            formChannelNumberPlaceholder: '请选择通道号码',
        };

        this.initError();

        for (let i = 0; i < 24; i++) {
            this.hourList.push({ label: i + '时', value: i });
        }

        for (let i = 0; i < 60; i++) {
            this.minuteList.push({ label: i + '分', value: i });
        }

        activityCenterService.getConfigByChannelType(this.channelType).subscribe(data => {
            if (data.code === 200) {
                this.channelConfig = data['data'] || [];

                if (this.segment['channelCode']) {
                    this.changeChannelCode(this.segment['channelCode'], true);
                    this.signList.forEach(element => {
                        if (element['key'] === this.segment['sign']) {
                            this.signContent = element['sign'];
                        }
                    });
                }
            } else {
                this.notification.create('warning', '错误提示', data.message);
            }
        });

        activityCenterAppPushService.getCustomParamList().subscribe(data => {
            if (data['code'] !== 'OK' && data['code'] !== 200) {
                return;
            }

            this.variableList = data['data'];
        });

        // 初始化短信投放的数据
        this.segment = segmentDataService.segmentInfo;
        this.segment['channelType'] = 2;
        this.segment['triggerType'] = (this.segment['triggerType'] || '1') + '';               // 投放方式
        this.segment['signPosition'] = this.segment['signPosition'] || 'before';        // 签名位置
        this.segment['content'] = this.segment['content'] || '';                        // 内容

        if (this.segment['appointedTime']) {
            let date = new Date(this.segment['appointedTime']);
            this.sendTime = date;
            this.selectedHour = date.getHours();
            this.selectedMinute = date.getMinutes();
        }
    }

    /**
     * 初始化错误
     */
    initError() {
        this.vm = {
            channelCodeError: false,
            signError: false,
            contentError: false,
            contentSignError: false,
            timeError: false,
            timeErrorInfo: ''
        };
    }

    /**
     * 改变渠道code
     * @param value
     * @param flag 内部调用传ture
     */
    changeChannelCode(value: any, flag?: boolean) {
        this.initError();
        this.signList = [];
        this.subCodeList = [];
        if (!flag) {
            this.segment['sign'] = null;
            this.segment['channelNumber'] = null;
        }
        this.channelConfig.forEach((element: any) => {
            if (value === element['code']) {
                this.signList = element['param'] && element['param']['signList'];
                this.subCodeList = element['param'] && element['param']['subCodeList'];
                // if (this.subCodeList.length) {
                //     const len = this.subCodeList.length;
                //     const top = -(32 * len + 38) + 'px';
                //     this.numSelectStyle.top = top;
                // }
            }
        });
    }

    /**
     * 上传文件前的校验
     */
    beforeUpload = (file: File) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            this.notification.create('error', '错误提示', '黑名单文件大小需要小于2M');
        }
        return isLt2M;
    }

    /**
     * 上传黑名单
     * @param event
     */
    handleChange(event: any) {
        if (event.type == 'success') {
            let response = event.file.response;
            if (response.code == 200) {
                this.segment['attachmentId'] = response.data.uploadUUID;
                this.segment['fileName'] = event.file.name;
            } else if (response.code) {
                this.notification.create('error', '错误提示', response.message);
            }
        }
    }

    clearFile() {
        delete this.segment['attachmentId'];
        delete this.segment['fileName'];
    }

    /**
     * 改变时间
     * @param value
     */
    buildSendTime(value: any) {
        this.initError();
        let hour = this.selectedHour < 10 ? `0${this.selectedHour}` : this.selectedHour;
        let minute = this.selectedMinute < 10 ? `0${this.selectedMinute}` : this.selectedMinute;
        let sendTime = `${this.sendTime.getFullYear()}-${this.sendTime.getMonth() + 1}-${this.sendTime.getDate()} ${hour}:${minute}:00`;
        this.segment['appointedTime'] = sendTime;
    }

    /**
     * 禁止选择的日期
     */
    disabledDate = (current: Date): boolean => {
        let nowDate = new Date();
        return (nowDate.getTime() - 24 * 60 * 60 * 1000) > current.getTime();
    }

    /**
     * 改变签名
     * @param value
     */
    changeSign(value: any) {
        this.initError();
        this.signList.forEach(element => {
            if (element['key'] === value) {
                // this.replaceSign(this.segment.content, element['sign']);
                this.signContent = element['sign'];
            }
        });
        // this.replaceSign(this.content, value);
    }

    /**
     * 改变签名位置
     * @param value
     */
    changeSignPosition(value: any) {
        this.changeSign(this.segment.sign);
    }

    /**
     * 替换内容中的签名
     * @param content
     * @param newSign
     */
    replaceSign(content: string, newSign: string) {
        const reg = new RegExp('(【(' + this.signContent + '|退订回T)】)', 'gm');
        const execData = reg.exec(content);
        if (!execData) {   // 没有匹配到就是新增
            if (this.segment.signPosition === 'before') {
                this.segment.content = `【${newSign}】${content}【退订回T】`;
            } else {
                this.segment.content = `${content}【${newSign}】【退订回T】`;
            }
        } else {
            if (this.segment.signPosition === 'before') {        //改变位置
                content = content.replace(reg, '');
                this.segment.content = `【${newSign}】${content}【退订回T】`;
            } else {
                content = content.replace(reg, '');
                this.segment.content = `${content}【${newSign}】【退订回T】`;
            }
        }
        this.signContent = newSign;
    }

    /**
     * 移走内容中的签名
     * @param content
     * @return length of the rest of the content
     */
    removeSign(content: string): number {
        const reg = new RegExp('(【(' + this.signContent + '|退订回T)】)', 'gm');
        content = content.replace(reg, '');
        return content.length;
    }

    /**
       * 插入变量
       * @param data
       */
    insertVariable(data: any) {
        let inputText = document.getElementById('content');
        const textIndex = this.doGetCaretPosition(inputText);
        let content = this.segment.content;
        if(!this.segment['customParameters']){
            this.segment['customParameters'] = [];
        }
        if(this.segment['customParameters'].indexOf(data.key) === -1){
            this.segment['customParameters'].push(data.key);
        }
        if (!content) {
            content = `\${${data.key}}`;
        } else {
            let length = content.length;
            content = content.substring(0, textIndex) + `\${${data.key}}` + content.substring(textIndex, length);
        }
        this.segment.content = content;
    }

    doGetCaretPosition(oField: any) {
        let iCaretPos = 0;
        if (document['selection']) { // IE
            oField.focus();
            let oSel = document['selection'].createRange();
            oSel.moveStart('character', -oField.value.length);
            iCaretPos = oSel.text.length;
        } else if (oField.selectionStart || oField.selectionStart == '0') { // Firefox suppor  测试chrome v56.0.2924.87无问题
            iCaretPos = oField.selectionStart;
        }
        return iCaretPos;
    }

    /**
     * 检查短信参数
     */
    checkParam() {
        this.initError();
        let flag = true;
        if (!this.segment['channelCode']) {
            this.vm.channelCodeError = true;
            flag = false;
        }
        if (!this.segment['sign']) {
            this.vm.signError = true;
            flag = false;
        }
        if (!this.segment['content'] || this.removeSign(this.segment['content']) === 0) {
            this.vm.contentError = true;
            this.vm.contentErrorInfo = '请输入短信内容';
            flag = false;
        } else {
            this.vm.contentError = false;
            if (this.segment['content'].length > 500) {
                this.vm.contentError = true;
                this.vm.contentErrorInfo = '短信内容长度不能超过500';
                flag = false;
            }
        }
        // else {
        //     this.segment['content'] = this.segment['content'].trim();
        //     const contentLength = this.segment['content'].length;
        //     if (this.segment.signPosition === 'before' && this.segment['content'].indexOf('【' + this.signContent + '】') !== 0 ) {
        //         this.vm.contentSignError = true;
        //         this.replaceSign(this.segment['content'], this.signContent);
        //         flag = false;
        //     } else if (this.segment.signPosition === 'after' &&
        //                 this.segment['content'].indexOf('【' + this.signContent + '】') !== contentLength - this.signContent.length - 8) {
        //         this.vm.contentSignError = true;
        //         this.replaceSign(this.segment['content'], this.signContent);
        //         flag = false;
        //     }
        //     if (this.segment['content'].indexOf('【退订回T】') < contentLength - 6) {
        //         this.vm.contentSignError = true;
        //         this.replaceSign(this.segment['content'], this.signContent);
        //         flag = false;
        //     }
        // }
        if (this.segment['triggerType'] == 2) {
            this.vm.timeError = false;
            if (!this.sendTime) {
                this.vm.timeError = true;
                this.vm.timeErrorInfo = '请选择日期';
                flag = false;
            } else if (new Date() > new Date(this.segment['appointedTime'])) {
                this.vm.timeError = true;
                this.vm.timeErrorInfo = '定时发送时间需要大于当前时间';
                flag = false;
            }
        } else if (this.segment['triggerType'] == 1) {
            delete this.segment['appointedTime'];
        }

        return flag;
    }

}
