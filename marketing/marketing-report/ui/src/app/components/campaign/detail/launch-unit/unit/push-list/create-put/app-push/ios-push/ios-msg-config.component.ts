import { Component} from '@angular/core';
import {SelectItem} from "primeng/components/common/api";

import { SegmentCommunicationService } from "../../../../../../../../../services/communication/segment.communication.service";
import { CreateSegmentAppCommunicationService } from "../../../../../../../../../services/communication/create-segment-app.communication.service";

@Component({
    selector: 'ios-msg-config',
    templateUrl: 'ios-msg-config.component.html',
    styleUrls: ['ios-msg-config.component.css'],
    providers: []
})
export class IOSMsgConfigComponent {
    msgConfig: any;

    pushData: any;

    pieceIndex: number = 0;

    isCustomSound:boolean = false;//铃声按钮

    isDigitalAngle:boolean = false;//角标按钮

    isVibration: boolean = false;//自定义参数按钮

    exTemp: any;

    showDialog: boolean =false;

    offLinePushTimes: SelectItem[];

    iosPushTypes: SelectItem[];

    selectedIosType: string;

    dateRange: any;

    exError: boolean = false; //判断自定义参数输入是否错误

    constructor(
        private segmentCommunicationService: SegmentCommunicationService,
        private createSegmentAppCommunicationService: CreateSegmentAppCommunicationService
    ) {
        let that = this;
        if (segmentCommunicationService.startDate && segmentCommunicationService.endDate) {
            that.dateRange = {
                startDate: segmentCommunicationService.startDate,
                endDate: segmentCommunicationService.endDate
            };
        }
        if (!segmentCommunicationService.segmentInfo.iosData) {
            segmentCommunicationService.segmentInfo.iosData = [];
        }

        that.msgConfig = segmentCommunicationService.segmentInfo;

        if (!that.msgConfig.iosData || !that.msgConfig.iosData.length) {
            that.msgConfig.iosData = [{ratio: 100}];
        }
        that.pushData = that.msgConfig.iosData;
        that.initMsgConf();

        createSegmentAppCommunicationService.missionSelectFlowCount$.subscribe(data => {
            if (that.msgConfig.platform != 'ios') {
                return;
            }
            that.pieceIndex = data.index;
            that.pushData[that.pieceIndex] ? '' : that.pushData[that.pieceIndex] = {};
            // that.pushData[that.pieceIndex].channel = 3;
            // that.msgConfig.iosData[that.pieceIndex].ex = [[]];
            that.initMsgConf();
        });

        this.offLinePushTimes =[];
        this.offLinePushTimes.push({label:"4小时",value:"4"});
        this.offLinePushTimes.push({label:"8小时",value:"8"});
        this.offLinePushTimes.push({label:"1天",value:"24"});
        this.offLinePushTimes.push({label:"2天",value:"48"});

        this.iosPushTypes = [];
        this.iosPushTypes.push({label: 'APNS测试通道', value: 0});
        this.iosPushTypes.push({label: 'APNS生产通道', value: 1});
        this.pushData[that.pieceIndex].prod = this.pushData[that.pieceIndex].prod || 0;
    }

    /**
     * 初始化投放的配置信息
     */
    initMsgConf(){
        let that = this;
        //that.pushData[that.pieceIndex].channel = 3;
        //自定义参数初始化
        that.pushData[that.pieceIndex].isVibration = false;
        if (!that.pushData[that.pieceIndex].extendAttr) {  //如果ex不存在附上初始值
            that.pushData[that.pieceIndex].extendAttr = [];
        } else if (!that.pushData[that.pieceIndex].extendAttr[0]) { //如果ex[0]不存在附上初始值
            that.pushData[that.pieceIndex].extendAttr = [{key: '', value: ''}];
        } else {
            if (that.pushData[that.pieceIndex].extendAttr[0].key) {
                that.pushData[that.pieceIndex].isVibration = true;
            }
        }
        //静默推送初始化
        if (that.pushData[that.pieceIndex].action) {
            that.pushData[that.pieceIndex].action == 2 ? that.pushData[that.pieceIndex].action = false : that.pushData[that.pieceIndex].action = true;
        }
        //角标
        if (that.pushData[that.pieceIndex].badge) {
            that.isDigitalAngle = true;
        } else {
            that.isDigitalAngle = false;
        }
        //铃声
        if (that.pushData[that.pieceIndex].soundName) {
            that.isCustomSound = true;
        } else {
            that.isCustomSound = false;
        }

        if (that.pushData[that.pieceIndex].timeToLive){
            that.pushData[that.pieceIndex].ttlType = true;
        }
    }

    //打开/关闭 声音设置
    changeSound() {
        let that = this;
        if (!that.isCustomSound) {
            that.pushData[that.pieceIndex].soundName = '';
        }
    }

    //添加自定义参数
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

    //删除自定义参数
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
        if (that.pushData[that.pieceIndex].isVibration) {
            if (that.exTemp) {
                that.pushData[that.pieceIndex].extendAttr = that.exTemp;
            } else {
                if (!that.pushData[that.pieceIndex].extendAttr[0]) {
                    that.pushData[that.pieceIndex].extendAttr = [{key: '', value: ''}];
                }
            }
        } else {
            that.exTemp = that.pushData[that.pieceIndex].extendAttr;
            that.pushData[that.pieceIndex].extendAttr = [];
        }
    }
    
    hideMsgConfigDialog(show: boolean){
        this.showDialog = show;
    }

    jsonInsert(data: string) {
        let inputText = document.getElementById('insertData');
        let position = this.doGetCaretPosition(inputText);
        let valueLength = this.pushData[this.pieceIndex].message.length;
        this.pushData[this.pieceIndex].message = this.pushData[this.pieceIndex].message.substring(0, position) + data + (position === valueLength ? '' : this.pushData[this.pieceIndex].message.substring(position, valueLength));
    }

    doGetCaretPosition(oField: any) {
        var iCaretPos = 0;
        if (document['selection']) { // IE
            oField.focus();
            var oSel = document['selection'].createRange();
            oSel.moveStart('character', -oField.value.length);
            iCaretPos = oSel.text.length;
        } else if (oField.selectionStart || oField.selectionStart == '0') { // Firefox suppor  测试chrome v56.0.2924.87无问题
            iCaretPos = oField.selectionStart;
        }
        return iCaretPos;
    }
}