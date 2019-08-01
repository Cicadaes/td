import { Component, OnInit } from '@angular/core';
import { PipelineService } from '../../pipeline.service';
import { PipelineCommunicationService } from '../../pipeline-communication.service';
import { differenceInDays } from 'date-fns';

@Component({
    selector: 'app-timer-panel',
    templateUrl: './timer-panel.component.html',
    styleUrls: ['./timer-panel.component.less']
})
export class TimerPanelComponent implements OnInit {
    hourList: any[];
    minuteList: any[];
    behaviorList: any[];
    eventList: any[];
    appBehaviorList: any[];

    targetDate: any;
    targetHour: number;
    targetMinute: number;
    behaviorRelation: any;

    constructor(public pipelineService: PipelineService,
        public pcs: PipelineCommunicationService) {
        const that = this;
        that.hourList = [];
        that.minuteList = [];
        for (let i = 0; i < 24; i++) {
            that.hourList.push(i);
        }
        for (let i = 0; i < 60; i++) {
            that.minuteList.push(i);
        }
        that.behaviorRelation = 'or';

        // 回显开始  默认数据
        if (!that.pcs.nodeData.hourMeterType) {
            that.pcs.nodeData.hourMeterType = '1';
        } else {
            that.pcs.nodeData.hourMeterType += '';
        }
        if (that.pcs.nodeData.hourMeterType === '1') {  // 目标计时器
            if (that.pcs.nodeData.stopTimeMillis) {
                const tmpDate = new Date(that.pcs.nodeData.stopTimeMillis);
                that.pcs.nodeData.targetDate = tmpDate;
                that.pcs.nodeData.targetHour = tmpDate.getHours();
                that.pcs.nodeData.targetMinute = tmpDate.getMinutes();
            }
            if (that.pcs.nodeData.expression) {
                const expression = that.pcs.nodeData.expression;
                that.pcs.nodeData.behaviorList = [];
                const arrTmp = expression.split(' : ');
                const arrLength = arrTmp.length;
                const tempLength = Math.ceil(arrLength / 2);
                for (let i = 0; i < tempLength; i++) {
                    if (i === 0) {
                        arrTmp[1] = arrTmp[1] || '||';   // 防止只有一个时候没有默认数据
                        that.pcs.nodeData.behaviorRelation = arrTmp[1] === '||' ? 'or' : 'and';
                    }
                    that.pcs.nodeData.behaviorList[i] = {
                        event: arrTmp[i * 2].replace(/\'/g, '')
                    };
                }
            }
        } else if (that.pcs.nodeData.hourMeterType === '2') {
            const afterTime = that.pcs.nodeData.timeSchedulingExpression;
            if (afterTime) {
                that.pcs.nodeData.afterDay = afterTime.split(' : ')[0];
                that.pcs.nodeData.afterHours = afterTime.split(' : ')[1];
                that.pcs.nodeData.afterMinutes = afterTime.split(' : ')[2];
            } else {
                that.pcs.nodeData.afterDay = 0;
                that.pcs.nodeData.afterHours = 0;
                that.pcs.nodeData.afterMinutes = 0;
            }
        }
        if (!that.pcs.nodeData.behaviorList) {
            that.pcs.nodeData.behaviorList = [];
        }
        if (!that.pcs.nodeData.behaviorRelation) {
            that.pcs.nodeData.behaviorRelation = 'or';
        }
    }

    ngOnInit() {
        const that = this;
        let arr = [];
        if (that.pcs.nodeData.behaviorList.length) {
            that.pcs.nodeData.behaviorList.forEach(element => {
                arr.push(element.event);
            });
        }
        that.pipelineService.getEventListForTimerEcho(arr, { timerFlag: 1 }).subscribe((data: any) => {
            if (data.code === 200) {
                that.eventList = data.data.data;
            }
        });
    }

    disabledDate = (current: Date): boolean => {
        const that = this;
        return !(current.getTime() >= that.pcs.startTime.getTime() && current.getTime() <= that.pcs.endTime.getTime());
    }

    /**
     * 清空目标计时器
     */
    reset() {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        that.pcs.nodeData.targetDate = null;
        that.pcs.nodeData.targetHour = null;
        that.pcs.nodeData.targetMinute = null;
    }

    /**
     * 修改关系类型
     */
    changeRelation(type: string) {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        if (that.pcs.nodeData[type] && that.pcs.nodeData[type] === 'and') {
            that.pcs.nodeData[type] = 'or';
        } else {
            that.pcs.nodeData[type] = 'and';
        }
    }

    /**
     * 添加行为
     */
    addBehavior() {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        if (that.pcs.nodeData.behaviorList.length >= 10) {
            that.pcs.message.create('error', '最多添加十条行为');
            return;
        }
        const length = that.pcs.nodeData.behaviorList.length;
        if (length > 0 && !that.pcs.nodeData.behaviorList[length - 1].event) {
            that.pcs.message.create('error', '请选择事件后再添加新行为');
            return;
        }
        that.pcs.nodeData.behaviorList.push({});
    }

    /**
     * 删除行为
     */
    removeBehavior(index: number) {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        that.pcs.nodeData.behaviorList.splice(index, 1);
    }
}
