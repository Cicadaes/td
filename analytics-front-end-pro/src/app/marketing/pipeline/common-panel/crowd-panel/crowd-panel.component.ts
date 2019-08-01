import {Component, OnInit} from '@angular/core';
import {PipelineService} from '../../pipeline.service';
import {PipelineCommunicationService} from '../../pipeline-communication.service';
import {differenceInDays} from 'date-fns';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { Utiles } from '../../../../utils/utiles';

@Component({
    selector: 'app-crowd-panel',
    templateUrl: './crowd-panel.component.html',
    styleUrls: ['./crowd-panel.component.less']
})
export class CrowdPanelComponent implements OnInit {
    dateFormat: string;          // 时间显示格式
    dateList: any[];             // 页面显示时间列表

    pathList: any;

    constructor(public pipelineService: PipelineService,
                public pcs: PipelineCommunicationService,
                private utiles: Utiles,
            ) {
        const that = this;
        that.dateFormat = 'yyyy-MM-dd';
        that.dateList = [];
        that.pathList = [];
        // /**
        //  * 采集开始时间
        //  */
        // private Long acquisitionStartTime;
        // /**
        //  * 采集结束时间
        //  */
        // private Long acquisitionEndTime;
        // /**
        //  * 行为路径描述
        //  */
        // private Integer behaviorPathDescription;

        // /**
        //  * 生成人群ID
        //  */
        // private Integer geneCrowdId;

        if (that.pcs.nodeData.acquisitionStartTime) {
            that.dateList[0] = new Date(that.pcs.nodeData.acquisitionStartTime);
        }
        if (that.pcs.nodeData.acquisitionEndTime) {
            that.dateList[1] = new Date(that.pcs.nodeData.acquisitionEndTime);
        }
        // that.pipelineService.generateBehaviorPath(that.pcs.nodeData.id, that.pcs.diagram).subscribe((result: any) => {
        //     if (result.code === 200) {
        //         for (let key in result.data) {
        //             that.pathList[key] = result.data[key];
        //         }
        //         that.pathList.reverse();
        //         that.pcs.nodeData.behaviorPathDescription = that.pathList;
        //     }
        // });
    }

    ngOnInit() {
        console.log(this.pcs.isPipelineEdit);
    }

    /**
     * 采集时间发生改变 触发
     */
    onChange(e: any) {
        const that = this;
        let begin = new Date(e[0]);
        begin.setHours(0);
        begin.setMinutes(0);
        begin.setSeconds(0);
        let end = new Date(e[1]);
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);
        that.pcs.nodeData.acquisitionStartTime = begin.getTime();
        that.pcs.nodeData.acquisitionEndTime = end.getTime();
    }

    /**
     * 重置采集时间
     */
    reset() {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        that.dateList = [];
        that.pcs.nodeData.acquisitionStartTime = '';
        that.pcs.nodeData.acquisitionEndTime = '';
    }

    disabledDate = (current: Date): boolean => {
        let a = differenceInCalendarDays(current, this.pcs.startTime) < 0;
        let b = differenceInCalendarDays(current, this.pcs.endTime) > 0;
        return a || b;
    }
}
