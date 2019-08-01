import { Input } from '@angular/core';
import { CreatePutEventTimeComponent } from './../../smsChannel-push/create-put-event-time.component';
import { Component} from '@angular/core';
import {SelectItem} from "primeng/components/common/api";

import { CreateSegmentAppCommunicationService } from "../../../../../../../../../services/communication/create-segment-app.communication.service";
import { SegmentCommunicationService } from "../../../../../../../../../services/communication/segment.communication.service";

@Component({
    selector: 'android-msg-config',
    templateUrl: 'android-msg-config.component.html',
    styleUrls: ['android-msg-config.component.css']
})

export class AndroidMsgConfigComponent {
    msgConfig: {};

    pushData: any;

    pieceIndex: number = 0;

    exTemp: any;

    isCustom: boolean = false;

    androidPushTypes:SelectItem[];

    showEnhancedChannelSet:boolean =false;

    showPushChannel:boolean = false;

    offLinePushTimes:SelectItem[];

    dateRange: any;

    exError: boolean = false;  //判断自定义参数输入是否错误

    constructor(
        private createSegmentAppCommunicationService: CreateSegmentAppCommunicationService,
        private segmentCommunicationService: SegmentCommunicationService
    ) {
        let that = this;
        
        if (segmentCommunicationService.startDate && segmentCommunicationService.endDate) {
            that.dateRange = {
                startDate: segmentCommunicationService.startDate,
                endDate: segmentCommunicationService.endDate
            };
        }
        that.msgConfig = segmentCommunicationService.segmentInfo;

        that.pushData = that.msgConfig['androidData'];

        that.initMsgConf();

        createSegmentAppCommunicationService.missionSelectFlowCount$.subscribe(data => {
            if (that.msgConfig['platform'] == 'ios') {
                return;
            }
            that.pieceIndex = data.index;
            if (!that.pushData[that.pieceIndex]) {
                that.pushData[that.pieceIndex] = {};
            }
            that.initMsgConf();
        });

        that.androidPushTypes = [];
        that.androidPushTypes.push({label:'TD推送',value:'4'});
        that.pushData[that.pieceIndex]['appPushChannelCode'] = that.pushData[that.pieceIndex]['appPushChannelCode'] || '4';
        if (that.segmentCommunicationService.appConf[0].jpushKey) {
            that.androidPushTypes.push({label:'极光推送', value:'5'});
        }
        if (that.segmentCommunicationService.appConf[0].getuiApp) {
            that.androidPushTypes.push({label:'个推', value:'3'});
        }

        createSegmentAppCommunicationService.selectApp$.subscribe(data => {
            that.androidPushTypes = [{label:'TD推送', value:'4'}];
            if (that.segmentCommunicationService.appConf[0].jpushKey) {
                that.androidPushTypes.push({label:'极光推送', value:'5'});
            }
            if (that.segmentCommunicationService.appConf[0].getuiApp) {
                that.androidPushTypes.push({label:'个推', value:'3'});
            }
        });

        that.offLinePushTimes = [];
        that.offLinePushTimes.push({label:"4小时",value:"4"});
        that.offLinePushTimes.push({label:"8小时",value:"8"});
        that.offLinePushTimes.push({label:"1天",value:"24"});
        that.offLinePushTimes.push({label:"2天",value:"48"});
    }

    /**
     * 初始化投放的配置信息
     */
    initMsgConf() {
        let that = this;
        that.pushData[that.pieceIndex].isCustom = false;
        if (!that.pushData[that.pieceIndex].extendAttr) {                           //如果ex不存在附上初始值
            that.pushData[that.pieceIndex].extendAttr = [];
        } else if (!that.pushData[that.pieceIndex].extendAttr[0]) {                 //如果ex[0]不存在附上初始值
            that.pushData[that.pieceIndex].extendAttr = [{key: "", value: ""}];
        } else {
            if (that.pushData[that.pieceIndex].extendAttr[0].key) {
                that.pushData[that.pieceIndex].isCustom = true;
            }
        }
    }

    hideAndroidIntensifyDailog(show :boolean){
        this.showEnhancedChannelSet = show;
    }

    hidePushDialog(show:boolean){
        this.showPushChannel = show;
    }

    addEx() {
        let that = this;
        let length = that.pushData[that.pieceIndex].extendAttr.length;
        if (that.pushData[that.pieceIndex].extendAttr[length - 1]['key'] && that.pushData[that.pieceIndex].extendAttr[length - 1]['value']) {
            that.exError = false;
            that.pushData[that.pieceIndex].extendAttr.push({});
        } else {
            that.exError = true;
        }
    }

    deleteEx(index: number) {
        let that = this;
        if (that.pushData[that.pieceIndex].extendAttr.length < 2) {
            return ;
        } else {
            that.exError = false;
            that.pushData[that.pieceIndex].extendAttr.splice(index, 1);
        }
    }

    changeCustom() {
        let that = this;
        if (that.pushData[that.pieceIndex].isCustom) {
            if (that.exTemp) {
                that.pushData[that.pieceIndex].extendAttr = that.exTemp;
            } else {
                if (!that.pushData[that.pieceIndex].extendAttr[0]) {
                    that.pushData[that.pieceIndex].extendAttr = [{key: "", value: ""}];
                }
            }
        } else {
            that.exTemp = that.pushData[that.pieceIndex].extendAttr;
            that.pushData[that.pieceIndex].extendAttr = [];
        }
    }

    //改变时间选择下拉
    changeDropdown (){

    }
}