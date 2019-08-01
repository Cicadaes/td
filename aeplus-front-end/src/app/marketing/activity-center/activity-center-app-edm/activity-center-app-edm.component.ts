import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-cosmos-ui';
import { SegmentDataService } from '../segment-data.service';
import { ActivityCenterService } from '../activity-center.service';

@Component({
    selector: 'app-activity-center-app-edm',
    templateUrl: './activity-center-app-edm.component.html',
    styleUrls: ['./activity-center-app-edm.component.less']
})
export class ActivityCenterAppEdmComponent {

    public vm: any;

    sendType = '1';                    // 投放类型

    segment: any;                       // 投放
    channelType = 3;                    // 渠道类型

    sendTime: any;                      // 投放时间（定时）
    hourList: any = [];                 // 小时（定时）
    selectedHour: number = 0;           // 选中的小时（定时）
    minuteList: any = [];               // 分钟（定时）
    selectedMinute: number = 0;         // 选中的分钟（定时）

    channelConfig = [];                 // 渠道配置信息
    senderList: any = [];               // 发件人列表

    constructor(private activityCenterService: ActivityCenterService,
        private notification: NzNotificationService,
        public segmentDataService: SegmentDataService, ) {

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
                }
            } else {
                this.notification.create('warning', '错误提示', data.message);
            }
        });

        this.segment = segmentDataService.segmentInfo;
        this.segment['channelType'] = 3;
        this.segment['triggerType'] = (this.segment['triggerType'] || '1') + '';               // 投放方式

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
            fromAddressError: false,
            titleError: false,
            titleErrorInfo: '',
            timeError: false,
            timeErrorInfo: '',
        };
    }

    /**
     * 改变渠道code
     * @param value
     * @param flag 内部调用传ture
     */
    changeChannelCode(value: any, flag?: boolean) {
        this.initError();
        this.senderList = [];
        if (!flag) {
            this.segment.fromAddress = null;
        }
        this.channelConfig.forEach((element: any) => {
            if (value == element['code']) {
                this.senderList = element['param'] && element['param']['edmSenderList'];
            }
        });
    }

    /**
     * 上传文件前的校验
     */
    beforeUpload = (file: File) => {
        // let reader = new FileReader();
        // reader.readAsText(file, "UTF-8");
        // reader.onload = function (evt) { //读取完文件之后会回来这里
        //     console.log(evt.target.result); // 读取文件内容
        // }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            this.notification.create('error', '错误提示', 'HTML文件大小需要小于10M');
        }
        return isLt2M;
    }

    /**
     * 上传邮件
     * @param event
     */
    handleChange(event: any) {
        this.vm.fileNameError = false;
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
     * 检查参数
     */
    checkParam() {
        let flag = true;
        if (!this.segment['channelCode']) {
            this.vm.channelCodeError = true;
            flag = false;
        }
        if (!this.segment['fromAddress']) {
            this.vm.fromAddressError = true;
            flag = false;
        }
        if (!this.segment['title']) {
            this.vm.titleError = true;
            this.vm.titleErrorInfo = '请输入邮件主题';
            flag = false;
        } else {
            this.vm.titleError = false;
            if (this.segment['title'].length > 120) {
                this.vm.titleError = true;
                this.vm.titleErrorInfo = '邮件主题长度不能超过120';
                flag = false;
            }
        }
        if (!this.segment['fileName']) {
            this.vm.fileNameError = true;
            flag = false;
        }
        if (this.segment['triggerType'] == 2) {
            this.vm.timeError = false;
            if(!this.sendTime){
                this.vm.timeError = true;
                this.vm.timeErrorInfo = '请选择日期';
                flag = false;
            }else if(new Date() > new Date(this.segment['appointedTime'])) {
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
