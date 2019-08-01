import {
  Component,
  Injector,
  ChangeDetectorRef,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  Input,
  SimpleChanges
} from '@angular/core';
import { EventFilterService } from './event-filter.service';
import { BaseComponent } from '../../../../../common/base-component';
import { format } from 'date-fns';

@Component({
  selector: 'app-event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.less']
})
export class EventFilterComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() isCrowd: any;
  @Input() crowdData: any;
  @Input() isCheck: any;
  @Input() hasContrast: any;
  @Input() startDate: any;
  @Input() endDate: any;
  @Output() onFilter = new EventEmitter<any>();
  _isCrowd: boolean;
  _isCheck: boolean;
  parentId: any;
  isLoading = false;
  // 人群构建视图json
  crowdVO2: any = {
    referenceCollection: {
      references: []
    },
    conditions: [
      {
        indice: 'attribute',
        not: 'false',
        operator: 'and',
        queryList: [
          {
            operator: 'and',
            boolFilters: [
              {
                operator: '',
                term: true,
                fieldName: null,
                eqType: 'eq',
                value: null,
                value2: null
              }
            ]
          }
        ],
        eventTimeQuery: {
          operator: 'and',
          boolFilters: [
            {
              operator: 'and',
              term: true,
              fieldName: 'duration',
              eqType: 'eq',
              value: ['', ''],
              value2: null
            }
          ]
        }
      }
    ]
  };

  behaviorTypeList: Array<any> = [];

  isEdit: any = false;
  crowdId: any;

  // 人群备选列表
  existingCrowdList: Array<any> = [];
  ranges1: any;
  hasChange: any = false;

  // 标签备选列表
  existingTagList: Array<any> = [];
  _crowdData: any;

  operator: any = 'and';
  operatorTranslateY: any = '8px';
  verLineHeight: any = '70px';

  constructor(
    private eventFilterService: EventFilterService,
    private injector: Injector,
    public changeDetectorRef: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnInit() {
    // 判断是否有父人群id
    const parentId = this.route.snapshot.params['parentId'];
    if (parentId && parentId !== 'null' && parentId !== 'undefined') {
      this.parentId = parentId;
    }

    this.queryEventType();
    this.queryExistingCrowd();
    this.queryExistingTag();
  }

  queryEventType() {
    // 获取事件类型列表
    this.eventFilterService.queryDict('eventtype').subscribe(resp => {
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

  initCrowdData(crowdData: any) {
    if (crowdData) {
      this.crowdVO2 = crowdData;

      const definition = crowdData;
      const tmpConditions = [];
      for (let i = 0; i < definition.filters.length; i++) {
        const filterObj = definition.filters[i];
        const condiObj = definition.condition[filterObj.condition];
        const condition = {
          indice: condiObj.indice.type,
          not: filterObj.not,
          operator: filterObj.operator,
          queryList: this.parseQueryList(condiObj.queryList, condiObj.indice.type),
          eventTimeQuery: this.parseDate(condiObj.eventTimeQuery)
        };
        tmpConditions.push(condition);
      }
      this.crowdVO2.conditions = tmpConditions;
      this.crowdVO2.referenceCollection = crowdData.referenceCollection;
      this.onfilterBack(crowdData);
    }
  }

  queryExistingTag() {
    // 获取现有标签列表
    const param = {
      page: 1,
      rows: 999999,
      productId: this.productId
    };
    this.eventFilterService.queryExistingTag(param).subscribe((response: any) => {
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
                name: obj.name,
                value: obj.tagId
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
    const param = {
      productId: this.productId,
      page: 1,
      rows: 9999,
      name: '',
      crowdIds: ''
    };
    this.eventFilterService.queryExistingCrowd(param).subscribe((response: any) => {
      const dataTmp = [];
      for (let i = 0; i < response.list[0].length; i++) {
        const obj = response.list[0][i];
        if (this.crowdId) {
          if (parseInt(this.crowdId, 10) !== obj.id) {
            dataTmp.push({
              name: obj.name,
              value: obj.id
            });
          }
        } else {
          dataTmp.push({
            name: obj.name,
            value: obj.id
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
            value: [
              new Date(eventTimeQuery.boolFilters[0].must.term.gte),
              new Date(eventTimeQuery.boolFilters[0].must.term.lte)
            ],
            value2: null
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

        boolFilters_0 = [
          {
            operator: obj.boolFilters[0].operator,
            term: true,
            fieldName: fieldNameTmp,
            eqType: 'eq',
            value: obj.boolFilters[0].must.term.eq,
            value2: null
          }
        ];
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
          displayType: boolFilterObj.must.attributeType, //输入框类型
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
        metaBehaviorList: []
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
        this.changeBehaviorType({ fieldName: value }, queryObj, false);
        // this.changeBehavior(obj.boolFilters[0].must.term.eq, queryObj, false);
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
      this.onCheck(false);
    }

    // 清空行为类型时，清空行为列表
    if (!obj.fieldName) {
      query.metaBehaviorList = [];
      return;
    }

    // 获取事件列表 // todo
    this.eventFilterService.getEvent2(obj.fieldName, '').subscribe((response: any) => {
      const dataTmp = [];
      if (response && response.code === 200) {
        for (let i = 0; i < response.data.eventEntity.length; i++) {
          const obj1 = response.data.eventEntity[i];
          dataTmp.push({
            name: obj1.eventName,
            value: obj1.eventId
          });
        }
      }
      query.metaBehaviorList = dataTmp;
      if (!query.boolFilters_0[0].value) {
        query.boolFilters_0[0].value = dataTmp[0] ? dataTmp[0].value : '';
      }
      this.onCheck(false);
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
      this.onCheck(false);
    }

    if (!behavior) {
      query.metaAttributeList = [];
      return;
    }

    this.eventFilterService.getEventParams(behavior).subscribe((response: any) => {
      const dataTmp = [];
      for (let i = 0; i < response.data.params.length; i++) {
        const obj = response.data.params[i];
        dataTmp.push({
          name: obj.attrName,
          value: obj.esFieldName,
          displayType: obj.attrType
        });
      }

      query.metaAttributeList = dataTmp;
    });
  }

  // 切换and和or
  changeOperator() {
    this.hasChange = true;
    for (let i = 0; i < this.crowdVO2.conditions.length; i++) {
      if (this.crowdVO2.conditions[i].operator === 'and') {
        this.crowdVO2.conditions[i].operator = 'or';
        this.crowdVO2.conditions[i].queryList[0].operator = 'or';
      } else {
        this.crowdVO2.conditions[i].operator = 'and';
        this.crowdVO2.conditions[i].queryList[0].operator = 'and';
      }
    }

    this.onCheck(false);
  }

  // 行为切换发生和未发生
  changeNot(condition) {
    this.hasChange = true;
    if (condition.not === 'true') {
      condition.not = 'false';
    } else {
      condition.not = 'true';
    }
    this.onCheck(false);
  }

  // 切换块类型
  changeIndice(condition: any, event: any) {
    this.hasChange = true;
    if (event === 'attribute' || event === 'crowd' || event === 'customTag') {
      condition.queryList = [
        {
          operator: this.crowdVO2.conditions[0].operator,
          boolFilters: []
        }
      ];
      condition['eventTimeQuery'] = {
        operator: 'and',
        boolFilters: [
          {
            operator: 'and',
            term: true,
            fieldName: 'duration',
            eqType: 'eq',
            value: ['', ''],
            value2: null
          }
        ]
      };
      this.addItem(condition.queryList[0].boolFilters, event);
    } else if (event === 'behavior') {
      condition.queryList = [
        {
          operator: this.crowdVO2.conditions[0].operator,
          boolFilters_0: [
            {
              operator: '',
              term: true,
              fieldName: this.behaviorTypeList[0] ? String(this.behaviorTypeList[0].value) : '',
              fieldNameCheckFailure: false,
              eqType: 'eq',
              value: null,
              value2: null
            }
          ],
          boolFilters: []
        }
      ];
      condition.eventTimeQuery = {
        operator: 'and',
        boolFilters: [
          {
            operator: 'and',
            term: true,
            fieldName: 'duration',
            eqType: 'eq',
            value: ['', ''],
            value2: null
          }
        ]
      };
      this.changeBehaviorType(condition.queryList[0].boolFilters_0[0], condition.queryList[0], true);
    }
    this.onCheck(false);
    this.operatorMove();
  }

  // 移除条目
  removeItem(list: any, index: any) {
    this.hasChange = true;
    list.splice(index, 1);
    this.onCheck(false);
    this.operatorMove();
  }

  // 添加条目
  addItem(list: any, type: any) {
    this.hasChange = true;
    let operTmp = this.crowdVO2.conditions[0].operator;
    if (list.length > 0) {
      operTmp = list.length > 1 ? list[0].operator : 'and';
    }
    if (type === 'block') {
      list.push({
        indice: 'attribute',
        not: 'false',
        operator: this.crowdVO2.conditions[0].operator,
        queryList: [
          {
            operator: operTmp,
            boolFilters: [
              {
                operator: '',
                term: true,
                fieldName: null,
                eqType: 'eq',
                value: null,
                value2: null
              }
            ]
          }
        ],
        eventTimeQuery: {
          operator: 'and',
          boolFilters: [
            {
              operator: 'and',
              term: true,
              fieldName: 'duration',
              eqType: 'eq',
              value: ['', ''],
              value2: null
            }
          ]
        }
      });
    } else if (type === 'attribute') {
      list.push({
        operator: '',
        term: true,
        fieldName: null,
        eqType: 'eq',
        value: null,
        value2: null
      });
    } else if (type === 'behavior') {
      list.push({
        operator: '',
        term: true,
        fieldName: null,
        eqType: 'eq',
        value: null,
        value2: null
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
    this.operatorMove();
    this.onCheck(false);
  }

  // 移动operator的位置
  operatorMove() {
    let translateY = 8;
    let lineHeight = 50;
    if (this.crowdVO2.conditions.length > 1) {
      for (let i = 0; i < this.crowdVO2.conditions.length - 1; i++) {
        if (this.crowdVO2.conditions[i].indice == 'behavior') {
          translateY += 40;
          translateY += 24 * this.crowdVO2.conditions[i].queryList[0].boolFilters.length;
        } else {
          translateY += 25;
        }
      }
    }
    lineHeight += translateY;
    this.operatorTranslateY = `${translateY}px`;
    this.verLineHeight = `${lineHeight}px`;
  }

  attributeChange(boolFilters: any) {
    this.operatorMove();
  }

  // 转换json用
  mergeQueryList(objQuery: any, indice: any) {
    const returnValue = [];
    let eventTypeBoolFilter: any;
    const queryList = objQuery.queryList;
    for (let i = 0; i < queryList.length; i++) {
      const obj = queryList[i];

      const boolFilters = [];

      if (indice === 'behavior') {
        boolFilters.push({
          must: {
            attributeCode: 'eventid',
            term: {
              eq: obj.boolFilters_0[0].value
            }
          },
          operator: 'and'
        });

        eventTypeBoolFilter = {
          must: {
            attributeCode: 'eventType',
            term: {
              eq: obj.boolFilters_0[0].fieldName
            }
          },
          operator: obj.operator
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
          operator: obj.operator
        });
      }

      // 组装 Query
      returnValue.push({
        boolFilters: boolFilters,
        operator: objQuery.operator,
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
      value1 = format(this.startDate, 'YYYY-MM-DD');
      value2 = format(this.endDate, 'YYYY-MM-DD');
    }

    const returnObj = {
      operator: 'and',
      boolFilters: [
        {
          must: {
            attributeCode: 'starttime_day',
            term: {
              gte: value1,
              lte: value2
            }
          },
          operator: 'and'
        }
      ]
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

  _getDefinition() {
    const crowdVO2 = this.crowdVO2;
    const filters = [];
    const conditionMap = {};
    // 组装最外层
    if (crowdVO2 && crowdVO2.conditions && crowdVO2.conditions.length > 0) {
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
          queryList: this.mergeQueryList(obj, obj.indice),
          eventTimeQuery: this.mergeDate(obj.eventTimeQuery)
        };
      }
    }
    const definition = {
      filters: filters,
      condition: conditionMap
    };
    return definition;
  }

  onfilterBack(crowdFilter: any) {
    const definition = this._getDefinition();
    crowdFilter = crowdFilter || {};
    crowdFilter.definition = definition;
    crowdFilter.hasChange = this.hasChange;
    crowdFilter.conditions = this.crowdVO2.conditions;
    crowdFilter.references = this._buildReferences(this.crowdVO2.conditions);
    this.onFilter.emit(crowdFilter);
  }

  onValueChange() {
    this.hasChange = true;
    this.onCheck(false);
  }

  onSearchBehavior(parentId, event, query) {
    this.eventFilterService.getEvent2(parentId, event).subscribe((response: any) => {
      const dataTmp = [];
      if (response && response.code === 200) {
        for (let i = 0; i < response.data.eventEntity.length; i++) {
          const obj = response.data.eventEntity[i];
          dataTmp.push({
            name: obj.eventName,
            value: obj.eventId
          });
        }
      }
      query.metaBehaviorList = dataTmp;
    });
  }

  check(isSubmit: boolean) {
    let failure = false;
    let noItem = false;
    if (isSubmit) {
      // 检测是否条件个数为0
      for (let i = 0; i < this.crowdVO2.conditions.length; i++) {
        const condition = this.crowdVO2.conditions[i];
        if (condition.indice === 'behavior' && condition.queryList.length === 0) {
          noItem = true;
        } else if (
          condition.indice === 'attribute' ||
          condition.indice === 'crowd' ||
          condition.indice === 'customTag'
        ) {
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
            if (boolFilter.displayType === 'Tag') {
              if (!boolFilter.value || (boolFilter.value && boolFilter.value.length === 0)) {
                boolFilter.valueCheckFailure = true;
                failure = true;
              }
            } else if (boolFilter.displayType === 'Date' && !boolFilter.value) {
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
              boolFilter.displayType === 'integer' ||
              boolFilter.displayType === 'Integer' ||
              boolFilter.displayType === 'Double' ||
              boolFilter.displayType === 'Long'
            ) {
              if (
                boolFilter.eqType === 'between' &&
                (boolFilter.value2 === undefined || boolFilter.value2 === '' || boolFilter.value2 === null)
              ) {
                boolFilter.value2CheckFailure = true;
                failure = true;
              } else if (boolFilter.value === undefined || boolFilter.value === '' || boolFilter.value === null) {
                boolFilter.valueCheckFailure = true;
                failure = true;
              }
            } else if (condition.indice === 'crowd' || condition.indice === 'customTag') {
              if (!boolFilter.value) {
                boolFilter.valueCheckFailure = true;
                failure = true;
              }
            } else if (boolFilter.displayType === 'String') {
              if (!boolFilter.value) {
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
    }
    return !failure && !noItem;
  }

  onSearch() {
    // if (!this.check(true)) {
    //   return;
    // }
    const crowdFilter = {
      isChecked: true,
      isSubmit: true
    };
    this.onfilterBack(crowdFilter);
  }

  onCheck(isSubmit: boolean) {
    const crowdFilter = {
      isChecked: false,
      isSubmit: isSubmit
    };
    if (this.check(isSubmit)) {
      crowdFilter.isChecked = true;
    }
    this.onfilterBack(crowdFilter);
  }

  logChange(obj?, field?) {
    this.hasChange = true;
    if (obj && typeof obj === 'object' && field) {
      obj[field + 'CheckFailure'] = false;
    }
    this.onCheck(false);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isCrowd) {
      this._isCrowd = changes.isCrowd.currentValue;
    }
    if (changes.isCheck) {
      this._isCheck = changes.isCheck.currentValue;
      if (this._isCheck) {
        this.onCheck(true);
      }
    }

    if (changes.crowdData) {
      this._crowdData = changes.crowdData.currentValue;
      this.initCrowdData(this._crowdData);
    }
  }
}
