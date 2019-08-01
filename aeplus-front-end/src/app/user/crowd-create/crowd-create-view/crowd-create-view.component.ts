import {Component, Injector, OnInit, OnChanges} from '@angular/core';
import {CrowdCreateService} from '../crowd-create.service';
import {BaseComponent} from '../../../common/base-component';

@Component({
    selector: 'app-crowd-create-view',
    templateUrl: './crowd-create-view.component.html',
    styleUrls: ['./crowd-create-view.component.less']
})
export class CrowdCreateViewComponent extends BaseComponent implements OnInit, OnChanges {

    parentId: any;
    parentName: any;

    // 人群构建视图json
    crowdVO2: any = {
        crowd: {
            name: '',
            productId: this.productId,
            parentId: null
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

    crowdId: any;

    // 人群备选列表
    existingCrowdList: Array<any> = [];

    existingCrowdMap: any = {};
    existingTagMap: any = {};

    constructor(private crowdCreateService: CrowdCreateService,
                private injector: Injector) {
        super(injector);
        this.initRouterList('查看用户分群');
    }

    ngOnInit() {

        const _that = this;

        this.crowdVO2.crowd.productId = this.productId;

        // 判断是否有人群id
        const id = this.route.snapshot.params['id'];
        if (id && id !== 'null' && id !== 'undefined') {
            this.crowdId = Number(id);
        }

        // 判断是否有父人群id
        const parentId = this.route.snapshot.params['parentId'];
        if (parentId && parentId !== 'null' && parentId !== 'undefined') {
            this.parentId = parentId;
            this.crowdVO2.crowd.parentId = this.parentId;

            this.crowdCreateService.queryCrowd(this.crowdVO2.crowd.parentId).subscribe((response: any) => {
                _that.parentName = response.data.crowd.name;
            });
        }

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
                for (let i = 0; i < tmpList.length; i++) {
                    const obj = tmpList[i];
                    this.metaBehaviorTypeMap[obj.id] = obj.dicItemValue;
                }
            }
        });
    }

    queryCrowdById() {
        if (true) {
            this.crowdCreateService.queryCrowd(this.crowdId).subscribe((response: any) => {
                console.log(JSON.stringify(response.data));
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
                //console.log(JSON.stringify(this.crowdVO2));
            });
        }
    }

    // 获取现有标签列表
    queryExistingTag() {
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
                    if (children && children.length > 0) {
                        for (let j = 0; j < children.length; j++) {
                            const obj = children[j];
                            this.existingTagMap[obj.tagId] = obj.name;
                        }
                    }
                }
            }
        });
    }

    // 获取现有人群列表
    queryExistingCrowd() {
        this.crowdCreateService.queryExistingCrowd(this.parentId, -1).subscribe((response: any) => {
            const dataTmp = [];
            for (let i = 0; i < response.data.rows.length; i++) {
                const obj = response.data.rows[i];
                dataTmp.push({
                    'name': obj.eventName,
                    'value': obj.eventId,
                });

                this.existingCrowdMap[obj.id] = obj.name;
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

                for (const key in boolFilterObj.must.term) {
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
        this.crowdCreateService.getEvent2(obj.fieldName, '').subscribe((response: any) => {
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

    // 取消
    cancel() {
        this.goBack();
    }

}
