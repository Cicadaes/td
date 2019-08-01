import { Component, Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
import { PipelineNodeCommunicationService } from "../../../../services/communication/pipeline-node.communication.service";
import { BehaviorDefinitionResourceService } from "../../../../services/admin/behavior-definition.resource.service";
import { PipelineDefinitionResourceService } from "../../../../services/admin/pipeline-definition.resource.service";

@Component({
	selector: 'filter-pipe',
	templateUrl: 'filter-pipe.component.html',
	styleUrls: ['filter-pipe.component.scss'],
	providers: [BehaviorDefinitionResourceService, PipelineDefinitionResourceService ]
})

//过滤管道
export class FilterPipeComponent {

	// propertyType: string = "或者";   //人群属性和人群行为之间的关系

	msgs: Message[] = [];  //检测成功\系统报错 使用

	tagList: SelectItem[]; //标签列表

	relationData: any;

	@Input() nodeData: any;

	constructor(
		public pipelineNodeCommunicationService: PipelineNodeCommunicationService,
		public behaviorDefinitionResourceService: BehaviorDefinitionResourceService,
		public pipelineDefinitionResourceService: PipelineDefinitionResourceService
	) {
		let that = this;
	}

	ngOnChanges() {
		let that = this;
		that.relationData = {name: '或者', value: '|'};

		if (!that.pipelineNodeCommunicationService.nodeData['tagRowKeyList']) {
			that.pipelineNodeCommunicationService.nodeData['tagRowKeyList'] = [''];
		}
		if (that.pipelineNodeCommunicationService.nodeData['relation'] && that.pipelineNodeCommunicationService.nodeData['relation'] == '&') {
			that.relationData = {name: '并且', value: '&'};
		} else {
            that.pipelineNodeCommunicationService.nodeData['relation'] = '|';
        }

		that.pipelineDefinitionResourceService.getFileter().then((data: any) => {
			that.tagList = [];
			data.map((data: any) => {
				that.tagList.push({label: data.name, value: data.code});
            })
		}).catch();
	}

	ngOnInit() {
		let that = this;
		
	}

	//添加标签
	addTag(tagDatas?: any) {
		let that = this;
		if (that.pipelineNodeCommunicationService.nodeData.tagRowKeyList.length >= 10) {
			that.showMessageNews('error', '最多可以添加10条');
			return;
        }
        for (let tag of that.pipelineNodeCommunicationService.nodeData.tagRowKeyList) {
            if (!tag) {
                that.showMessageNews('error', '还有未选择的标签！');
                return;
            }
        };
		that.pipelineNodeCommunicationService.nodeData['tagRowKeyList'].push(null);
	}

	//删除标签
	delTag(index: number) {
		let that = this;
		that.pipelineNodeCommunicationService.nodeData['tagRowKeyList'].splice(index, 1);
    }
    
    checkTagRepaet(value: any, index: number) {
        
    }

	//修改关系
	changeRelation() {
		let that = this;
		if (that.relationData.value === '|') {
			that.relationData = {name: '并且', value: '&'};
			that.pipelineNodeCommunicationService.nodeData['relation'] = '&';
		} else {
			that.relationData = {name: '或者', value: '|'};
			that.pipelineNodeCommunicationService.nodeData['relation'] = '|';
		}
	}

	// 右上角提示信息
	showMessageNews(type: any, detail: any) {
		let that = this;
		let message = '';
		if (type === 'info') {
			message = '成功';
		} else if (type === 'error') {
			message = '失败';
		}
		that.msgs.push({severity: type, summary: message, detail: detail})
	}

	// changePropertyType() {
	// 	if (this.propertyType === '或者') {
	// 		this.propertyType = '并且';
	// 	} else {
	// 		this.propertyType = '或者';
	// 	}
	// }
}