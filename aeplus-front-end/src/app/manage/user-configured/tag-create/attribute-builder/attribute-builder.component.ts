import {Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import {TagCreateService} from '../tag-create.service';

@Component({
    selector: 'app-attribute-builder',
    templateUrl: './attribute-builder.component.html',
    styleUrls: ['./attribute-builder.component.less']
})
export class AttributeBuilderComponent implements OnInit, OnChanges {

    @Input() boolFilters: Array<any>;                     // 表单条目（必填）
    @Input() hideAndOr: any = false;                      // 隐藏并且或者（人群构建行为属性使用）
    @Input() hideAddBtn: any = false;                     // 表单条目为0时，隐藏添加属性按钮
    @Input() maxCount: any;                               // 属性限制最大条数
    @Input() useListGroup: any = true;                    // 属性列表按分组显示（不分组时，用于外部传入属性列表时用）
    @Input() defaultAttrList: any = false;                // 是否自动查询属性备选列表
    @Output() attributeChange = new EventEmitter<any>();  // 回调事件
    @Output() valueChange = new EventEmitter<any>();      // 回调事件，用于检测json是否有变化
    // this.onChange.emit(this.boolFilters);

    @Input() metaAttributeList: Array<any> = [];          // 属性备选列表

    btnFlag = true;

    displayMap: any = {};

    constructor(private crowdCreateService: TagCreateService) {

    }

    ngOnInit() {
        if (this.defaultAttrList) {
            this.crowdCreateService.metaAttributeList().subscribe((response: any) => {
                const dataTmp = [];
                const groupMap = {};
                for (let i = 0; i < response.data.length; i++) {
                    const obj = response.data[i];
                    if (!obj.groupid) {
                        continue;
                    }
                    let groupObj = groupMap[obj.groupid];
                    if (!groupObj) {
                        groupObj = {
                            groupid: obj.groupid,
                            groupName: obj.groupName,
                            list: []
                        };
                        groupMap[obj.groupid] = groupObj;
                        dataTmp.push(groupObj);
                    }

                    groupObj.list.push({
                        'name': obj.displayname,
                        'value': obj.esfieldname,
                        'displayType': obj.displayType,
                    });

                    this.displayMap[obj.esfieldname] = obj.displayType;

                }
                this.metaAttributeList = dataTmp;

                //编辑时加载字典
                for (let i = 0; i < this.boolFilters.length; i++) {
                    let attr = this.boolFilters[i];
                    attr.displayType = this.displayMap[attr.fieldName];

                    if (attr.displayType === 'Tag') {
                        this.onSearch(attr, '');
                    }
                }
            });
        }
    }

    onSearch(attr, searchValue) {
        this.crowdCreateService.queryDict2(attr.fieldName, searchValue).subscribe((resp) => {
            const tmpList = resp['data'];
            const tmpDict = [];
            if (tmpList && tmpList.length > 0) {
                for (let i = 0; i < tmpList.length; i++) {
                    const obj = tmpList[i];
                    tmpDict.push({
                        dicItemKey: obj.id,
                        dicItemValue: obj.dicItemValue
                    });
                }
            }
            attr.prop1ValueList = tmpDict;
        });
    }

    changeOperator(condition) {
        if (condition.operator === 'and') {
            condition.operator = 'or';
        } else {
            condition.operator = 'and';
        }
        this.valueChange.emit();
    }

    changeAttribute(attr) {
        attr.displayType = this.displayMap[attr.fieldName];
        attr.eqType = attr.displayType === 'String' ? 'like' : 'eq';
        attr.value = null;
        attr.value2 = null;
        if (attr.displayType === 'Tag') {
            this.onSearch(attr, '');
        }
        this.valueChange.emit();
        attr['fieldNameCheckFailure'] = false;
    }

    removeItem(list, index) {
        list.splice(index, 1);
        if (this.maxCount && list.length < this.maxCount) {
            this.btnFlag = true;
        }
        this.attributeChange.emit(this.boolFilters);
        this.valueChange.emit();
    }

    addItem(list, type) {
        if (this.maxCount && list.length >= this.maxCount) {
            return;
        }
        let operTmp = this.hideAndOr ? 'and' : '';//人群场景时，默认值为and
        if (list.length > 0) {
            operTmp = 'and';
        }
        if (type === 'prop') {
            list.push({
                operator: operTmp,
                term: true,
                fieldName: null,
                eqType: 'eq',
                value: null,
                value2: null
            });
        }

        if (this.maxCount && list.length >= this.maxCount) {
            this.btnFlag = false;
        }

        this.attributeChange.emit(this.boolFilters);
        this.valueChange.emit();
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes['metaAttributeList'] && changes['metaAttributeList'].firstChange === false) {
            const displayList = changes['metaAttributeList'].currentValue;
            for (let i = 0; i < displayList.length; i++) {
                const obj = displayList[i];
                this.displayMap[obj.value] = obj.displayType;
            }
            for (let i = 0; i < this.boolFilters.length; i++) {
                const attr = this.boolFilters[i];
                attr.displayType = this.displayMap[attr.fieldName];

                if (attr.displayType === 'Tag') {
                    this.onSearch(attr, '');
                }
            }
        }
    }

    logChange(obj?, field?) {
        this.valueChange.emit();
        if (obj && typeof obj === 'object' && field) {
            obj[field + 'CheckFailure'] = false;
        }
    }

    logChangeOperator (obj?, field?) {
        if (obj && obj.displayType === 'Date') {
            obj[field] = null;
        }
    }
}
