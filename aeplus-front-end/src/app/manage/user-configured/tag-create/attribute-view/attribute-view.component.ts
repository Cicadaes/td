import {Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import {TagCreateService} from '../tag-create.service';

@Component({
    selector: 'app-attribute-view',
    templateUrl: './attribute-view.component.html',
    styleUrls: ['./attribute-view.component.less']
})
export class AttributeViewComponent implements OnInit, OnChanges {

    @Input() boolFilters: Array<any>;                     // 表单条目（必填）
    @Input() hideAndOr: any = false;                      // 隐藏并且或者（人群构建行为属性使用）
    @Input() hideAddBtn: any = false;                     // 表单条目为0时，隐藏添加属性按钮
    @Input() maxCount: any;                               // 属性限制最大条数
    @Input() useListGroup: any = true;                    // 属性列表按分组显示（不分组时，用于外部传入属性列表时用）
    @Input() defaultAttrList: any = false;                // 是否自动查询属性备选列表
    @Output() attributeChange = new EventEmitter<any>();  // 回调事件
    // this.onChange.emit(this.boolFilters);

    @Input() metaAttributeList: Array<any> = [];          // 属性备选列表
    metaAttributeMap: any = {};

    displayMap: any = {};

    eqTypeNumberMap: any = {
        eq: '等于',
        gt: '大于',
        lt: '小于',
        gte: '大于等于',
        lte: '小于等于',
        between: '在区间',
    };

    eqTypeDateMap: any = {
        eq: '等于',
        gt: '晚于',
        lt: '早于',
        between: '在区间'
    };

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
                    this.metaAttributeMap[obj.esfieldname] = obj.displayname;
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
            const prop1ValueMap = {};
            for (let i = 0; i < tmpList.length; i++) {
                const obj = tmpList[i];
                tmpDict.push({
                    dicItemKey: obj.id,
                    dicItemValue: obj.dicItemValue
                });
                prop1ValueMap[obj.id] = obj.dicItemValue;
            }
            attr.prop1ValueList = tmpDict;
            attr.prop1ValueMap = prop1ValueMap;
        });
    }

    changeOperator(condition) {
        if (condition.operator === 'and') {
            condition.operator = 'or';
        } else {
            condition.operator = 'and';
        }

    }

    changeAttribute(attr) {
        attr.displayType = this.displayMap[attr.fieldName];
        attr.eqType = attr.displayType === 'String' ? 'like' : 'eq';
        attr.value = null;
        attr.value2 = null;
        if (attr.displayType === 'Tag') {
            this.onSearch(attr, '');
        }
    }

    removeItem(list, index) {
        list.splice(index, 1);
        this.attributeChange.emit(this.boolFilters);
    }

    addItem(list, type) {
        if (this.maxCount && list.length >= this.maxCount) {
            return;
        }
        if (type === 'prop') {
            list.push({
                operator: 'and',
                term: true,
                fieldName: null,
                eqType: 'eq',
                value: null,
                value2: null
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes['metaAttributeList'] && changes['metaAttributeList'].firstChange === false) {
            let displayList = changes['metaAttributeList'].currentValue;
            for (let i = 0; i < displayList.length; i++) {
                let obj = displayList[i];
                this.displayMap[obj.value] = obj.displayType;
                this.metaAttributeMap[obj.value] = obj.name;
            }
            for (let i = 0; i < this.boolFilters.length; i++) {
                let attr = this.boolFilters[i];
                attr.displayType = this.displayMap[attr.fieldName];

                if (attr.displayType === 'Tag') {
                    this.onSearch(attr, '');
                }
            }
        }
    }

    mapArrayValue(attr) {
        let retValue = '';
        if (attr.value && attr.value.length > 0 && attr.prop1ValueMap) {
            for (let i = 0; i < attr.value.length; i++) {
                let obj = attr.value[i];
                retValue += attr.prop1ValueMap[obj] || '无'
                if (i < attr.value.length - 1) {
                    retValue += ', ';
                }
            }
        }
        return retValue
    }
}
