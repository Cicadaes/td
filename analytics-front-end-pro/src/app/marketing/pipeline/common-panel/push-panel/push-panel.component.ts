import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { PipelineService } from '../../pipeline.service';
import { PipelineCommunicationService } from '../../pipeline-communication.service';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';

@Component({
    selector: 'app-push-panel',
    templateUrl: './push-panel.component.html',
    styleUrls: ['./push-panel.component.less']
})
export class PushPanelComponent implements OnInit, OnDestroy {
    productId: any;                   // 产品Id
    groupId: any;                     // 投放组Id TODO 占时绑定id
    groupList: any[];                 // 投放组列表
    showGroupList: boolean = false;   // 是否显示投放组下拉列表
    variableList: any[];              // 自定义插入参数列表
    digitalAngle: boolean;            // 是否显示数字角标
    appConfig: any = {};                   // app配置
    timeTabs: any = [];
    nowTime: any;                     // 投放时间  now: 立即发送；timing: 定时发送
    liveTimeList: any;                // 离线用户存活时间
    hourList: any[];
    minuteList: any[];

    isAndroid: boolean = true;        // 是否是选中Android false代表选中 ios

    editorConfig: any = {
        width: '338px',
        height: '125px',
        toolbar: [ // 工具栏
            ['Font', 'FontSize', 'TextColor', '-', 'Bold', 'Italic', 'Underline'],
        ],
        removePlugins: 'elementspath',
        resize_enabled: false,
    };

    @ViewChild('ckeditor') ckeditor: any;

    constructor(public pipelineService: PipelineService,
        public pcs: PipelineCommunicationService,
        protected modalService: NzModalService,
        public notification: NzNotificationService) {
        const that = this;
        that.productId = localStorage.getItem('productId');
        that.getGroupList();
        that.timeTabs = [
            {
                name: '立即投放',
                type: 1
            },
            {
                name: '定时投放',
                type: 2
            }
        ];
        that.nowTime = 1;
        that.liveTimeList = [
            { label: '4小时', value: 4 },
            { label: '8小时', value: 8 },
            { label: '1天', value: 24 },
            { label: '2天', value: 48 },
        ];
        that.hourList = [];
        that.minuteList = [];
        for (let i = 0; i < 24; i++) {
            let one;
            if (i < 10) {
                one = '0' + i.toString();
            } else {
                one = i.toString();
            }
            that.hourList.push(one);
        }
        for (let i = 0; i < 60; i++) {
            let one;
            if (i < 10) {
                one = '0' + i.toString();
            } else {
                one = i.toString();
            }
            that.minuteList.push(one);
        }

        that.pcs.nodeData.ttlType = that.pcs.nodeData.timeToLive != null;

        /**
         * 获取config
         */
        const appId = localStorage.getItem('appkey');
        if (appId) {
            that.pcs.nodeData.appid = appId;
            that.pipelineService.getAppConfig(appId).subscribe((data: any) => {
                if (data.code === 200) {
                    that.appConfig = data.data;
                }
            })
        }

        if (!that.pcs.nodeData.platform) {
            that.pcs.nodeData.platform = 'android';
        }
        if (that.pcs.nodeData.triggerType) {
            that.nowTime = '' + that.pcs.nodeData.triggerType;
        } else {
            that.pcs.nodeData.triggerType = '1';
        }

        if (that.pcs.nodeData.badge) {
            that.digitalAngle = true;
        }

        if (that.pcs.nodeData.extendAttr && that.pcs.nodeData.extendAttr.length > 0) {
            that.pcs.nodeData.isVibration = true;
        }

        if (that.pcs.nodeData.timeToLive) {
            that.pcs.nodeData.ttlType = true;
        }

        if (that.pcs.nodeData.frontendAttr) {
            const temp = JSON.parse(that.pcs.nodeData.frontendAttr);
            that.pcs.nodeData.date = temp.date;
            that.pcs.nodeData.hour = temp.hour;
            that.pcs.nodeData.minute = temp.minute;
        }
    }

    ngOnInit() {
        const that = this;
        // 判断目标平台
        if (that.pcs.nodeData.platform) {
            if (that.pcs.nodeData.platform === 'ios') {
                that.isAndroid = false;
            }
            if (that.pcs.nodeData.platform === 'android') {
                that.isAndroid = true;
            }
        } else {
            that.pcs.nodeData.platform = 'android';
        }

        /**
         * 获取自定义参数列表
         */
        that.pipelineService.getCustomParameters(that.pcs.pipelineId).subscribe((result: any) => {
            if (result.code === 200) {
                const customList = JSON.parse(result.data.customParameterVoList);
                const equityList = JSON.parse(result.data.pipelineEquityList);
                that.variableList = customList.concat(equityList);
                that.variableList.forEach((value: any, index: number) => {
                    value.value = value.value || value.name;
                    value.key = value.key || `${value.name}_${value.equityId}`;
                    return value
                });
            }
        });

        /**
         * 处理group下拉框的隐藏
         */
        document.addEventListener('click', (e: any) => {
            if (that.showGroupList) {
                that.showGroupList = !that.showGroupList;
            }
        });

        // 监听富文本外层的滚动事件，调用focus(关闭工具栏的弹出)
        document.getElementById('pipe-panel').addEventListener("scroll", that.scrollPipePanel);
    }

    scrollPipePanel = () => {
        let editor = this.ckeditor && this.ckeditor.instance;
        if (editor) {
            // 聚焦
            editor.focus();

            // 将光标移至最末
            let range = editor.createRange();
            range.moveToElementEditEnd(editor.editable());
            range.select();
            range.scrollIntoView();
        }
    }

    /**
     * 富文本改变
     * @param event
     */
    editorChange(event: any) {
        let oldHtml = this.pcs.nodeData.message;
        let description = event.replace(/<.*?>/ig, "");
        if (240 - description.length >= 0) {
            this.pcs.nodeData.message = event;
        } else {
            let editor = this.ckeditor.instance;
            editor.setData(oldHtml);
        }
    }

    /**
     * 插入变量（富文本）
     * @param data
     */
    editorInsertVariable(data: any) {
        const that = this;

        if (that.pcs.nodeData.message && (data.key.length + 3 + that.pcs.nodeData.message.replace(/<.*?>/ig, "").length > 240)) { // 3 是 ${}的长度
            this.notification.create('error', '错误提示', '剩余内容不足，无法插入变量');
            return;
        }

        if (!data.id) {
            if (that.pcs.nodeData.customParameters) {
                that.pcs.nodeData.customParameters.push(data.key);
            } else {
                that.pcs.nodeData.customParameters = [data.key];
            }
        } else {
            if (that.pcs.nodeData.equitys) {
                that.pcs.nodeData.equitys.push(`${data.name}_${data.equityId}`);
            } else {
                that.pcs.nodeData.equitys = [`${data.name}_${data.equityId}`];
            }
        }

        let editor = this.ckeditor.instance;

        let value = `\${${data.key}}`;
        // Check the active editing mode.
        if (editor.mode == 'wysiwyg') {
            // Insert HTML code.
            editor.insertHtml(value);
        }
        that.pcs.nodeData.message = editor.document.getBody().getHtml();
    }

    showGroups(e: any) {
        e.stopPropagation();
        const that = this;
        that.showGroupList = !that.showGroupList;
    }

    /**
     * 获取投放组列表
     */
    getGroupList() {
        const that = this;
        that.pipelineService.getSegmentGroupList(that.pcs.campaignId).subscribe((data: any) => {
            if (data.code === 200) {
                that.groupList = data.data;
            }
        });
    }

    /**
     * 创建投放组
     */
    saveGroup(e: any) {
        if (e && e.keyCode === 13) {
            const that = this;
            if (!that.pcs.nodeData.groupName) {
                return;
            }
            that.pipelineService.saveSegmentGroup(that.pcs.campaignId, that.pcs.nodeData.groupName, that.productId).subscribe((data: any) => {
                if (data.code === 200) {
                    that.pcs.nodeData.groupId = data.data.id;
                    that.getGroupList();
                }
            });
        }
    }

    /**
     * 删除投放组
     */
    deleteGroup(data: any, e: any) {
        e.stopPropagation();
        const that = this;
        if (data && data.groupName) {
            that.modalService.confirm({
                nzTitle: '提示',
                nzContent: `确定要删除投放组"${data['groupName']}"？`,
                nzOnOk: () => {
                    that.pipelineService.deleteSegmentGroup(data.id).subscribe((data: any) => {
                        if (data.code === 200) {
                            that.getGroupList();
                        }
                    });
                }
            });
        }
    }

    /**
     * 选中投放列表中的某一个分组
     */
    selectGroup(group: any) {
        const that = this;
        that.showGroupList = false;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        that.pcs.nodeData.groupName = group.groupName;
        that.pcs.nodeData.groupId = group.id;
    }

    /**
     * 改变目标平台
     */
    changePlatform(type: string) {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        delete that.pcs.nodeData.action;
        delete that.pcs.nodeData.title;
        delete that.pcs.nodeData.message;
        delete that.pcs.nodeData.clearable;
        delete that.pcs.nodeData.vibrate;
        delete that.pcs.nodeData.wakeup;
        delete that.pcs.nodeData.soundName;
        delete that.pcs.nodeData.badge;

        if (type === 'android') {
            that.isAndroid = true;
            that.pcs.nodeData.platform = 'android';
        } else if (type === 'ios') {
            that.isAndroid = false;
            that.pcs.nodeData.platform = 'ios';
        }
    }

    /**
     * ios自定义声音按钮
     * @param value
     */
    changeSound(value: any) {
        const that = this;
        if (value) {
            that.pcs.nodeData.sound = 1;
        } else {
            that.pcs.nodeData.sound = 0;
            delete that.pcs.nodeData.soundName;
        }
    }

    /**
     * 禁止选择的日期
     */
    disabledDate = (current: Date): boolean => {
        const that = this;
        return !(current.getTime() >= that.pcs.startTime.getTime() && current.getTime() <= that.pcs.endTime.getTime());
    }

    /**
     * 插入变量
     */
    insertVariable(data: any) {
        const that = this;
        if (that.pcs.nodeData.message && (data.key.length + 3 + that.pcs.nodeData.message.length > 240)) { // 3 是 ${}的长度
            this.notification.create('error', '错误提示', '剩余内容不足，无法插入变量');
            return;
        }
        const inputText = document.getElementById('content');
        const textIndex = that.doGetCaretPosition(inputText);
        let content = that.pcs.nodeData.message;
        if (!data.id) {
            if (that.pcs.nodeData.customParameters) {
                that.pcs.nodeData.customParameters.push(data.key);
            } else {
                that.pcs.nodeData.customParameters = [data.key];
            }
        } else {
            if (that.pcs.nodeData.equitys) {
                that.pcs.nodeData.equitys.push(`${data.name}_${data.equityId}`);
            } else {
                that.pcs.nodeData.equitys = [`${data.name}_${data.equityId}`];
            }
        }
        data = `\$\{${data.key}\}`;
        if (!content) {
            content = data;
        } else {
            const length = content.length;
            content = content.substring(0, textIndex) + data + content.substring(textIndex, length);
        }
        that.pcs.nodeData.message = content;
    }

    /**
     * 获取光标位置
     */
    doGetCaretPosition(oField: any) {
        let iCaretPos = 0;
        if (document['selection']) { // IE
            oField.focus();
            const oSel = document['selection'].createRange();
            oSel.moveStart('character', -oField.value.length);
            iCaretPos = oSel.text.length;
        } else if (oField.selectionStart || oField.selectionStart == '0') { // Firefox suppor  测试chrome v56.0.2924.87无问题
            iCaretPos = oField.selectionStart;
        }
        return iCaretPos;
    }

    /**
     * 开启自定义参数设置
     */
    changeCustomParam(value: any) {
        const that = this;
        if (value) {
            if (!that.pcs.nodeData.extendAttr) {
                that.pcs.nodeData.extendAttr = [{ key: '', value: '' }];
            }
        } else {
            delete that.pcs.nodeData.extendAttr;
        }
    }

    /**
     * 删除自定义参数
     */
    removeCustomParam(index: number) {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        that.pcs.nodeData.extendAttr.splice(index, 1);
    }

    /**
     * 添加自定义参数
     */
    addCustomParam() {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }

        let flag = that.checkKeyValues(that.pcs.nodeData.extendAttr);

        if (flag) {
            that.pcs.nodeData.extendAttr.push({ key: '', value: '' });
        } else {
            that.pcs.message.create('error', '填写完整的键值对后方可新增！');
        }
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

    /**
     * 改变投放时间
     */
    changeTime(type: any) {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        that.nowTime = type;
        that.pcs.nodeData.triggerType = +type;
    }

    /**
     * 改变离线推送勾选
     * @param event 
     */
    changeTtlType(event: any) {
        const that = this;
        if (event) {
            that.pcs.nodeData.timeToLive = that.pcs.nodeData.timeToLive || 4;
        } else {
            that.pcs.nodeData.timeToLive = null;
        }
    }

    /**
     * 选择投放渠道
     */
    select(type: string, data: any) {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        if (type === 'prod') {
            that.pcs.nodeData.prod = data;
            if (data === 1) {
                that.pcs.nodeData['channelCode'] = `${that.productId}.iosprod`;
            } else if (data === 0) {
                that.pcs.nodeData['channelCode'] = `${that.productId}.iostest`;
            }
        } else if (type === 'channelCode') {
            that.pcs.nodeData.channelCode = data;
        }
    }

    ngOnDestroy() {
        document.removeEventListener('click', () => {
        }, false);

        document.getElementById('pipe-panel').removeEventListener("scroll", this.scrollPipePanel);
    }
}
