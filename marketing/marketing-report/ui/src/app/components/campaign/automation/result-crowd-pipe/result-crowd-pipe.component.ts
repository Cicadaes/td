import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PipelineNodeCommunicationService } from '../../../../services/communication/pipeline-node.communication.service';
import * as moment from 'moment';

@Component({
	selector: 'result-crowd-pipe',
	templateUrl: 'result-crowd-pipe.component.html',
	styleUrls: ['result-crowd-pipe.component.scss'],
	providers: []
})
//生成人群管道
export class ResultCrowdPipeComponent {
	//时间插件使用数据
    marketingValue: any = {
        showIcon: true,
        ranges: [{
            label: '今天', day: 1
        },
        {
            label: '最近七天', day: 7
        },
        {
            label: '最近一个月', day: 30
        },
        {
            label: '季度', day: 90
        }],
        dateRanges: { max: null, min: new Date(new Date().getTime() + 3600000 * 24) }
    };

    @Input() nodeData: any;

    @Input() startTime: any;
    
    @Input() endTime: any;
    
    @Output() changeOverflow = new EventEmitter<any>();
    
    constructor(
        public pipelineNodeCommunicationService: PipelineNodeCommunicationService
    ) {

    }

    ngOnChanges() {
        let that = this;
        that.marketingValue.dateRanges.max = new Date(that.pipelineNodeCommunicationService.endTime);
        that.marketingValue.dateRanges.min = new Date(that.pipelineNodeCommunicationService.startTime);
        if (that.pipelineNodeCommunicationService.nodeData.acquisitionStartTime && that.pipelineNodeCommunicationService.nodeData.acquisitionEndTime) {
            that.marketingValue['data'] = {
                start: new Date(+that.pipelineNodeCommunicationService.nodeData.acquisitionStartTime),
                end: new Date(+that.pipelineNodeCommunicationService.nodeData.acquisitionEndTime)
            }
        } else {
            that.marketingValue['data'] = {start: null, end: null};
        }
        that.marketingValue = Object.assign({}, that.marketingValue);
    }

    ngOnInit() {

    }
	
	//选择时间区间
    onSelect(date: any) {
		let that = this;
        that.pipelineNodeCommunicationService.nodeData.acquisitionStartTime = moment(date.start).format('x');
        that.pipelineNodeCommunicationService.nodeData.acquisitionEndTime = moment(date.end).format('x');
    }

    //重置时间
    reset() {
        let that = this;
        that.marketingValue['data'] = {start: null, end: null};
        that.pipelineNodeCommunicationService.nodeData.acquisitionStartTime = null;
        that.pipelineNodeCommunicationService.nodeData.acquisitionEndTime = null;
        that.marketingValue = Object.assign({}, that.marketingValue);
    }

    onDateClick(e: any) {
        let that = this;
        if (!that.marketingValue['data'].start) {
            if (that.pipelineNodeCommunicationService.nodeData.acquisitionStartTime) {
                that.marketingValue['data'].start = new Date(+that.pipelineNodeCommunicationService.nodeData.acquisitionStartTime);
            } else {
                that.marketingValue['data'].start = that.pipelineNodeCommunicationService.startTime;
            }
        }
        if (!that.marketingValue['data'].end) {
            if (that.pipelineNodeCommunicationService.nodeData.acquisitionEndTime) {
                that.marketingValue['data'].end = new Date(+that.pipelineNodeCommunicationService.nodeData.acquisitionEndTime);
            } else {
                that.marketingValue['data'].end = that.pipelineNodeCommunicationService.endTime;
            }
        }
        
        that.changeOverflow.emit(e);
    }
}