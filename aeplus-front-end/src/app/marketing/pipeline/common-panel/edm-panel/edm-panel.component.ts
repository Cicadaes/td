import {Component, OnInit, OnDestroy} from '@angular/core';
import {PipelineService} from '../../pipeline.service';
import {PipelineCommunicationService} from '../../pipeline-communication.service';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import {NzNotificationService, NzModalService} from 'ng-cosmos-ui';

@Component({
    selector: 'app-edm-panel',
    templateUrl: './edm-panel.component.html',
    styleUrls: ['./edm-panel.component.less']
})
export class EdmPanelComponent implements OnInit, OnDestroy {
    productId: any;                   // 产品Id
    groupId: any;                     // 投放组Id TODO 占时绑定id
    groupList: any[];                 // 投放组列表
    showGroupList: boolean;           // 是否显示投放组下拉列表
    timeTabs: any = [];
    today = new Date();
    hourList: any[];
    minuteList: any[];
    channelList: any = [];            // 投放渠道列表
    emailList: any = [];              // 发件地址列表
    fileName: any;                    // 文件名称
    _channelCode: any;

    constructor(public pipelineService: PipelineService,
                public pcs: PipelineCommunicationService,
                public notification: NzNotificationService,
                private modalService: NzModalService) {
        const that = this;
        that.productId = localStorage.getItem('productId');

        if (!that.pcs.nodeData.triggerType) {
            that.pcs.nodeData.triggerType = 1;
        }

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

        if (that.pcs.nodeData.frontendAttr) {
            const temp = JSON.parse(that.pcs.nodeData.frontendAttr);
            that.pcs.nodeData.date = temp.date;
            that.pcs.nodeData.hour = temp.hour;
            that.pcs.nodeData.minute = temp.minute;
        }
        that.getGroupList();
    }

    ngOnInit() {
        const that = this;
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

        /**
         * 处理group下拉框的隐藏
         */
        document.addEventListener('click', (e: any) => {
            if (that.showGroupList) {
                that.showGroupList = !that.showGroupList;
            }
        });

        that.getChannelList();
    }

    /**
     * 获取渠道列表
     */
    getChannelList() {
        this.pipelineService.getChannelList(3).subscribe((response) => {
            if (response.code === 200) {
                this.channelList = response.data;
                for (let i = 0, j = this.channelList.length; i < j; i++) {
                    if (this.pcs.nodeData.channelCode === this.channelList[i].code) {
                        this._channelCode = this.channelList[i];
                        this.emailList = this.channelList[i].param.edmSenderList;
                    }
                }
            }
        });
    }

    /**
     * 选择渠道
     */
    channelChange(item: any) {
        const that = this;
        that.pcs.nodeData.channelCode = item.code;
        that.emailList = item.param.edmSenderList;
        that.pcs.nodeData.sendAddress = null;
    }

    /**
     * 控制投放组列表是否显示
     */
    showGroups(e: any) {
        e.stopPropagation();
        const that = this;
        that.showGroupList = !that.showGroupList;
    }

    /**
     * 控制日历选择未来时间
     */
    disabledDate = (current: Date): boolean => {
        const that = this;
        return !(current.getTime() >= that.pcs.startTime.getTime() && current.getTime() <= that.pcs.endTime.getTime());
    }

    /**
     * 上传邮件
     * @param event
     */
    handleChange(event: any) {
        if (event.type === 'success') {
            const response = event.file.response;
            if (response.code === 200) {
                this.pcs.nodeData['attachmentId'] = response.data.uploadUUID;
                this.pcs.nodeData['attachmentName'] = event.file.name;
                this.fileName = event.file.name;
            } else if (response.code) {
                this.notification.create('error', '错误提示', response.message);
            }
        }
    }

    // 清楚上传的html
    clearFile() {
        if (!this.pcs.isPipelineEdit) {
            return;
        }
        delete this.pcs.nodeData['attachmentId'];
        delete this.pcs.nodeData['attachmentName'];
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
        that.pcs.nodeData.groupName = group.groupName;
        that.pcs.nodeData.groupId = group.id;
    }

    /**
     * 改变投放时间
     */
    changeTime(type: any) {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        if (type === 1) {
            that.pcs.nodeData.triggerType = 1;
        } else if (type === 2) {
            that.pcs.nodeData.triggerType = 2;
        }
    }

    ngOnDestroy() {
        document.removeEventListener('click', () => {
        }, false);
    }

}
