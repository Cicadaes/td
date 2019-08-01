import {Component, Injector, OnInit, OnChanges} from '@angular/core';
import {TagCreateService} from '../tag-create.service';
import {BaseComponent} from '../../../../common/base-component';

@Component({
    selector: 'app-tag-create-view',
    templateUrl: './tag-create-view.component.html',
    styleUrls: ['./tag-create-view.component.less']
})
export class TagCreateViewComponent extends BaseComponent implements OnInit, OnChanges {

    parentId: any;
    parentName: any;

    // 标签构建视图json
    customTagVO2: any = {
        customTag: {
            name: '',
            productId: this.productId,
            parentId: null,
        },
        schedule: {
            lifecycle: null,
            scheduleExpressionObj: {
                loop: 'day',
                dayOfWeek: '1',
                dayOfMonth: '1'
            },
            calcEndTime: null,
            calcStartTime: null
        },
        conditions: [{
            indice: 'attribute',
            not: 'false',
            operator: 'and',
            queryList: [{
                operator: 'and',
                boolFilters: []
            }],
        }]
    };

    // 行为备选列表，废弃
    metaBehaviorList: Array<any> = [
        {value: '1', name: 'SDK版本', displayType: 'Tag'},
        {value: '2', name: '产品', displayType: 'String'},
        {value: '3', name: '平台', displayType: 'Integer'},
        {value: '4', name: '渠道', displayType: 'Date'}
    ];

    metaBehaviorTypeMap: any = {};
    metaBehaviorMap: any = {};

    customTagId: any;

    // 标签备选列表
    existingTagList: Array<any> = [];

    existingTagMap: any = {};
    _calculateTime: any;
    _calculateLoop: any = {};
    _calculateWeek: any = {};
    _calculateMonth: any = {};
    _calculateDisplay: string;
    loopList: Array<any> = [
        {value: 'day', label: '每天'},
        {value: 'week', label: '每周'},
        {value: 'month', label: '每月'}
    ];

    weekList: Array<any> = [
        {value: '1', label: '星期一'},
        {value: '2', label: '星期二'},
        {value: '3', label: '星期三'},
        {value: '4', label: '星期四'},
        {value: '5', label: '星期五'},
        {value: '6', label: '星期六'},
        {value: '7', label: '星期日'}
    ];

    monthList: Array<any> = [
        {value: '1', label: '1号'},
        {value: '2', label: '2号'},
        {value: '3', label: '3号'},
        {value: '4', label: '4号'},
        {value: '5', label: '5号'},
        {value: '6', label: '6号'},
        {value: '7', label: '7号'},
        {value: '8', label: '8号'},
        {value: '9', label: '9号'},
        {value: '10', label: '10号'},
        {value: '11', label: '11号'},
        {value: '12', label: '12号'},
        {value: '13', label: '13号'},
        {value: '14', label: '14号'},
        {value: '15', label: '15号'},
        {value: '16', label: '16号'},
        {value: '17', label: '17号'},
        {value: '18', label: '18号'},
        {value: '19', label: '19号'},
        {value: '20', label: '20号'},
        {value: '21', label: '22号'},
        {value: '23', label: '23号'},
        {value: '24', label: '24号'},
        {value: '25', label: '25号'},
        {value: '26', label: '26号'},
        {value: '27', label: '27号'},
        {value: '28', label: '28号'},
        {value: '29', label: '29号'},
        {value: '30', label: '30号'},
        {value: '31', label: '31号'}
    ];

    constructor(private tagCreateService: TagCreateService,
                private injector: Injector) {
        super(injector);
        this.initRouterList('查看用户分群');
    }

    ngOnInit() {

        const _that = this;

        this.customTagVO2.customTag.productId = this.productId;

        // 判断是否有标签id
        const id = this.route.snapshot.params['id'];
        if (id && id !== 'null' && id !== 'undefined') {
            this.customTagId = id;
        }

        this.queryEventType();
        this.queryExistingTag();
        this.queryTagById();
    }

    _getObjectByValue(value: any, list: any[]) {
        let obj = {};
        if (value && list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (value === list[i].value) {
                    obj = list[i];
                    break;
                }
            }
        }
        return obj;
    }

    queryEventType() {
        // 获取事件类型列表
        this.tagCreateService.queryDict('eventtype').subscribe((resp) => {
            if (resp && resp['data'] && resp['data'].dictionaryItemList) {
                const tmpList = resp['data'].dictionaryItemList;
                for (let i = 0; i < tmpList.length; i++) {
                    const obj = tmpList[i];
                    this.metaBehaviorTypeMap[obj.id] = obj.dicItemValue;
                }
            }
        });
    }

    queryExistingTag() {
        // 获取现有标签列表
        const param = {
            page: 1,
            rows: 999999,
            productId: this.productId
        };
        this.tagCreateService.queryExistingTag(param).subscribe((response: any) => {
            const dataTmp = [];
            if (response && response.data && response.data.length > 0) {
                for (let i = 0; i < response.data.length; i++) {
                    const group = response.data[i];
                    const children = group.children;
                    if (children && children.length > 0) {
                        for (let j = 0; j < children.length; j++) {
                            const obj = children[j];
                            this.existingTagMap[obj.tagId] = obj.name;
                        }
                    }
                }
            }
            if (dataTmp.length > 0) {
                this.existingTagList = dataTmp;
            }
        });
    }

    queryTagById() {
        if (this.customTagId) {
            this.tagCreateService.queryTag(this.customTagId).subscribe((response: any) => {
               // console.log(JSON.stringify(response.data));
                this.customTagVO2.customTag = response.data.customTag;
                this.customTagVO2.schedule = response.data.schedule;

                const definition = response.data.definition;
                const tmpConditions = [];

                for (let i = 0; i < definition.filters.length; i++) {
                    const filterObj = definition.filters[i];
                    const condiObj = definition.condition[filterObj.condition];
                    const condition = {
                        indice: condiObj.indice.type,
                        not: filterObj.not,
                        operator: filterObj.operator,
                        queryList: this.parseQueryList(condiObj.queryList, condiObj.indice.type),
                        eventTimeQuery: condiObj.indice.type === 'behavior' ? this.parseDate(condiObj.eventTimeQuery) : null
                    };
                    tmpConditions.push(condition);
                }
                this.customTagVO2.conditions = tmpConditions;
              //  console.log(JSON.stringify(this.customTagVO2));
                if (this.customTagVO2.schedule.scheduleExpressionObj) {
                    const scheduleExpressionObj = this.customTagVO2.schedule.scheduleExpressionObj;
                    this._calculateLoop = this._getObjectByValue(scheduleExpressionObj.loop, this.loopList);
                    this._calculateWeek = this._getObjectByValue(scheduleExpressionObj.dayOfWeek, this.weekList);
                    this._calculateMonth = this._getObjectByValue(scheduleExpressionObj.dayOfMonth, this.monthList);
                    this.queryCalcParam();
                }
            });
        }
    }

    parseDate(eventTimeQuery) {
        let returnObj;
        if (eventTimeQuery) {
            returnObj = {
                operator: eventTimeQuery.operator,
                boolFilters: [
                    {
                        operator: eventTimeQuery.boolFilters[0].operator,
                        term: true,
                        fieldName: 'event',
                        eqType: 'eq',
                        value: [new Date(eventTimeQuery.boolFilters[0].must.term.gte),
                            new Date(eventTimeQuery.boolFilters[0].must.term.lte)],
                        value2: null,
                    }
                ]
            };
        } else {
            returnObj = {
                'operator': 'and',
                'boolFilters': [
                    {
                        'operator': 'and',
                        'term': true,
                        'fieldName': 'duration',
                        'eqType': 'eq',
                        'value': [
                            '2018-05-01T08:16:01.895Z',
                            '2018-05-28T08:16:01.895Z'
                        ],
                        'value2': null
                    }
                ]
            };
        }
        return returnObj;
    }

    parseQueryList(queryList: any, indice: any) {

        const tmpList = [];
        let boolFilters_0;
        // 外层循环，行为块儿
        for (let i = 0; i < queryList.length; i++) {
            const obj = queryList[i];
            let j = 0;
            if (indice === 'behavior') {
                j = 1;

                let fieldNameTmp = '9101';
                if (obj.eventTypeBoolFilter) {
                    fieldNameTmp = obj.eventTypeBoolFilter.must.term.eq;
                }

                boolFilters_0 = [{
                    operator: obj.boolFilters[0].operator,
                    term: true,
                    fieldName: fieldNameTmp,
                    eqType: 'eq',
                    value: obj.boolFilters[0].must.term.eq,
                    value2: null
                }];

            }

            const boolFilterList = [];
            for (; j < obj.boolFilters.length; j++) {
                const boolFilterObj = obj.boolFilters[j];

                const valueList = [];

                for (let key in boolFilterObj.must.term) {
                    valueList.push({
                        eqType: key,
                        value: boolFilterObj.must.term[key]
                    });
                }

                const valueObj = {
                    operator: boolFilterObj.operator,
                    term: true,
                    fieldName: boolFilterObj.must.attributeCode,
                    eqType: valueList.length > 0 ? valueList[0].eqType : 'eq',
                    value: valueList.length > 0 ? valueList[0].value : null,
                    value2: null
                };

                if (valueList.length === 2) {
                    valueObj.eqType = 'between';
                    if ((typeof valueList[0].value === 'string') && valueList[0].value.indexOf('-') !== -1) {
                        // 日期格式
                        valueObj.value = [valueList[0].value, valueList[1].value];
                    } else {
                        // 数值格式
                        valueObj.value2 = valueList[1].value;
                    }
                }

                boolFilterList.push(valueObj);
            }

            const queryObj = {
                operator: obj.operator,
                boolFilters_0: boolFilters_0,
                boolFilters: boolFilterList,
            };

            // 行为，初始化属性下拉列表
            if (indice === 'behavior') {
                let value = '9101';
                if (obj.eventTypeBoolFilter) {
                    value = obj.eventTypeBoolFilter.must.term.eq;
                }
                if (value === 'event') {
                    value = '9101'; // todo del
                }
                this.changeBehaviorType({fieldName: value}, queryObj, false);
                this.changeBehavior(obj.boolFilters[0].must.term.eq, queryObj, false);
            }

            tmpList.push(queryObj);
        }

        return tmpList;

    }

    // 切换事件类型
    changeBehaviorType(obj, query, clear) {

        // 获取事件列表 // todo
        this.tagCreateService.getEvent2(obj.fieldName, '').subscribe((response: any) => {
            if (response && response.code === 200) {
                const dataTmp = [];
                for (let i = 0; i < response.data.eventEntity.length; i++) {
                    const obj1 = response.data.eventEntity[i];
                    dataTmp.push({
                        'name': obj1.eventName,
                        'value': obj1.eventId,
                    });
                    this.metaBehaviorMap[obj1.eventId] = obj1.eventName;
                }
            }
        });
    }

    // 切换行为
    changeBehavior(behavior, query, clear) {

        if (clear) {
            query.boolFilters = [];
        }

        this.tagCreateService.getEventParams(behavior).subscribe((response: any) => {
            const dataTmp = [];
            for (let i = 0; i < response.data.params.length; i++) {
                const obj = response.data.params[i];
                dataTmp.push({
                    'name': obj.attrName,
                    'value': obj.esFieldName,
                    'displayType': obj.attrType,
                });
            }

            query.metaAttributeList = dataTmp;

        });
    }

    _buildCalculateDisplay() {
        this._calculateDisplay = '在 ';
        this._calculateDisplay += this.globals.dateFormat(this.customTagVO2.schedule.calcStartTime, '');
        this._calculateDisplay += ' ~ ';
        this._calculateDisplay += this.globals.dateFormat(this.customTagVO2.schedule.calcEndTime, '');
        this._calculateDisplay += ' 内 ';
        this._calculateDisplay += this._calculateLoop.label;
        if (this._calculateLoop.value === 'week') {
            this._calculateDisplay += this._calculateWeek.label;
        } else if (this._calculateLoop.value === 'month') {
            this._calculateDisplay += this._calculateMonth.label;
        }
        this._calculateDisplay += ' ' + this._calculateTime;
        this._calculateDisplay += '更新 ';
    }
    queryCalcParam() {
        this.tagCreateService.queryCalcParam().subscribe((response: any) => {
            if (response && response.code === 200) {
                this._calculateTime = response.data;
                this._buildCalculateDisplay();
            }
        });
    }

    // 取消
    cancel() {
        this.goBack();
    }

}
