import {Component, OnInit} from '@angular/core';
import {PipelineService} from '../../pipeline.service';
import {PipelineCommunicationService} from '../../pipeline-communication.service';

@Component({
    selector: 'app-filter-panel',
    templateUrl: './filter-panel.component.html',
    styleUrls: ['./filter-panel.component.less']
})
export class FilterPanelComponent implements OnInit {

    targetList: any;   // 标签列表

    relationData: any; // 标签之间的关系

    constructor(public pipelineService: PipelineService,
                public pcs: PipelineCommunicationService) {
        const that = this;
        that.relationData = {name: '或者', value: '|'};
        if (that.pcs.nodeData['relation'] && that.pcs.nodeData['relation'] == '&') {
            that.relationData = {name: '并且', value: '&'};
        } else {
            that.pcs.nodeData['relation'] = '|';
        }

        that.pcs.nodeData.dynamicList = [];
        if (that.pcs.nodeData.tagRowKeyList) {
            for (let i = 0; i < that.pcs.nodeData.tagRowKeyList.length; i++) {
                const obj = that.pcs.nodeData.tagRowKeyList[i];
                that.pcs.nodeData.dynamicList.push({key: obj});
            }
        }
        if (that.pcs.nodeData.dynamicList.length == 0) {
            that.pcs.nodeData.dynamicList.push({key: null});
        }

    }

    ngOnInit() {
        const that = this;
        that.pipelineService.getTargetListForFilter(that.pcs.nodeData.tagRowKeyList).subscribe((data: any) => {
            if (data.code === 200) {
                that.targetList = data.data;
                for (var i = 0; i < that.targetList.length; i++) {
                    var obj = that.targetList[i];
                    obj.idStr = obj.id + '';
                }
            } else {
                that.targetList = [];
            }
        })
    }

    /**
     * 添加过滤器标签
     */
    addFilter() {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        if (that.pcs.nodeData.dynamicList.length >= 10) {
            that.pcs.message.create('error', '最多添加10个标签');
            return;
        }

        for (var i = 0; i < that.pcs.nodeData.dynamicList.length; i++) {
            var obj = that.pcs.nodeData.dynamicList[i];
            if (!obj.key) {
                that.pcs.message.create('error', '请选择标签');
                return;
            }
        }
        that.pcs.nodeData.dynamicList.push({key: null});
    }

    /**
     * 删除过滤器标签
     */
    removeFilter(index: number) {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        that.pcs.nodeData.dynamicList.splice(index, 1);
    }

    /**
     * 修改关系
     */
    changeRelation() {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        if (that.relationData.value === '|') {
            that.relationData = {name: '并且', value: '&'};
            that.pcs.nodeData['relation'] = '&';
        } else {
            that.relationData = {name: '或者', value: '|'};
            that.pcs.nodeData['relation'] = '|';
        }
    }
}
