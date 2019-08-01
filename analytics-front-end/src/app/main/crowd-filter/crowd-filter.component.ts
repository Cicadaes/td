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
import { DatePipe } from '@angular/common';
import { CrowdFilterService } from './crowd-filter.service';
import { BaseComponent } from '../../common/base-component';

@Component({
  selector: 'app-crowd-filter',
  templateUrl: './crowd-filter.component.html',
  styleUrls: ['./crowd-filter.component.less']
})
export class CrowdFilterComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() isCrowd;
  @Input() crowdData;
  @Input() isCheck;
  @Output() onFilter = new EventEmitter<any>();
  _isCrowd: boolean;
  _isCheck: boolean;
  parentId: any;
  parentName: any;
  isLoading: boolean = true;
  tipShow: any;
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
    conditions: [
      {
        indice: 'attribute',
        not: 'false',
        operator: '',
        queryList: [
          {
            operator: '',
            boolFilters: []
          }
        ]
      }
    ]
  };

  // 行为备选列表，废弃
  metaBehaviorList: Array<any> = [
    { value: '1', name: 'SDK版本', displayType: 'Tag' },
    { value: '2', name: '产品', displayType: 'String' },
    { value: '3', name: '平台', displayType: 'Integer' },
    { value: '4', name: '渠道', displayType: 'Date' }
  ];

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
  page: number = 1; //获取现有人群列表当前页数
  loading: boolean = true; //现有人群是否显示loading
  dataTmp: any; ///现有人群暂存数据
  name: any; //现有人群查询数据
  dataTmpLebgth: number; //当前实际现有人群数量
  cont: any = []; //反显是现有人群
  userBehaviorCont: any = []; //用户行为返现数据
  _page: number = 1; //行为下拉框数据分页当前页数
  constructor(
    private crowdFilterService: CrowdFilterService,
    private injector: Injector,
    public changeDetectorRef: ChangeDetectorRef
  ) {
    super(injector);
    this.initRouterList('新建/编辑用户分群');
  }

  ngOnInit() {
    // this.crowdVO2.crowd.productId = this.productId;
    this.page = 1;
    this.dataTmpLebgth = 0;
    this.cont = [];
    this.userBehaviorCont = [];
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
    }

    const now = new Date().getTime();
    const start_7 = now - 86400000 * 7;
    const start_30 = now - 86400000 * 30;
    const end = now - 86400000;
    this.ranges1 = {
      近七日: [new Date(start_7), new Date(end)],
      近30日: [new Date(start_30), new Date(end)]
    };
    this.queryEventType();
    this.existingPopulation();
    this.queryExistingTag();
  }

  /**
   * 现有人群返显
   * AEP-9460
   */
  async existingPopulation() {
    this.cont = [];
    if (this.crowdId) {
      await new Promise((resolve: any, reject: any) => {
        this.crowdFilterService.queryCrowd(this.crowdId).subscribe((response: any) => {
          if (response && response.code == '200' && response.data.definition && response.data.definition.condition) {
            let _key = response.data.definition.condition;
            for (let key in _key) {
              if (_key[key]) {
                _key[key].queryList.forEach((element: any) => {
                  element.boolFilters.forEach((conts: any) => {
                    this.cont = this.cont.concat(conts.must.term.eq);
                  });
                });
              }
            }
          }
          resolve();
        });
      });
    }
    this.queryExistingCrowd(false, this.cont, '');
  }
  /**
   * 获取事件类型列表
   */
  queryEventType() {
    this.crowdFilterService.queryDict('eventtype').subscribe(resp => {
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

      const definition = crowdData.definition;
      if (definition) {
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
      }
      this.crowdVO2.referenceCollection = crowdData.referenceCollection;
      if (crowdData.isSubmit) {
        this.onfilterBack(crowdData);
      }
    }
  }
  /**
   * 获取现有标签列表
   */
  queryExistingTag() {
    const param = {
      page: 1,
      rows: 999999,
      productId: this.productId
    };
    this.crowdFilterService.queryExistingTag(param).subscribe((response: any) => {
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
  /**
   * 渠道selsect到底部回调
   */
  scrollToBottom() {
    if (this.loading) {
      this.page = this.page + 1;
      this.queryExistingCrowd(true, this.cont, '');
    }
  }
  /**
   * 人群查询name
   */
  _queryExistingCrowd(data: any) {
    this.name = data;
    this.page = 1;
    this.queryExistingCrowd(false, this.cont, this.name);
  }
  /**
   * 获取现有人群列表
   */
  queryExistingCrowd(lazyLoading: boolean = false, data: any = [], name: any) {
    if (data && data.length) {
      data = Array.from(new Set(data));
    } else {
      data = [];
    }
    let parmes = {
      productId: localStorage.getItem('productId'),
      page: this.page,
      rows: 20,
      name: name,
      crowdIds: data && data.length ? data.join(',') : ''
    };
    this.crowdFilterService._queryExistingCrowd(parmes).subscribe(
      (response: any) => {
        if (response && response.success && response.list[1].total) {
          if (!lazyLoading) {
            this.dataTmp = [];
            this.dataTmpLebgth = 0;
          }
          for (let i = 0; i < response.list[0].length; i++) {
            const obj = response.list[0][i];
            this.dataTmp.push({
              name: obj.name,
              value: obj.id
            });
          }
        } else {
          this.dataTmp = [];
          this.loading = false;
        }
        this.existingCrowdList = this.dataTmp;
        if (this.existingCrowdList && this.existingCrowdList.length < response.list[1].total) {
          this.loading = true;
        } else {
          this.loading = false;
        }
      },
      () => {
        this.existingCrowdList = [];
        this.loading = false;
      }
    );
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
    } else {
      returnObj = {
        operator: 'and',
        boolFilters: [
          {
            operator: 'and',
            term: true,
            fieldName: 'duration',
            eqType: 'eq',
            value: ['2018-05-01T08:16:01.895Z', '2018-05-28T08:16:01.895Z'],
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
        boolFilters: boolFilterList
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
        this.userBehavior(value, queryObj, obj);
      }

      tmpList.push(queryObj);
    }

    return tmpList;
  }
  /**
   * 用户行为返现
   */
  async userBehavior(value: any, queryObj: any, obj: any) {
    this.userBehaviorCont = [];
    if (this.crowdId) {
      await new Promise((resolve: any, reject: any) => {
        this.crowdFilterService.queryCrowd(this.crowdId).subscribe((response: any) => {
          if (response && response.code == '200' && response.data.definition && response.data.definition.condition) {
            let _key = response.data.definition.condition;
            for (let key in _key) {
              if (_key[key]) {
                _key[key].queryList.forEach((element: any) => {
                  element.boolFilters.forEach((conts: any) => {
                    this.userBehaviorCont = this.userBehaviorCont.concat(conts.must.term.eq);
                  });
                });
              }
            }
          }
          resolve();
        });
      });
    }
    this.changeBehaviorType({ fieldName: value }, queryObj, false);
    this.changeBehavior(obj.boolFilters[0].must.term.eq, queryObj, false);
  }
  // 切换事件类型
  changeBehaviorType(obj: any, query: any, clear: any) {
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
    this._page = 1;
    this.eventList(obj.fieldName, '', query, this.userBehaviorCont);
  }
  /**
   * 事件列表下拉框数据的分页
   */
  scrollToBottomFieldName(parentId: any, event: any, query: any) {
    if (this.isLoading) {
      this._page++;
      this.eventList(parentId, event, query, this.userBehaviorCont, this._page);
    }
  }
  /**
   * 事件列表下拉框的获取
   * AEP-9462
   */
  eventList(parentId: any, event: any, query: any, cont: any, page: number = 1) {
    if (cont && cont.length) {
      cont = Array.from(new Set(cont));
    } else {
      cont = [];
    }
    const parmes = {
      page: page,
      rows: 20,
      dicItemKey: 'eventid',
      eventTypeId: parentId,
      dicItemAliasOrValue: event,
      productId: localStorage.getItem('productId'),
      ids: cont && cont.length ? cont.join(',') : ''
    };
    if (page == 1 || event !== '') {
      query.metaBehaviorList = [];
      this.isLoading = true;
    }
    this.crowdFilterService._getEvent2(parmes).subscribe((response: any) => {
      const dataTmp = [];
      if (response && response.success && response.list[1].total) {
        for (let i = 0; i < response.list[0].length; i++) {
          const obj = response.list[0][i];
          dataTmp.push({
            name: obj.eventName,
            value: obj.eventId
          });
        }
      }
      query.metaBehaviorList = [...query.metaBehaviorList, ...dataTmp];
      if (query.metaBehaviorList && query.metaBehaviorList.length < response.list[1].total) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
    });
  }
  /**
   * 事件列表下拉框远程搜索
   * @param parentId
   * @param event
   * @param query
   */
  onSearchBehavior(parentId, event, query) {
    this._page = 1;
    this.eventList(parentId, event, query, this.userBehaviorCont);
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

    this.crowdFilterService.getEventParams(behavior).subscribe((response: any) => {
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
  changeOperator(condition) {
    this.hasChange = true;
    if (condition.operator === 'and') {
      condition.operator = 'or';
    } else {
      condition.operator = 'and';
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
  changeIndice(condition, event) {
    this.hasChange = true;
    if (event === 'attribute' || event === 'crowd' || event === 'customTag') {
      condition.queryList = [
        {
          operator: '',
          boolFilters: []
        }
      ];
    } else if (event === 'behavior') {
      const now = new Date().getTime();
      const start = now - 86400000 * 6;
      const end = now;
      condition.queryList = [];
      condition.eventTimeQuery = {
        operator: 'and',
        boolFilters: [
          {
            operator: 'and',
            term: true,
            fieldName: 'duration',
            eqType: 'eq',
            value: [new Date(start), new Date(end)],
            value2: null
          }
        ]
      };
    }
    this.onCheck(false);
  }

  // 移除条目
  removeItem(list, index) {
    this.hasChange = true;
    list.splice(index, 1);
    if (list && list[0]) {
      list[0].operator = '';
    }
    this.onCheck(false);
  }

  // 添加条目
  addItem(list, type) {
    this.hasChange = true;
    this.onCheck(false);
    let operTmp = '';
    if (list.length > 0) {
      operTmp = 'and';
    }
    if (type === 'block') {
      list.push({
        indice: 'attribute',
        not: 'false',
        operator: operTmp,
        queryList: [
          {
            operator: '',
            boolFilters: []
          }
        ]
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
          must: {
            attributeCode: 'eventid',
            term: {
              eq: obj.boolFilters_0[0].value
            }
          },
          operator: obj.boolFilters_0[0].operator
        });

        eventTypeBoolFilter = {
          must: {
            attributeCode: 'eventType',
            term: {
              eq: obj.boolFilters_0[0].fieldName
            }
          },
          operator: 'and'
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
          queryList: this.mergeQueryList(obj.queryList, obj.indice),
          eventTimeQuery: obj.indice === 'behavior' ? this.mergeDate(obj.eventTimeQuery) : null
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
    if (!this.check(true)) {
      return;
    }
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
    this.name = null;
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
