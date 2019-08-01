import {Component, OnInit, Pipe} from '@angular/core';
import {PipelineService} from '../../pipeline.service';
import {PipelineCommunicationService} from '../../pipeline-communication.service';

@Component({
    selector: 'app-shunt-panel',
    templateUrl: './shunt-panel.component.html',
    styleUrls: ['./shunt-panel.component.less']
})
export class ShuntPanelComponent implements OnInit {
    splitType: any = '1';               // 分流类型
    countList: any = [];                // 分支数量数组
    dimensionsList: any = [];           // 维度选择下拉数据
    errorList: any[] = [];
    nodeData: any = {};
    max: any;
    ratioIsError = false;               // 判断分支占比中和是否为100%
    valEnums = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    percentList: any = [];              // 占比的百分比下拉值

    allChecked: boolean;                // 维度 维度值全选
    indeterminate: boolean;             // 维度 维度值全选状态控制
    dimensionsOptionsList: any = [];    // 维度 维度值列表

    defaultData: any = {                // 分流器 分支数量改变数据
        type: 'split'
    }

    constructor(public pipelineService: PipelineService,
                public pcs: PipelineCommunicationService) {
    }

    ngOnInit() {
        console.log(this.pcs.nodeData);
        // this.pcs.isPipelineEdit = false;
        const that = this;
        // 数据绑定
        that.defaultData['id'] = that.pcs.nodeData.id;
        that.defaultData['nodeId'] = that.pcs.nodeData.nodeId;

        if (!that.pcs.nodeData['splitType']) {
            that.pcs.nodeData['splitType'] = '1';
        } else {
            that.pcs.nodeData['splitType'] += '';
        }

        // 默认添加一个分支
        if (!that.pcs.nodeData['branchList']) {
            that.pcs.nodeData['branchList'] = [];
        }

        // 默认分支数量
        if (!that.pcs.nodeData.count && !that.pcs.nodeData.dimensionCode) {
            if (that.pcs.nodeData.splitType === '3') {
                that.pcs.nodeData.count = that.pcs.nodeData['branchList'].length || 0;
            } else {
                that.pcs.nodeData.count = 2;  // 默认一个分支
            }
        }

        // 初始化维度和占比的数据
        if (that.pcs.nodeData['branchList']) {
            if (that.pcs.nodeData.splitType === '3') {
                // 初始化已选择的维度列表
            } else if (that.pcs.nodeData.splitType === '2') {
                // 多分支时 max值为  100减去其分支数加1
                that.max = 101 - that.pcs.nodeData.branchList.length;
                // 初始化检查数据是否正确
                // that.checkPercent(); TODO
            } else {
                for (let i = 0; i < that.pcs.nodeData['branchList'].length; i++) {
                    if (that.pcs.nodeData['branchList'].max === '0') {
                        that.pcs.nodeData['branchList'].max = '';
                    }
                }
            }
        }

        const branchListLength = that.pcs.nodeData.branchList.length;
        if (that.pcs.nodeData.count && branchListLength !== that.pcs.nodeData.count) {
            for (let i = branchListLength; i < that.pcs.nodeData.count; i++) {
                const json = {
                    name: that.getLastBranchName('', i)
                };
                if (that.pcs.nodeData.splitType === '1') {
                    json['min'] = '0';
                    json['max'] = '0';
                }
                that.defaultData['lineType'] = 'a';
                that.defaultData['index'] = i;
                that.defaultData['name'] = json.name;
                that.defaultData['expression'] = json.name;
                that.pcs.lineChangeMission(that.defaultData);
                that.pcs.nodeData.branchList.push(json);
            }
        }

        // 初始化维度相关数据
        that.pipelineService.getShuntDimensionsList(that.pcs.isPipelineEdit).subscribe((result: any) => {
            if (result.code === 200) {
                that.dimensionsList = result.data.data;
                if (!that.pcs.nodeData.dimensionCode && that.dimensionsList.length) {
                    that.pcs.nodeData.dimensionCode = that.dimensionsList[0].code;
                }
                if (that.pcs.nodeData.dimensionCode && that.dimensionsList.length) {
                    let dimensionId = that.dimensionsList[0].id;
                    for (let i = 0; i < that.dimensionsList.length; i++) {
                        if (that.pcs.nodeData.dimensionCode === that.dimensionsList[i].code) {
                            dimensionId = that.dimensionsList[i].id;
                        }
                    }
                    that.pipelineService.getShuntDimensionsOptionList(dimensionId).subscribe((result: any) => {
                        if (result.code === 200) {
                            that.dimensionsOptionsList = [];
                            const length = result.data.data.length;
                            let flag = true;    // 用于判断是否是全选
                            for (let i = 0; i < length; i++) {
                                const branchLength = that.pcs.nodeData.branchList.length;
                                const json = {
                                    label: result.data.data[i].value,
                                    value: result.data.data[i].key
                                };
                                for (let j = 0; j < branchLength; j++) {
                                    if (that.pcs.nodeData.branchList[j].optionCode === result.data.data[i].key) {
                                        json['checked'] = true;
                                        break;
                                    }
                                }
                                if (!json['checked']) {
                                    flag = false;
                                }
                                that.dimensionsOptionsList.push(json);
                            }
                            if (flag) {
                                that.allChecked = true;
                            }
                        }
                    });
                }
            }
        });

        // 以前数据
        // 初始化维度相关数据
        if (that.nodeData.dimensionCode) {
            if (that.nodeData.dimensionCode instanceof Array) {
                that.nodeData.dimensionCode = that.nodeData.dimensionCode[0];
            }
            const dimensionMap = {};

            // 获取维度列表
        }

        that.countList = [
            2, 3, 4, 5, 6
        ];

        let value = 0;
        for (let i = 0; i < 19; i++) {
            value = 5 * (i + 1);
            that.percentList.push({
                percent: value,
                id: i
            });
        }
    }

    /**
     * 获取下个分支名
     * @param lastBranchName
     * @param index 直接获取第n个字母
     */
    getLastBranchName(lastBranchName: string, index?: number) {
        const that = this;
        if (index || index === 0) {
            return that.valEnums.substr(index, 1);
        }
        let i = that.valEnums.indexOf(lastBranchName) + 1;
        if (i === 26) {
            i = 0;
        }
        return that.valEnums.substr(i, 1);
    }

    /**
     * 校验占比是否正确
     */
    checkPercent() {
        const that = this;
        let temp = 0;
        for (let i = 0; i < that.pcs.nodeData.branchList.length; i++) {
            temp += +that.pcs.nodeData.branchList[i].percent;
        }
        if (temp !== 100) {
            that.ratioIsError = true;
        } else {
            that.ratioIsError = false;
        }
    }

    // 分流类型
    splitTypeChange(value: any) {
        console.log(value, this.pcs.nodeData.splitType);
        const that = this;
        // 如果不是同一类型 初始化数据
        that.defaultData['lineType'] = 'd';
        that.defaultData['deleteType'] = 'all';
        that.pcs.lineChangeMission(that.defaultData);
        that.pcs.nodeData['changeType'] = true;
        if (value === '1') {
            that.pcs.nodeData['count'] = 2;
            that.pcs.nodeData['branchList'] = [{
                'name': that.valEnums.substr(0, 1),
                'min': 0,
                'max': 0
            }, {
                'name': that.valEnums.substr(1, 1),
                'min': 0,
                'max': 0
            }];
            that.allChecked = false;
            that.dimensionsOptionsList.forEach(item => item.checked = false);
            that.defaultData['lineType'] = 'a';
            that.defaultData['index'] = 0;
            that.defaultData['name'] = that.valEnums.substr(0, 1);
            that.defaultData['expression'] = that.valEnums.substr(0, 1);
            that.pcs.lineChangeMission(that.defaultData);
            that.defaultData['lineType'] = 'a';
            that.defaultData['index'] = 1;
            that.defaultData['name'] = that.valEnums.substr(1, 1);
            that.defaultData['expression'] = that.valEnums.substr(1, 1);
            that.pcs.lineChangeMission(that.defaultData);
        } else if (value === '2') {
            that.pcs.nodeData['count'] = 2;
            that.pcs.nodeData['branchList'] = [{
                'name': that.valEnums.substr(0, 1),
                'percent': 5
            }, {
                'name': that.valEnums.substr(1, 1),
                'percent': 5
            }];
            that.allChecked = false;
            that.dimensionsOptionsList.forEach(item => item.checked = false);
            that.defaultData['lineType'] = 'a';
            that.defaultData['index'] = 0;
            that.defaultData['name'] = that.valEnums.substr(0, 1);
            that.defaultData['expression'] = that.valEnums.substr(0, 1);
            that.pcs.lineChangeMission(that.defaultData);
            that.defaultData['lineType'] = 'a';
            that.defaultData['index'] = 1;
            that.defaultData['name'] = that.valEnums.substr(1, 1);
            that.defaultData['expression'] = that.valEnums.substr(1, 1);
            that.pcs.lineChangeMission(that.defaultData);
        } else {
            that.pcs.nodeData['count'] = 0;
            that.pcs.nodeData.branchList = [];
        }
    }

    // 分流类型人数OR占比 分支数量
    branchCountChange(value: any, type: any) {
        const that = this;
        const length = that.pcs.nodeData['branchList'].length;
        const changeCount = Math.abs(+value - length);
        if (value > length) {
            for (let i = 0; i < changeCount; i++) {
                const json = {};
                if (length === 0) {
                    json['name'] = that.getLastBranchName('', i);
                } else {
                    json['name'] = that.getLastBranchName(that.pcs.nodeData['branchList'][length - 1 + i].name);
                }

                if (that.pcs.nodeData['splitType'] === '1') {
                    json['min'] = 0;
                    json['max'] = 0;
                }
                that.defaultData['lineType'] = 'a';
                that.defaultData['index'] = length + i;
                that.defaultData['name'] = json['name'];
                that.defaultData['expression'] = json['name'];
                that.pcs.lineChangeMission(that.defaultData);
                that.pcs.nodeData['branchList'].push(json);
                if (that.pcs.nodeData['splitType'] === '2') {
                    that.pcs.nodeData.branchList[length + i]['percent'] = 5;
                }
            }
        } else {
            for (let i = 0; i < changeCount; i++) {
                that.pcs.nodeData['branchList'].pop();
                that.defaultData['index'] = length - (i + 1);
                that.defaultData['lineType'] = 'd';
                that.defaultData['deleteType'] = '';
                that.pcs.lineChangeMission(that.defaultData);
            }
        }
        if (that.pcs.nodeData.splitType === 2) {
            that.checkPercent();
        }
    }

    // 维度选择
    dimensionsChange(value: any) {
        const that = this;
        that.allChecked = false;
        that.pcs.nodeData.branchList = [];
        that.pcs.nodeData.count = 0;
        that.defaultData['lineType'] = 'd';
        that.defaultData['deleteType'] = 'all';
        that.pcs.lineChangeMission(that.defaultData);
        let dimensionId;
        for (let i = 0; i < that.dimensionsList.length; i++) {
            if (value === that.dimensionsList[i].code) {
                dimensionId = that.dimensionsList[i].id;
            }
        }
        that.pipelineService.getShuntDimensionsOptionList(dimensionId).subscribe((result: any) => {
            if (result.code === 200) {
                that.dimensionsOptionsList = [];
                let length = result.data.data.length;
                for (let i = 0; i < length; i++) {
                    let json = {
                        label: result.data.data[i].value,
                        value: result.data.data[i].key
                    };
                    that.dimensionsOptionsList.push(json);
                }
            }
        })
    }

    /**
     * 校验分支数值时 取值范围
     * 同一分支上 下限输入值不能大于上限输入值
     */
    checkNumber(data: any, index: number) {
        const that = this;
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

    /**
     * 维度值全选状态改变
     */
    updateAllChecked() {
        const that = this;
        that.indeterminate = false;
        // TODO 绑定数据
        if (that.allChecked) {
            that.dimensionsOptionsList.forEach((item, i) => {
                if (!item.checked) {
                    item.checked = true;
                    that.defaultData['lineType'] = 'a';
                    that.defaultData['index'] = i;
                    that.defaultData['name'] = item.label;
                    that.defaultData['expression'] = item.label;
                    that.pcs.lineChangeMission(that.defaultData);
                    that.pcs.nodeData.branchList.push({
                        name: item.label,
                        optionCode: item.value
                    });
                    that.pcs.nodeData.count = that.pcs.nodeData.branchList.length;
                }
            });
        } else {
            that.defaultData['lineType'] = 'd';
            that.defaultData['deleteType'] = 'all';
            that.pcs.lineChangeMission(that.defaultData);
            that.pcs.nodeData.branchList = [];
            that.pcs.nodeData.count = 0;
            that.dimensionsOptionsList.forEach(item => item.checked = false);
        }
    }

    /**
     * 维度值选中状态改变
     */
    updateDimensionsOptions(data: any, index: number) {
        const that = this;
        // TODO 数据处理
        if (that.dimensionsOptionsList.every(item => item.checked === true)) {
            that.allChecked = true;
            that.indeterminate = false;
//        } else if (that.dimensionsOptionsList.every(item => item.checked === false || item.checked === undefined)) {
//            that.allChecked = false;
//            that.indeterminate = false;
        } else {
            that.allChecked = false;
            that.indeterminate = false;
        }
        if (data.checked) {
            that.defaultData['lineType'] = 'a';
            that.defaultData['index'] = index;
            that.defaultData['name'] = data.label;
            that.defaultData['expression'] = data.label;
            that.pcs.lineChangeMission(that.defaultData);
            that.pcs.nodeData.branchList.push({
                name: data.label,
                optionCode: data.value
            });
        } else {
            that.defaultData['lineType'] = 'd';
            that.defaultData['deleteType'] = '';
            that.defaultData['index'] = index;
            that.pcs.lineChangeMission(that.defaultData);
            let flag;
            for (let i = 0; i < that.pcs.nodeData.branchList.length; i++) {
                if (+that.pcs.nodeData.branchList[i].optionCode === +data.value) {
                    flag = i;
                    break;
                }
            }
            if (flag || flag === 0) {
                that.pcs.nodeData.branchList.splice(flag, 1);
                that.pcs.nodeData.count = that.pcs.nodeData.branchList.length;
            }
        }
    }
}
