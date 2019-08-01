import {Component, Injector, ChangeDetectorRef, OnInit, OnChanges} from '@angular/core';
import {CrowdCreateService} from '../crowd-create.service';
import {DatePipe} from '@angular/common';
import {BaseComponent} from '../../../common/base-component';

@Component({
    selector: 'app-crowd-create-form',
    templateUrl: './crowd-create-form.component.html',
    styleUrls: ['./crowd-create-form.component.less']
})
export class CrowdCreateFormComponent extends BaseComponent implements OnInit, OnChanges {

    parentId: any;
    parentName: any;

    isLoading = false;
    isSaving = false;

    // 人群构建视图json
    crowdVO2: any = {
        crowd: {
            name: '',
            productId: this.productId,
            parentId: null
        },
        referenceCollection: {
            references: []
        },
        conditions: [{
            indice: 'attribute',
            not: 'false',
            operator: '',
            queryList: [{
                operator: '',
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

    behaviorTypeList: Array<any> = [
        {value: '1', name: 'aaa'},
        {value: '2', name: 'bbb'},
        {value: '3', name: 'ccc'}
    ];

    isEdit: any = false;
    crowdId: any;

    // 人群备选列表
    existingCrowdList: Array<any> = [];
    ranges1: any;
    hasChange: any = false;

    // 标签备选列表
    existingTagList: Array<any> = [];

    constructor(private crowdCreateService: CrowdCreateService,
                private injector: Injector,
                public changeDetectorRef: ChangeDetectorRef) {
        super(injector);
        this.initRouterList('新建/编辑用户分群');
    }

    ngOnInit() {
        this.crowdVO2.crowd.productId = this.productId;

        // 判断是否为编辑功能
        const id = this.route.snapshot.params['id'];
        if (id && id !== 'null' && id !== 'undefined') {
            this.isEdit = true;
            this.crowdId = Number(id);
        }

        // 判断是否有父人群id
        const parentId = this.route.snapshot.params['parentId'];
        if (parentId && parentId !== 'null' && parentId !== 'undefined') {
            this.parentId = parentId;
            this.crowdVO2.crowd.parentId = this.parentId;

            this.crowdCreateService.queryCrowd(this.crowdVO2.crowd.parentId).subscribe((response: any) => {
                this.parentName = response.data.crowd.name;
            });
        }


        const now = new Date().getTime();
        const start_7 = now - 86400000 * 7;
        const start_30 = now - 86400000 * 30;
        const end = now - 86400000;
        this.ranges1 = {
            '近七日': [new Date(start_7), new Date(end)],
            '近30日': [new Date(start_30), new Date(end)
            ]
        };

        this.queryEventType();
        this.queryExistingCrowd();
        this.queryExistingTag();
        this.queryCrowdById();
    }

    queryEventType() {
        // 获取事件类型列表
        this.crowdCreateService.queryDict('eventtype').subscribe((resp) => {
            if (resp && resp['data'] && resp['data'].dictionaryItemList) {
                const tmpList = resp['data'].dictionaryItemList;
                const tmpDict = [];
                for (let i = 0; i < tmpList.length; i++) {
                    const obj = tmpList[i];
                    tmpDict.push({
                        value: obj.id,
                        name: obj.dicItemValue
                    });
                }
                this.behaviorTypeList = tmpDict;
            }
        });
    }

    queryCrowdById() {
        if (this.isEdit) {
            this.crowdCreateService.queryCrowd(this.crowdId).subscribe((response: any) => {
                // console.log(JSON.stringify(response.data));
                this.crowdVO2.crowd = response.data.crowd;

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
                this.crowdVO2.conditions = tmpConditions;
                this.crowdVO2.referenceCollection = response.data.referenceCollection;
                // console.log(JSON.stringify(this.crowdVO2));
            });
        }
    }

    queryExistingTag() {
        // 获取现有标签列表
        const param = {
            page: 1,
            rows: 999999,
            productId: this.productId
        }
        this.crowdCreateService.queryExistingTag(param).subscribe((response: any) => {
            const dataTmp = [];
            if (response && response.data && response.data.length > 0) {
                for (let i = 0; i < response.data.length; i++) {
                    const group = response.data[i];
                    const children = group.children;
                    const item = {
                        categoryName: group.categoryName,
                        categoryId: group.categoryId,
                        parentId: group.parentId,
                        children: []
                    };
                    if (children && children.length > 0) {
                        for (let j = 0; j < children.length; j++) {
                            const obj = children[j];
                            item.children.push({
                                'name': obj.name,
                                'value': obj.tagId,
                            });
                        }
                    }
                    dataTmp.push(item);
                }
            }
            if (dataTmp.length > 0) {
                this.existingTagList = dataTmp;
            }
        });
    }

    // 获取现有人群列表
    queryExistingCrowd() {
        this.crowdCreateService.queryExistingCrowd(this.parentId, -1).subscribe((response: any) => {
            const dataTmp = [];
            for (let i = 0; i < response.data.rows.length; i++) {
                const obj = response.data.rows[i];
                if (this.crowdId) {
                    if (parseInt(this.crowdId, 10) !== obj.id) {
                        dataTmp.push({
                            'name': obj.name,
                            'value': obj.id,
                        });
                    }
                } else {
                    dataTmp.push({
                        'name': obj.name,
                        'value': obj.id,
                    });
                }
            }
            if (dataTmp.length > 0) {
                this.existingCrowdList = dataTmp;
            }
        });
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
                        fieldName: 'duration',
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
        //   外层循环，行为块儿
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

                for (const key in boolFilterObj.must.term) {
                    let value = boolFilterObj.must.term[key];
                    if (boolFilterObj.must.attributeType === 'Date') {
                        value = new Date(value);
                    }
                    valueList.push({
                        eqType: key,
                        value: value
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
                    if (boolFilterObj.must.attributeType === 'Date') {
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
        if (clear) {
            // 页面操作入口
            this.hasChange = true;
            query.boolFilters_0[0]['fieldNameCheckFailure'] = false;
            query.boolFilters = [];
            obj.value = null;
            query.metaAttributeList = [];
        }

        // 清空行为类型时，清空行为列表
        if (!obj.fieldName) {
            query.metaBehaviorList = [];
            return;
        }

        // 获取事件列表 // todo
        this.crowdCreateService.getEvent2(obj.fieldName, '').subscribe((response: any) => {
            const dataTmp = [];
            if (response && response.code === 200) {
                for (let i = 0; i < response.data.eventEntity.length; i++) {
                    const obj1 = response.data.eventEntity[i];
                    dataTmp.push({
                        'name': obj1.eventName,
                        'value': obj1.eventId,
                    });
                }
            }
            query.metaBehaviorList = dataTmp;
        });
    }

    // 切换行为
    changeBehavior(behavior, query, clear) {
        if (clear) {
            // 页面操作入口
            this.hasChange = true;
            query.boolFilters_0[0]['valueCheckFailure'] = false;

            query.boolFilters = [];
            query.metaAttributeList = [];
        }

        if (!behavior) {
            query.metaAttributeList = [];
            return;
        }

        this.crowdCreateService.getEventParams(behavior).subscribe((response: any) => {
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

    // 切换and和or
    changeOperator(condition) {
        this.hasChange = true;
        if (condition.operator === 'and') {
            condition.operator = 'or';
        } else {
            condition.operator = 'and';
        }
    }

    // 行为切换发生和未发生
    changeNot(condition) {
        this.hasChange = true;
        if (condition.not === 'true') {
            condition.not = 'false';
        } else {
            condition.not = 'true';
        }
    }

    // 切换块类型
    changeIndice(condition, event) {
        this.hasChange = true;
        if (event === 'attribute' || event === 'crowd' || event === 'customTag') {
            condition.queryList = [{
                operator: '',
                boolFilters: []
            }];
        } else if (event === 'behavior') {
            const now = new Date().getTime();
            const start = now - 86400000 * 7;
            const end = now - 86400000;
            condition.queryList = [];
            condition.eventTimeQuery = {
                operator: 'and',
                boolFilters: [{
                    operator: 'and',
                    term: true,
                    fieldName: 'duration',
                    eqType: 'eq',
                    value: [new Date(start), new Date(end)],
                    value2: null
                }]
            };
        }
    }

    // 移除条目
    removeItem(list, index) {
        this.hasChange = true;
        list.splice(index, 1);
    }

    // 添加条目
    addItem(list, type) {
        this.hasChange = true;
        let operTmp = '';
        if (list.length > 0) {
            operTmp = 'and';
        }
        if (type === 'block') {
            list.push({
                indice: 'attribute',
                not: 'false',
                operator: operTmp,
                queryList: [{
                    operator: '',
                    boolFilters: []
                }],
            });
        } else if (type === 'prop') {
            list.push({
                operator: '', // 属性只有一个场景，创建第一个，所以为空
                term: true,
                fieldName: null,
                eqType: 'eq',
                value: null,
                value2: null
            });
        } else if (type === 'behavior') {
            list.push({
                operator: operTmp,
                boolFilters_0: [
                    {
                        operator: '',
                        term: true,
                        fieldName: null,
                        eqType: 'eq',
                        value: null,
                        value2: null
                    }
                ],
                boolFilters: []
            });
        } else if (type === 'crowd') {
            list.push({
                operator: operTmp,
                term: true,
                fieldName: 'crowd',
                eqType: 'eq',
                value: null,
                value2: null
            });
        } else if (type === 'customTag') {
            list.push({
                operator: operTmp,
                term: true,
                fieldName: 'customTag',
                eqType: 'eq',
                value: null,
                value2: null
            });
        }
    }

    // 转换json用
    mergeQueryList(queryList: any, indice: any) {

        const returnValue = [];
        let eventTypeBoolFilter;
        for (let i = 0; i < queryList.length; i++) {
            const obj = queryList[i];

            const boolFilters = [];

            if (indice === 'behavior') {

                boolFilters.push({
                    'must': {
                        'attributeCode': 'eventid',
                        'term': {
                            'eq': obj.boolFilters_0[0].value
                        }
                    },
                    'operator': obj.boolFilters_0[0].operator
                });

                eventTypeBoolFilter = {
                    'must': {
                        'attributeCode': 'eventType',
                        'term': {
                            'eq': obj.boolFilters_0[0].fieldName
                        }
                    },
                    'operator': 'and'
                };
            }

            for (let j = 0; j < obj.boolFilters.length; j++) {
                const singleFiled = obj.boolFilters[j];

                // 组装 OperatorValue
                const operatorValue = {};

                if (singleFiled.eqType === 'between') {
                    if (singleFiled.displayType === 'Date') {
                        if (singleFiled.value && singleFiled.value.length === 2) {
                            operatorValue['gte'] = this.commonService.toDateStr(singleFiled.value[0]);
                            operatorValue['lte'] = this.commonService.toDateStr(singleFiled.value[1]);
                        }
                    } else {
                        operatorValue['gte'] = singleFiled.value;
                        operatorValue['lte'] = singleFiled.value2;
                    }
                } else if (singleFiled.eqType) {
                    if (singleFiled.displayType === 'Date') {
                        operatorValue[singleFiled.eqType] = this.commonService.toDateStr(singleFiled.value);
                    } else {
                        operatorValue[singleFiled.eqType] = singleFiled.value;
                    }
                }

                // 组装 Qualifier
                const qualifier = {
                    attributeCode: singleFiled.fieldName,
                    attributeType: singleFiled.displayType
                };
                const termValue = singleFiled.term ? 'term' : 'range';
                qualifier[termValue] = operatorValue;

                // 组装 BoolFilter
                boolFilters.push({
                    must: qualifier,
                    operator: singleFiled.operator
                });
            }

            // 组装 Query
            returnValue.push({
                boolFilters: boolFilters,
                operator: obj.operator,
                eventTypeBoolFilter: eventTypeBoolFilter
            });
        }

        return returnValue;
    }

    mergeDate(eventTimeQuery: any) {
        const valueArray = eventTimeQuery.boolFilters[0].value;
        let value1;
        let value2;

        if (valueArray.length === 2) {
            value1 = new DatePipe(valueArray[0]).transform(valueArray[0], 'yyyy-MM-dd', '+0086', 'zh_CN');
            value2 = new DatePipe(valueArray[1]).transform(valueArray[1], 'yyyy-MM-dd', '+0086', 'zh_CN');
        }

        const returnObj = {
            operator: 'and',
            boolFilters: [{
                'must': {
                    'attributeCode': 'starttime_day',
                    'term': {
                        'gte': value1,
                        'lte': value2,
                    }
                },
                'operator': 'and'
            }]
        };

        return returnObj;
    }

    getTagByValue(value: any) {
        let item = {};
        if (value && this.existingTagList && this.existingTagList.length > 0) {
            for (let i = 0; i < this.existingTagList.length; i++) {
                const group = this.existingTagList[i];
                if (group.children && group.children.length > 0) {
                    for (let j = 0; j < group.children.length; j++) {
                        const data = group.children[j];
                        if (parseInt(value, 10) === data.value) {
                            item = data;
                            break;
                        }
                    }
                }
            }
        }
        return item;
    }

    getCrowdByValue(value: any) {
        let item = {};
        if (value && this.existingCrowdList && this.existingCrowdList.length > 0) {
            for (let i = 0; i < this.existingCrowdList.length; i++) {
                const data = this.existingCrowdList[i];
                if (parseInt(value, 10) === data.value) {
                    item = data;
                    break;
                }
            }
        }
        return item;
    }

    _buildReferences(conditions: any[]) {
        const references = [];
        if (conditions && conditions.length > 0) {
            for (let i = 0; i < conditions.length; i++) {
                const condition = conditions[i];
                if (condition.indice === 'crowd' || condition.indice === 'customTag') {
                    const queryList = condition.queryList;
                    if (queryList && queryList.length > 0) {
                        for (let j = 0; j < queryList.length; j++) {
                            const query = queryList[j];
                            const boolFilters = query.boolFilters;
                            if (boolFilters && boolFilters.length > 0) {
                                for (let k = 0; k < boolFilters.length; k++) {
                                    const filter = boolFilters[k];
                                    if (condition.indice === 'crowd') {
                                        const crowd = this.getCrowdByValue(filter.value);
                                        references.push({
                                            refId: filter.value || null,
                                            refName: crowd['name'] || '',
                                            refType: 1 // 标签是2，人群是1
                                        });
                                    } else if (condition.indice === 'customTag') {
                                        const tag = this.getTagByValue(filter.value);
                                        references.push({
                                            refId: filter.value || null,
                                            refName: tag['name'] || '',
                                            refType: 2 // 标签是2，人群是1
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return references;
    }

    // 保存前转换json
    save(ifRestart?) {
        if (!this.check()) {
            return;
        }
        const crowdVO2 = this.crowdVO2;
        // console.log(JSON.stringify(this.crowdVO2));

        const filters = [];
        const conditionMap = {};

        // 组装最外层
        for (let i = 0; i < crowdVO2.conditions.length; i++) {
            const obj = crowdVO2.conditions[i];
            filters.push({
                condition: 'condition_' + (i + 1),
                not: obj.not,
                operator: obj.operator
            });
            conditionMap['condition_' + (i + 1)] = {
                indice: {
                    type: obj.indice
                },
                queryList: this.mergeQueryList(obj.queryList, obj.indice),
                eventTimeQuery: obj.indice === 'behavior' ? this.mergeDate(obj.eventTimeQuery) : null
            };
        }

        if (crowdVO2.crowd.name !== null) {
            crowdVO2.crowd.name = crowdVO2.crowd.name.trim();
        }
        const bigJson = {
            crowd: crowdVO2.crowd,
            referenceCollection: {
                references: this._buildReferences(crowdVO2.conditions)
            },
            definition: {
                filters: filters,
                condition: conditionMap
            }
        };

        // console.log(JSON.stringify(bigJson));

        if (!this.isEdit) {
            this.isSaving = true;
            this.crowdCreateService.saveCrowd(bigJson).subscribe((resObj: any) => {
                if (resObj.code === 200) {
                    this.message.create('success', `保存成功`);
                    this.goBack();
                } else if (resObj.code === 400) {
                    this.message.create('error', resObj.message);
                }
                this.isSaving = false;
            });
        } else {
            this.isSaving = true;
            this.crowdCreateService.updateCrowd(bigJson, this.crowdId).subscribe((resObj: any) => {
                if (resObj.code === 200) {
                    this.message.create('success', `保存成功`);
                    if (ifRestart) {
                        this.restart();
                    } else {
                        this.goBack();
                    }
                } else if (resObj.code === 400) {
                    this.message.create('error', resObj.message);
                }
                this.isSaving = false;
            });
        }
    }

    // 取消
    cancel() {
        this.goBack();
    }

    showConfirm() {
        if (this.hasChange) {
            this.modalService.confirm({
                nzTitle: '<i>提示</i>',
                nzContent: '<b>数据已更改，重新计算前是否需要保存？</b>',
                nzOnOk: () => {
                    this.save(true);
                    this.globals.resetBodyStyle();
                },
                nzOnCancel: () => {
                    this.restart();
                    this.globals.resetBodyStyle();
                }
            });
        } else {
            this.restart();
        }
    }

    restart() {
        this.crowdCreateService.restart(this.crowdId).subscribe((resObj: any) => {
            if (resObj.code === 200) {
                this.message.create('success', `重新计算成功`);
                this.goBack();
            }
        });
    }

    logChange(obj?, field?) {
        this.hasChange = true;
        if (obj && typeof obj === 'object' && field) {
            obj[field + 'CheckFailure'] = false;
        }
    }

    onValueChange() {
        this.hasChange = true;
    }

    onSearch(parentId, event, query) {
        event = this.stringCheck(event);
        this.crowdCreateService.getEvent2(parentId, event).subscribe((response: any) => {
            const dataTmp = [];
            if (response && response.code === 200) {
                for (let i = 0; i < response.data.eventEntity.length; i++) {
                    const obj = response.data.eventEntity[i];
                    dataTmp.push({
                        'name': obj.eventName,
                        'value': obj.eventId,
                    });
                }
            }
            query.metaBehaviorList = dataTmp;
        });
    }

     stringCheck(s) {
         let str = s.replace(/%/g, "%25").replace(/\+/g,"%2B").replace(/\^/g,"%5E");// % + \s 
        str = str.replace(/-/g, "%2D").replace(/\*/g, "%2A").replace(/#/g,"%23");// - * / 
        return str;
    }

    check() {
        let failure = false;
        let noItem = false;
        let tooLong = false;
        let invalidChart = false;

        if (this.crowdVO2.crowd.name) {
            this.crowdVO2.crowd.name = this.crowdVO2.crowd.name.trim();
        }

        if (!this.crowdVO2.crowd.name) {
            this.crowdVO2.crowd.nameCheckFailure = true;
            failure = true;
        }

        if (this.crowdVO2.crowd.name && this.crowdVO2.crowd.name.length > 52) {
            this.crowdVO2.crowd.nameCheckFailure = true;
            tooLong = true;
        }

        const reg = /^[A-Za-z0-9\u4e00-\u9fa5\-_]+$/;
        if (this.crowdVO2.crowd.name && !reg.test(this.crowdVO2.crowd.name)) {
            this.crowdVO2.crowd.nameCheckFailure = true;
            invalidChart = true;
        }

        // 检测是否条件个数为0
        for (let i = 0; i < this.crowdVO2.conditions.length; i++) {
            const condition = this.crowdVO2.conditions[i];
            if (condition.indice === 'behavior' && condition.queryList.length === 0) {
                noItem = true;
            } else if (condition.indice === 'attribute' || condition.indice === 'crowd' || condition.indice === 'customTag') {
                if (condition.queryList[0].boolFilters.length === 0) {
                    noItem = true;
                }
            }
        }
        for (let i = 0; i < this.crowdVO2.conditions.length; i++) {
            const condition = this.crowdVO2.conditions[i];
            for (let j = 0; j < condition.queryList.length; j++) {
                const query = condition.queryList[j];
                // 检测行为选择项
                if (condition.indice === 'behavior') {
                    const boolFilter = query.boolFilters_0[0];
                    if (!boolFilter.fieldName) {
                        boolFilter.fieldNameCheckFailure = true;
                        failure = true;
                    }
                    if (boolFilter.value === null) {
                        boolFilter.valueCheckFailure = true;
                        failure = true;
                    }
                }
                // 检测所有属性检测项
                for (let k = 0; k < query.boolFilters.length; k++) {
                    const boolFilter = query.boolFilters[k];
                    if (!boolFilter.fieldName) {
                        boolFilter.fieldNameCheckFailure = true;
                        failure = true;
                    }
                    if (
                        boolFilter.displayType === 'Tag' &&
                       ( boolFilter.value === null || (boolFilter.value  && boolFilter.value.length === 0))
                        
                    ) {
                        boolFilter.valueCheckFailure = true;
                        failure = true;
                    } else if (
                        boolFilter.displayType === 'Date' &&
                        !boolFilter.value
                    ) {
                        if (boolFilter.eqType === 'between') {
                            if (!boolFilter.value || (boolFilter.value && boolFilter.value.length === 0)) {
                                boolFilter.valueCheckFailure = true;
                                failure = true;
                            }
                        } else {
                            boolFilter.valueCheckFailure = true;
                            failure = true;
                        }
                    } else if (
                        ( boolFilter.displayType === 'integer' ||
                            boolFilter.displayType === 'Integer' ||
                            boolFilter.displayType === 'Double' ||
                            boolFilter.displayType === 'String' ||
                            boolFilter.displayType === 'Long')
                    ) {
                        if (
                            boolFilter.eqType === 'between' &&
                            (boolFilter.value2 === undefined || boolFilter.value2 === '' || boolFilter.value2 === null)
                        ) {
                            boolFilter.value2CheckFailure = true;
                            failure = true;
                        } 
                        if (boolFilter.value === undefined || boolFilter.value === '' || boolFilter.value === null){
                            boolFilter.valueCheckFailure = true;
                            failure = true;
                        }
                    }
                }
            }
        }

        if (failure) {
            this.message.create('error', '请为空白项输入值');
        }
        if (noItem) {
            this.message.create('error', '请添加条件项');
        }
        if (tooLong) {
            this.message.create('error', '人群名称长度不能大于52个字符');
        }
        if (invalidChart) {
            this.message.create('error', '人群名称含有特殊字符');
        }
        return !failure && !noItem && !tooLong && !invalidChart;
    }
}
