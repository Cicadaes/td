import { Component, Pipe, OnChanges, Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import * as _ from 'lodash';

import { PipelineNodeCommunicationService } from "../../../../services/communication/pipeline-node.communication.service";
import { PipelineDefinitionResourceService } from "../../../../services/admin/pipeline-definition.resource.service";
import { PipelineCommunicationService } from '../../../../services/communication/pipeline.communication.service';

@Component({
	selector: 'distributary-pipe',
	templateUrl: 'distributary-pipe.component.html',
	styleUrls: ['distributary-pipe.component.scss'],
	providers: []
})
export class DistributaryPipeComponent implements OnChanges {
	branchNumberList: SelectItem[] = [];
	errorList: any[] = [];
	valEnums: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	// valEnums: any = ['A','B','C','D','E','F','G','H','I','J','K','L','M']; // 分支数值前的字母
	dimensionList: SelectItem[] = []; // 维度列表
	dimensions: any = []; // 维度
	selectDimension: any = []; // 选中的维度列表
	selectAll: boolean = false; // 选中所有
	tempRatioData: any; // 临时存储占比数据
	min: number = 1;
	max: number = 100;

	defaultData: any = {
		type: 'split'
	}

	@Input() nodeData: any;

	constructor(
		public pipelineNodeCommunicationService: PipelineNodeCommunicationService,
		public pipelineDefinitionResourceService: PipelineDefinitionResourceService,
		public pipelineCommunicationService: PipelineCommunicationService
	) {
		let that = this;
	}

	ngOnChanges() {
		let that = this;
		that.selectDimension = [];
		that.dimensions = [];
		that.defaultData['id'] = that.nodeData.id;
		
		//分流类型默认为1 即人数
		if (!that.nodeData['splitType']) {
			that.pipelineNodeCommunicationService.nodeData['splitType'] = '1';	
		} else {
			that.pipelineNodeCommunicationService.nodeData['splitType'] += '';
		}

		//默认添加一个分支
		if (!that.nodeData['branchList']) {
			that.pipelineNodeCommunicationService.nodeData['branchList'] = [];
		}

		//默认分支数量
		if (!that.nodeData.count && !that.nodeData.dimensionCode) {
			if (that.nodeData.splitType == '3') {
                that.pipelineNodeCommunicationService.nodeData.count = that.pipelineNodeCommunicationService.nodeData['branchList'].length || 0;
            } else {
                that.pipelineNodeCommunicationService.nodeData.count = 0;  //默认一个分支
            }
        }

		//初始化维度和占比的数据
		if (that.nodeData['branchList']) {
			if (that.nodeData.splitType == '3') {
				for (let i = 0; i < that.nodeData['branchList'].length; i++) {
					that.selectDimension.push(that.nodeData['branchList'][i]['optionCode']);										
				}
			} else if (that.nodeData.splitType == '2') {
				//多分支时 max值为  100减去其分支数加1
				that.max = 101 - that.nodeData.branchList.length;
			} else {
				for (let i = 0; i < that.nodeData['branchList'].length; i++) {
					if (that.nodeData['branchList'].max === '0') {
						that.nodeData['branchList'].max = '';
					}
				}
			}
		}

		//初始化维度相关数据
		if (that.nodeData.dimensionCode) {
			if (that.nodeData.dimensionCode instanceof Array) {
				that.nodeData.dimensionCode = that.nodeData.dimensionCode[0];        
			}
			let dimensionMap = {};
			
			// 获取维度列表
			that.pipelineDefinitionResourceService.getDimensionList().then((res: any) => {
				for (let i = 0; i < res.length; i++) {
					that.dimensionList.push({label: res[i].name, value: [res[i].code,  res[i].value]});
					dimensionMap[res[i].code] = res[i].value;
				}
				return that.pipelineDefinitionResourceService.getDimensionById(dimensionMap[that.nodeData.dimensionCode])
			}).then((res: any) => {

				for(let i = 0; i < res.length; i++) {
					that.dimensions.push({value: res[i].code, name: res[i].name});
				}
				if(that.selectDimension.length === that.dimensions.length && that.dimensions.length !== 0) {
					that.selectAll = true;
				}
				that.pipelineNodeCommunicationService.nodeData.dimensionCode = [that.nodeData.dimensionCode, dimensionMap[that.nodeData.dimensionCode]];
			})
		}

		let branchListLength = that.nodeData['branchList'].length;
		if (that.nodeData.count && branchListLength !== that.nodeData.count) {
			for (let i = branchListLength; i < that.nodeData.count; i++){
				let json = {
					'name': that.getLastBranchName('', i),
				};
				if (that.nodeData.splitType == '1') {
					json['min'] = '0';
					json['max'] = '0';
				}
				that.pipelineNodeCommunicationService.nodeData['branchList'].push(json);
			}
		}
	}

	ngOnInit () {
		let that = this;
		that.branchNumberList.push({label: '2', value: 2});
		that.branchNumberList.push({label: '3', value: 3});
		that.branchNumberList.push({label: '4', value: 4});
		that.branchNumberList.push({label: '5', value: 5});
		that.branchNumberList.push({label: '6', value: 6});
		if (!that.nodeData.dimensionCode) {
			// 获取维度列表
			that.pipelineDefinitionResourceService.getDimensionList().then((res: any) => {
				for (let i = 0; i < res.length; i++) {
					that.dimensionList.push({label: res[i].name, value: [res[i].code,  res[i].value]});
				}
			}).catch();
		}
	}

	/**
	 * 获取下个分支名
	 * @param lastBranchName 
	 * @param index 直接获取第n个字母
	 */
	getLastBranchName(lastBranchName: string, index?: number) {
		let that = this;
		if (index || index == 0) {
			return that.valEnums.substr(index, 1);
		}
		let i = that.valEnums.indexOf(lastBranchName) + 1;
		if (i == 26) {
			i = 0;
		}
		return that.valEnums.substr(i, 1);
	}

	//选择分支数量
	changeBranchNumber(e: any) {
		let that = this;
		let length = that.pipelineNodeCommunicationService.nodeData['branchList'].length;
		let changeCount = Math.abs(+e.value - length);
		if (e.value > length) {
			for (let i = 0; i < changeCount; i++) {
				let json = {};
				if (length === 0) {
					json['name']= that.getLastBranchName('', i);
				} else {
					json['name']= that.getLastBranchName(that.pipelineNodeCommunicationService.nodeData['branchList'][length - 1 + i].name)
				}
				
				if (that.pipelineNodeCommunicationService.nodeData['splitType'] == '1') {
					json['min'] = 0;
					json['max'] = 0;
				}
				that.defaultData['lineType'] = 'a';
				that.defaultData['index'] = length + i;
				that.defaultData['name'] = json['name'];
				that.defaultData['expression'] = json['name'];
				that.pipelineCommunicationService.lineChangeMission(that.defaultData);
				that.pipelineNodeCommunicationService.nodeData['branchList'].push(json);
			}
		} else {
			for (let i = 0; i < changeCount; i++) {
				that.pipelineNodeCommunicationService.nodeData['branchList'].pop();
				that.defaultData['index'] = length - (i + 1);
				that.defaultData['lineType'] = 'd';
				that.defaultData['deleteType'] = '';
				that.pipelineCommunicationService.lineChangeMission(that.defaultData);
			}
		}
		if (that.pipelineNodeCommunicationService.nodeData['splitType'] == '2') {
			let mean = +(100 / e.value).toFixed(0);
			that.max = 100 - e.value + 1;
			for (let i = 0; i < e.value; i++) {
				if (i !== e.value - 1) {
					that.pipelineNodeCommunicationService.nodeData.branchList[i].percent = mean;
				} else if (i === e.value - 1) {
					that.pipelineNodeCommunicationService.nodeData.branchList[i].percent = 100 - (mean * (e.value - 1));
				}
			}
			that.tempRatioData = _.cloneDeep(that.pipelineNodeCommunicationService.nodeData.branchList);
		}
	}

	//选择维度
	changeDimension(e: any) {
		let that = this;
		that.dimensions = [];
		that.selectAll = false;
		that.selectDimension = [];
		that.pipelineNodeCommunicationService.nodeData.branchList = [];
		that.pipelineNodeCommunicationService.nodeData.count = 0;
		that.defaultData['lineType'] = 'd';
		that.defaultData['deleteType'] = 'all';
		that.pipelineCommunicationService.lineChangeMission(that.defaultData);
		that.pipelineDefinitionResourceService.getDimensionById(e.value[1]).then((res: any) => {
			for (let i = 0; i < res.length; i++) {
				that.dimensions.push({value: res[i].code, name: res[i].name});
			}
		})
	}

	//选择类型
	choosType(val: any){
		let that = this;
		// 如果选择的不是同一类型，那么初始化
		if (that.pipelineNodeCommunicationService.nodeData['splitType'] != val) {
			that.defaultData['lineType'] = 'd';
			that.defaultData['deleteType'] = 'all';
			that.pipelineCommunicationService.lineChangeMission(that.defaultData);
			that.pipelineNodeCommunicationService.nodeData['changeType'] = true;
			if (val == '1') {
				that.pipelineNodeCommunicationService.nodeData['count'] = 2;
				that.pipelineNodeCommunicationService.nodeData['branchList'] = [{
					'name': that.valEnums.substr(0 ,1),
					'min': 0,
					'max': 0
				}, {
					'name': that.valEnums.substr(1 ,1),
					'min': 0,
					'max': 0
				}];
				that.defaultData['lineType'] = 'a';
				that.defaultData['index'] = 0;
				that.defaultData['name'] = that.valEnums.substr(0 ,1);
				that.defaultData['expression'] = that.valEnums.substr(0 ,1);
				that.pipelineCommunicationService.lineChangeMission(that.defaultData);
				that.defaultData['lineType'] = 'a';
				that.defaultData['index'] = 1;
				that.defaultData['name'] = that.valEnums.substr(1 ,1);
				that.defaultData['expression'] = that.valEnums.substr(1 ,1);
				that.pipelineCommunicationService.lineChangeMission(that.defaultData);
			} else if (val == '2') {
                that.pipelineNodeCommunicationService.nodeData['count'] = 2;
                that.max = 99;
				that.pipelineNodeCommunicationService.nodeData['branchList'] = [{
					'name': that.valEnums.substr(0 ,1),
					'percent': 50
				}, {
					'name': that.valEnums.substr(1 ,1),
					'percent': 50
				}];
				that.defaultData['lineType'] = 'a';
				that.defaultData['index'] = 0;
				that.defaultData['name'] = that.valEnums.substr(0 ,1);
				that.defaultData['expression'] = that.valEnums.substr(0 ,1);
				that.pipelineCommunicationService.lineChangeMission(that.defaultData);
				that.defaultData['lineType'] = 'a';
				that.defaultData['index'] = 1;
				that.defaultData['name'] = that.valEnums.substr(1 ,1);
				that.defaultData['expression'] = that.valEnums.substr(1 ,1);
				that.pipelineCommunicationService.lineChangeMission(that.defaultData);		
			} else {
				if (that.selectDimension && that.selectDimension.length !== 0) {
					for (let i = 0; i < that.selectDimension.length; i++ ) {
						for (let j = 0; j < that.dimensions.length; j++) {
							if (that.dimensions[j].value === that.selectDimension[i]) {
								that.defaultData['lineType'] = 'a';
								that.defaultData['index'] = i;
								that.defaultData['name'] = that.dimensions[j].name;
								that.defaultData['expression'] = that.dimensions[j].name;
								that.pipelineCommunicationService.lineChangeMission(that.defaultData);
							}
						}	
					}
				}
				that.pipelineNodeCommunicationService.nodeData['count'] = 0;
				that.pipelineNodeCommunicationService.nodeData.branchList = [];			
			}
		}
		that.pipelineNodeCommunicationService.nodeData['splitType'] = val;	
	}

	// 选中所有dimension
	selectAllDimension(){
		let that = this;
		if (that.selectAll) {
			let tempDimension = [];
			for (let i = 0; i < that.dimensions.length; i++) {
				tempDimension.push(that.dimensions[i].value);
			}
			let tempDifference = _.difference(tempDimension, that.selectDimension);
			if (tempDifference && tempDifference.length > 0) {
				for (let i = 0; i < tempDifference.length; i++) {
					for (let j = 0; j < that.dimensions.length; j++) {
						if (tempDifference[i] == that.dimensions[j].value) {
							that.defaultData['lineType'] = 'a';
							that.defaultData['index'] = j;
							that.defaultData['name'] = that.dimensions[j].name;
							that.defaultData['expression'] = that.dimensions[j].name;
							that.pipelineCommunicationService.lineChangeMission(that.defaultData);
							that.pipelineNodeCommunicationService.nodeData.branchList.push({
								name: that.dimensions[j].name,
								optionCode: tempDifference[i]
							});
						}
					}
					that.pipelineNodeCommunicationService.nodeData.count = that.pipelineNodeCommunicationService.nodeData.branchList.length;
					that.selectDimension = tempDimension;
				}
			}
		} else {
			that.selectDimension = [];
			that.defaultData['lineType'] = 'd';
			that.defaultData['deleteType'] = 'all';
			that.pipelineCommunicationService.lineChangeMission(that.defaultData);
			that.pipelineNodeCommunicationService.nodeData.branchList = [];
			that.pipelineNodeCommunicationService.nodeData.count = 0;
		}
	}

	// 选中单个dimension
	bindDimension(e: any){
		let that = this;
		if (that.selectDimension.length !== that.dimensions.length) {
			that.selectAll = false;
		} else {
			that.selectAll = true;
		}
		let tempDimension = [];
		for (let i = 0; i < that.pipelineNodeCommunicationService.nodeData.count; i++) {
			tempDimension.push(that.pipelineNodeCommunicationService.nodeData.branchList[i].optionCode);
		}
		if (e) {
			let tempDifference = _.difference(that.selectDimension, tempDimension);
			if (tempDifference && tempDifference.length > 0) {
				for (let i = 0; i < tempDifference.length; i++) {
					for (let j = 0; j < that.dimensions.length; j++) {
						if (tempDifference[i] == that.dimensions[j].value) {
							that.defaultData['lineType'] = 'a';
							that.defaultData['index'] = j;
							that.defaultData['name'] = that.dimensions[j].name;
							that.defaultData['expression'] = that.dimensions[j].name;
							that.pipelineCommunicationService.lineChangeMission(that.defaultData)
							that.pipelineNodeCommunicationService.nodeData.branchList.push({
								name: that.dimensions[j].name,
								optionCode: tempDifference[i]
							});
						}
					}
					that.pipelineNodeCommunicationService.nodeData.count = that.pipelineNodeCommunicationService.nodeData.branchList.length;
				}
			}
		} else {
			let tempDifference = _.difference(tempDimension, that.selectDimension);
			if (tempDifference && tempDifference.length > 0) {
				let index: number;
				for (let i = 0; i < that.dimensions.length; i++){
					if (that.dimensions[i].value === tempDifference[0]) {
						index = i;
						break;
					}
				}
				if (index || index === 0) {
					that.defaultData['lineType'] = 'd';
					that.defaultData['deleteType'] = '';
					that.defaultData['index'] = index;
					that.pipelineCommunicationService.lineChangeMission(that.defaultData);
					let flag
					for (let i = 0; i < that.pipelineNodeCommunicationService.nodeData.count; i++) {
						if (that.pipelineNodeCommunicationService.nodeData.branchList[i].optionCode === tempDifference[0]) {
							flag = i;
						}
					}
					if (flag || flag === 0) {
						that.pipelineNodeCommunicationService.nodeData.branchList.splice(flag, 1);
						that.pipelineNodeCommunicationService.nodeData.count = that.pipelineNodeCommunicationService.nodeData.branchList.length;
				}
				}
			}
		}
	}

	/**
	 * 输入框修改分支占比
	 * @param {*} e 输入值
	 * @param {number} index 分支位置
	 */
	changeInputRatio(e: any, index: number) {
		let that = this;

		const POSITIVE_INTEGER: RegExp = /^(-?\d+)(\.\d+)?$/;
		const BRANCHLIST_LENGTH: number = that.pipelineNodeCommunicationService.nodeData.branchList.length;

		let inputText = e.target.value;
		that.pipelineNodeCommunicationService.nodeData.branchList[index].percent = inputText;	
				
		if (POSITIVE_INTEGER.test(inputText)) { // 如果是浮点数
			if (inputText > that.max) {
				that.pipelineNodeCommunicationService.nodeData.branchList[index].percent = that.max;
				e.target.value = that.max;
			}
			if (inputText < that.min) {
				that.pipelineNodeCommunicationService.nodeData.branchList[index].percent = that.min;
				e.target.value = that.min;
			}
		}	
		
		if (inputText === '' || inputText === null) {
			that.pipelineNodeCommunicationService.nodeData.branchList[index].percent = that.min;
			e.target.value = that.min;
		}

		that.checkAutoRatio(index);
	}
	
	//滚动条修改分支占比
	changeRatio(e: any, index: number) {
		let that = this;
		that.pipelineNodeCommunicationService.nodeData.branchList[index].percent = e.value;

		that.checkAutoRatio(index);
	}

	checkAutoRatio(index: number) {
		let that = this;
		const BRANCHLIST_LENGTH: number = that.pipelineNodeCommunicationService.nodeData.branchList.length;
		
		// 假设A，B，C三个变量之和为100，最大值为101-3，最小值为1
		// 其中一个变量变大时，下一个变量值为100-this-next(1)
		// 如果下一个变量的值为1，那么继续向下100-this-next(1)-next(2)
		// 如果最后一个变量为1，那么100-this-next(1)-next(2)-...-next(last)-first-....-this(prev)

        let thisValue = that.pipelineNodeCommunicationService.nodeData.branchList[index].percent;
        let pointer: number = index + 1;
		for (let i = 0; i < BRANCHLIST_LENGTH-1; i++) {
			if (pointer > BRANCHLIST_LENGTH-1 && index === BRANCHLIST_LENGTH-1) {
				pointer = BRANCHLIST_LENGTH-2; // 如果更改的最后一个，指针变为倒数第二个
            }
            if (pointer > BRANCHLIST_LENGTH-1) {
                pointer = 0; 
            }
			let otherValue = (function(elIndex) {
				let sum: number = 0;
				for (let j = 0;j < BRANCHLIST_LENGTH; j++) {
					if(j !== elIndex) {
						sum += that.pipelineNodeCommunicationService.nodeData.branchList[j].percent * 1;
					}
				}
				return sum;
            })(pointer);

			if (that.pipelineNodeCommunicationService.nodeData.branchList[pointer].percent >= 1) {
				that.pipelineNodeCommunicationService.nodeData.branchList[pointer].percent = 100 - otherValue;
				if (that.pipelineNodeCommunicationService.nodeData.branchList[pointer].percent > 0) {
					break;
				} else {
					that.pipelineNodeCommunicationService.nodeData.branchList[pointer].percent = 1;
				}
			}

			// 现在判断this的next是为1的时候才能继续找next
			// 但是，这里当this等于max时，this的nexts都为1
			// 就不能正确的响应this的变化
			let specialStatus = (function(sp) {
				let flag = false;
				for (let j = 0;j < BRANCHLIST_LENGTH; j++) {
					if (j !== sp && that.pipelineNodeCommunicationService.nodeData.branchList[j].percent != 1) {
						flag = true;
					}
				}
				return flag;
			})(index);

			if (!specialStatus) {
				that.pipelineNodeCommunicationService.nodeData.branchList[pointer].percent = 100 - otherValue;
				if (that.pipelineNodeCommunicationService.nodeData.branchList[pointer].percent > 0) {
					break;
				} else {
					that.pipelineNodeCommunicationService.nodeData.branchList[pointer].percent = 1;
				}
			}
            
            if (index === BRANCHLIST_LENGTH-1) {
                pointer --;
            } else {
                pointer ++;                
            }
		}
	}

	/**
	 * 校验分支数值时 取值范围
	 * 同一分支上 下限输入值不能大于上限输入值
	 */
	checkNumber(data: any, index: number) {
		let that = this;
		if (data.min && data.max) {
			if (+data.min > +data.max) {
				that.errorList[index] = true;
			} else {
				that.errorList[index] = false;
			}
		} else {
			that.errorList[index] = false;
		}
	}
}