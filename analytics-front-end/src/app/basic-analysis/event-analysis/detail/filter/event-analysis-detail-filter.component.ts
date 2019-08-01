import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EventAnalysisService } from '../../event-analysis.service';
import { BaseComponent } from '../../../../common/base-component';

@Component({
  selector: 'app-event-analysis-detail-filter',
  templateUrl: './event-analysis-detail-filter.component.html',
  styleUrls: ['./event-analysis-detail-filter.component.less'],
  providers: [EventAnalysisService]
})
export class EventAnalysisDetailFilterComponent extends BaseComponent implements OnInit {
  @Input() loading: any;
  @Output() onSearch = new EventEmitter<any>();
  @Output() onSelectedDimension = new EventEmitter<any>();
  eventTypeList: any = []; // 事件类型列表
  selecteEventType: string; // 选中的事件类型
  eventTypePaging: any = {}; // 事件类型分页信息
  eventList: any = []; // 事件列表
  selectedEvent: string; // 选中的事件
  eventPaging: any = {
    page: 1,
    rows: 10,
    keyword: ''
  }; // 事件分页信息
  metricList: any = []; // 指标列表
  selectedMetric: number; // 选中的指标
  dimensionList: any = []; // 维度列表
  selectedDimension: string; // 选中的维度
  leftList: any = []; // 等号左边的下拉框列表
  leftAllList: any = []; // 等号左边的下拉框 所有数据
  filterMap: any = {}; // 等号左边的下拉框map数据 key为esfieldname value为displayType

  eventMap: any = {};
  metricMap: any = {};
  searchData: any;

  dateRange: any = []; // 时间

  isFirst: boolean;
  isMoreEventTypeList: boolean;
  isMoreEventList: boolean;
  crowdFilter: any;
  _crowdFilter: any = {};
  _crowdFilterContrast: any = {};
  _isCheckCrowdFilter: any;

  //分析对象
  analysisObj: any = {
    selecteEventType: '',
    selectedEvent: '',
    eventTypeList: [],
    eventTypePaging: {},
    eventList: [],
    eventMap: {},
    isFirst: true,
    isMoreEventTypeList: true,
    isMoreEventList: true,
    showObjAttr: false,
    showObjFilter: false,
    eventPaging: {
      page: 1,
      rows: 10,
      keyword: ''
    }, // 事件分页信息
    selectedMetric: 1,
    query: {
      operator: 'and',
      boolFilters: []
    },
    crowdFilter: {}
  };
  //对比分析对象
  contrastObj: any = {
    selecteEventType: '',
    selectedEvent: '',
    eventTypeList: [],
    eventTypePaging: {},
    eventList: [],
    eventMap: {},
    isFirst: true,
    isMoreEventTypeList: true,
    isMoreEventList: true,
    showObjAttr: false,
    showObjFilter: false,
    eventPaging: {
      page: 1,
      rows: 10,
      keyword: ''
    }, // 事件分页信息
    query: {
      operator: 'and',
      boolFilters: []
    },
    crowdFilter: {}
  };
  showContrast: boolean = false;

  _commonFilter: any;
  _commonFilterInit: any;

  constructor(private fb: FormBuilder, public service: EventAnalysisService, private injector: Injector) {
    super(injector);

    const that = this;
    that.isFirst = true;
    that.isMoreEventTypeList = true;
    that.isMoreEventList = true;
    that.eventTypePaging = {
      page: 1,
      rows: 20
    };
    this.metricList = [
      {
        name: '触发用户数',
        value: 1
      },
      {
        name: '触发次数',
        value: 2
      },
      {
        name: '人均次数',
        value: 3
      }
    ];
    this.metricMap = {
      1: '触发用户数',
      2: '触发次数',
      3: '人均次数'
    };
    that.analysisObj.selectedMetric = that.metricList[0].value;

    this._commonFilterInit = {
      startDate: this.route.snapshot.params['startDate'] || '',
      endDate: this.route.snapshot.params['endDate'] || '',
      eventTypeId: this.route.snapshot.params['eventTypeId'] || '',
      platform: this.route.snapshot.params['platform'] || '',
      sdkSource: this.route.snapshot.params['sdkSource'] || '',
      eventId: this.route.snapshot.params['eventId'] || '',
      sdk: this.route.snapshot.params['sdk'] || ''
    };
    that.searchData = JSON.parse(localStorage.getItem('eventFilter'));
    if (that.searchData) {
      this._commonFilterInit.startDate = that.searchData.json.startDate;
      this._commonFilterInit.endDate = that.searchData.json.endDate;
    }
    this._commonFilter = this.deepCopy(this._commonFilterInit);
  }

  ngOnInit() {
    const that = this;
    // 获取按后面下拉框列表
    that.service.getProvince().subscribe((data: any) => {
      if (data.success) {
        for (const key in data.list) {
          if (data.list.hasOwnProperty(key)) {
            const json = {
              key: key,
              value: data.list[key]
            };
            if (!that.selectedDimension) {
              that.selectedDimension = 'all';
            }
            that.dimensionList.push(json);
            that.leftAllList = that.leftAllList.concat(data.list[key]);
          }
        }
      }
    });
  }

  getSelecteEventType(isFirst: Boolean) {
    const that = this;
    if (isFirst) {
      that.analysisObj.isFirst = true;
      that.getEventTypeList(that.analysisObj, 1);
      that.hideContrast();
      this.showContrast = false;
    } else {
      that.searchData = JSON.parse(localStorage.getItem('eventFilter'));
      if (that.searchData) {
        that.setSearchData();
      } else {
        if (!that._commonFilterInit.eventTypeId && that._commonFilterInit.eventId) {
          that.getEventTypeByEvent(that._commonFilterInit.eventId);
        } else {
          that.analysisObj.selecteEventType = that._commonFilterInit.eventTypeId;
          that.getEventTypeList(that.analysisObj, 1, that.analysisObj.selecteEventType);
        }
      }
    }
  }

  addItem(list: any, obj: any) {
    obj.showObjAttr = true;
    list.push({
      operator: '',
      term: true,
      fieldName: null,
      eqType: 'eq',
      value: null,
      value2: null
    });
  }

  onValueChange(obj: any) {
    if (obj.query.boolFilters.length > 0) {
      obj.definitionEvent = this._getDefinition(obj);
    } else {
      delete obj.definitionEvent;
    }
  }

  // 获取用户后面下拉框列表
  getProfilemetasList() {
    const that = this;
    that.service.getProfilemetasList(+that.analysisObj.selectedEvent).subscribe((data: any) => {
      if (data.success) {
        that.leftList = [];
        that.filterMap = {};
        for (const key in data.list) {
          if (data.list.hasOwnProperty(key)) {
            const json = {
              key: key,
              value: data.list[key]
            };
            if (json.value && json.value.length > 0) {
              for (let i = 0; i < json.value.length; i++) {
                json.value[i].groupKey = key;
              }
            }
            that.leftList.push(json);
            const tmpLength = data.list[key].length;
            for (let i = 0; i < tmpLength; i++) {
              that.filterMap[data.list[key][i].esfieldname] = data.list[key][i].displayType;
            }
          }
        }
      }
    });
  }

  _getOptionById(id: any, list: any[]) {
    let option;
    if (id && list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (id === list[i].id) {
          option = list[i];
          break;
        }
      }
    }
    return option;
  }

  getEventTypeList(obj: any, page?: number, eventTypeId?: any) {
    const that = this;
    if (!obj.isMoreEventTypeList) {
      return;
    }
    const tmpEventJson = {
      page: page || obj.eventTypePaging.page + 1 || 1,
      rows: obj.eventTypePaging.rows || 30,
      dicKey: 'eventtype',
      order: 'asc'
    };
    that.service.getEventList(tmpEventJson).subscribe((result: any) => {
      if (result.success) {
        if (that._commonFilter.sdk != 'miniprogram') {
          result.list = result.list.filter((value: any) => value.dicItemValue.indexOf('小程序') < 0);
        } else {
          result.list = result.list.filter((value: any) => value.dicItemValue != '自定义事件');
        }

        obj.eventTypeList = result.list;
        if (!eventTypeId) {
          obj.selecteEventType = obj.eventTypeList[0] && obj.eventTypeList[0].id;
          this.eventListChange(obj);
        } else {
          const eventObj = obj.eventTypeList.filter((value: any) => value.id == eventTypeId);
          obj.selecteEventType = eventObj[0] && eventObj[0].id;
          this.eventListChange(obj, eventTypeId);
        }

        // 获取触发下拉框列表
        obj.eventList = [];
        obj.eventPaging.page = 1;
        if (obj.selecteEventType || obj.selecteEventType == '') {
          if (!eventTypeId) {
            that.getEventList(obj, 1, false);
          } else {
            if (that.searchData) {
              that.getEventList(obj, 1, false, obj.selectedEvent);
            } else {
              that.getEventList(obj, 1, false, that._commonFilterInit.eventId);
            }
          }
        } else {
          obj.crowdFilter = JSON.parse(localStorage.getItem('eventFilter'));
          if (obj.crowdFilter && !obj.crowdFilter.conditions) {
            that.search();
          }
        }

        if (obj.eventTypeList.length <= result.total) {
          obj.isMoreEventTypeList = false;
        }
      }
    });
  }

  eventTypeChange(data: any, obj: any) {
    const that = this;
    // obj.showObjAttr = false;
    // obj.query.boolFilters = [];
    //obj.query.operator = 'and';
    obj.eventList = [];
    obj.isMoreEventList = true;
    obj.isFirst = false;
    obj.eventPaging.page = 1;
    that.getEventList(obj, 1, false);
  }

  eventListChange(obj: any, eventTypeId?: any) {
    if (!eventTypeId) {
      obj.showObjAttr = false;
      obj.query.boolFilters = [];
      obj.query.operator = 'and';
      delete obj.definitionEvent;
    }
  }

  onSearchEvent(value: any, obj: any) {
    obj.eventPaging.page = 1;
    obj.eventPaging.keyword = value || '';
    obj.eventList = [];
    obj.isMoreEventList = true;
    this.getEventList(obj, 1, true);
  }

  getEventTypeByEvent(eventId: any): void {
    const that = this;
    const tmpJson = {
      page: 1,
      rows: 10,
      dicKey: 'eventid',
      parentId: '',
      searchName: '',
      id: eventId
    };
    that.service.getEventList(tmpJson).subscribe((data: any) => {
      if (data.success) {
        for (let i = 0; i < data.list.length; i++) {
          if (data.list[i].id == eventId) {
            that.analysisObj.selecteEventType = data.list[i].eventTypeId;
            that.getEventTypeList(that.analysisObj, 1, that.analysisObj.selecteEventType);
          }
        }
      }
    });
  }

  getEventList(obj: any, page?: number, isSearch?: boolean, selectedEvent?: any) {
    const that = this;
    if (!that.isMoreEventList) {
      return;
    }
    const tmpJson = {
      page: page || obj.eventPaging.page || 1,
      rows: obj.eventPaging.rows || 10,
      dicKey: 'eventid',
      parentId: obj.selecteEventType,
      searchName: obj.eventPaging.keyword || '',
      sdkSource: this._commonFilter.sdkSource,
      id: selectedEvent || ''
    };
    that.service.getEventList(tmpJson).subscribe((data: any) => {
      obj.eventPaging.page = tmpJson.page + 1;
      if (data.success) {
        for (let i = 0; i < data.list.length; i++) {
          const json = {
            value: data.list[i].id,
            name: data.list[i].dicItemAlias,
            smartEvent: data.list[i].smartEvent
          };
          obj.eventMap[data.list[i].id] = data.list[i].dicItemAlias;
          obj.eventList.push(json);
        }
        //去重
        let result = [],
          o = {};
        for (let i = 0; i < obj.eventList.length; i++) {
          if (!o[obj.eventList[i].value]) {
            result.push(obj.eventList[i]);
            o[obj.eventList[i].value] = true;
          }
        }
        obj.eventList = result;
        //
        if (obj.eventList.length >= data.total) {
          that.isMoreEventList = false;
        }

        if (!isSearch) {
          if (!selectedEvent) {
            that.eventListChange(obj);
          }
          if (obj.eventList.length > 0) {
            obj.selectedEvent = selectedEvent ? Number(selectedEvent) : obj.eventList[0].value || '';
          }
          if (that.isFirst) {
            this.search();
            that.isFirst = false;
          } else {
            //  this.search();
          }
          that.getProfilemetasList();
        }
      }
    });
  }

  setSearchData() {
    if (this.searchData) {
      if (this.searchData.json) {
        const json = this.searchData.json;
        this.analysisObj.selecteEventType = json.eventTypeId;
        this.analysisObj.selectedEvent = json.eventId;
        this.analysisObj.selectedMetric = json.metricCode;
        this.selectedDimension = json.aggregationFiled;
        this._commonFilter.startDate = json.startDate;
        this._commonFilter.endDate = json.endDate;
        this._commonFilter.platform = json.platform;
        this._commonFilter.sdkSource = json.sdkSource;
        if (json.definition) {
          this.analysisObj.crowdFilter = json.definition;
          this.analysisObj.showObjFilter = true;
        }
        if (json.definitionEvent) {
          this.analysisObj.query = this.parseQueryList(json.definitionEvent);
          this.analysisObj.definitionEvent = json.definitionEvent;
          this.analysisObj.showObjAttr = true;
        }
        this.getEventTypeList(this.analysisObj, 1, this.analysisObj.selecteEventType);
      }
      if (this.searchData.jsonContrast) {
        this.showContrast = true;
        const jsonContrast = this.searchData.jsonContrast;
        this.contrastObj.selecteEventType = jsonContrast.eventTypeId;
        this.contrastObj.selectedEvent = jsonContrast.eventId;
        if (jsonContrast.definition) {
          this.contrastObj.crowdFilter = jsonContrast.definition;
          this.contrastObj.showObjFilter = true;
        }
        if (jsonContrast.definitionEvent) {
          this.contrastObj.query = this.parseQueryList(jsonContrast.definitionEvent);
          this.contrastObj.definitionEvent = jsonContrast.definitionEvent;
          this.contrastObj.showObjAttr = true;
        }
        this.getEventTypeList(this.contrastObj, 1, this.contrastObj.selecteEventType);
      }
    }
  }

  changeEvent(e: any, index: number, item: any) {
    item.page = 1;
  }
  onSearchEventAttr(value: any, index: number, item: any) {
    item.searchName = value || '';
    item.page = 1;
  }

  changeFilter(data: any) {
    data.operator = '=';
    data.values = null;
  }

  attributeChange(boolFilters: any, obj: any) {
    if (boolFilters.length === 0) {
      obj.showObjAttr = false;
      obj.definitionEvent = {};
    }
  }

  // 更多筛选
  moreSearch(list: any, obj: any) {
    obj.showObjFilter = !obj.showObjFilter;
    if (obj.showObjFilter) {
      obj.crowdFilter = undefined;
    } else {
      this._crowdFilter = {};
    }
  }

  //添加对比分析
  addContrast() {
    this.showContrast = !this.showContrast;
    this.analysisObj.showObjFilter = false;
    this.analysisObj.crowdFilter = {};
    this.contrastObj.eventPaging.page = 1;
    this.contrastObj.eventPaging.keyword = '';
    this.getEventTypeList(this.contrastObj, 1);
  }

  hideContrast() {
    this.showContrast = !this.showContrast;
    this.contrastObj.showObjAttr = false;
    this.contrastObj.showObjFilter = false;
    this.contrastObj.query = {
      boolFilters: []
    };
    this.contrastObj.crowdFilter = {};
  }

  formatterInputNumber(value: any, item: any) {
    if (value && item && item.filter) {
      if (item.filter.displayType === 'Integer' && value.toString().indexOf('.') !== -1) {
        setTimeout(() => {
          item.values = parseInt(value.toString(), 10);
        }, 10);
      }
    }
  }

  onFilter(crowdFilter: any, type: any) {
    if (type == 'analysisObj') {
      this._crowdFilter['crowdFilter'] = crowdFilter;
      if (crowdFilter.conditions.length === 0) {
        this.analysisObj.showObjFilter = false;
      }
      if (this._crowdFilter['crowdFilter'].isSubmit) {
        if (this._crowdFilter['crowdFilter'].isChecked) {
          this.search();
        }
        setTimeout(() => {
          this._isCheckCrowdFilter = false;
        }, 100);
      }
    } else {
      this._crowdFilterContrast['crowdFilter'] = crowdFilter;
      if (crowdFilter.conditions.length === 0) {
        this.contrastObj.showObjFilter = false;
      }
      if (this._crowdFilterContrast['crowdFilter'].isSubmit) {
        localStorage.setItem('crowdFilter', JSON.stringify(this._crowdFilterContrast));
        if (this._crowdFilterContrast['crowdFilter'].isChecked) {
          this.search();
        }
        setTimeout(() => {
          this._isCheckCrowdFilter = false;
        }, 100);
      }
    }
  }

  clickSearch() {
    this.search();
  }

  search(e?: any, type?: any, obj?: any) {
    const that = this;
    const json = {
      productId: that.productId
    };
    const jsonContrast = {
      productId: that.productId
    };

    json['eventTypeId'] = that.analysisObj.selecteEventType;
    json['startDate'] = that._commonFilter.startDate;
    json['endDate'] = that._commonFilter.endDate;
    json['sdkSource'] = that._commonFilter.sdkSource;
    json['platform'] = that._commonFilter.platform;
    json['eventId'] = that.analysisObj.selectedEvent;
    json['metricCode'] = that.analysisObj.selectedMetric;
    json['definitionEvent'] = that.analysisObj.definitionEvent;
    json['aggregationFiled'] = that.selectedDimension;
    json['aggregationType'] = that.getAggregationType(that.selectedDimension);
    if (
      that.analysisObj.showObjFilter &&
      that._crowdFilter &&
      that._crowdFilter.crowdFilter &&
      that._crowdFilter.crowdFilter.definition
    ) {
      json['definition'] = that._crowdFilter.crowdFilter.definition;
    }
    const queryAllParams = {
      json: json,
      eventMap: that.analysisObj.eventMap,
      selectedEvent: that.analysisObj.selectedEvent,
      metricMap: that.metricMap,
      selectedMetric: that.analysisObj.selectedMetric,
      selectedDimension: that.selectedDimension
    };
    if (this.showContrast) {
      jsonContrast['eventTypeId'] = that.contrastObj.selecteEventType;
      jsonContrast['startDate'] = that._commonFilter.startDate;
      jsonContrast['endDate'] = that._commonFilter.endDate;
      jsonContrast['sdkSource'] = that._commonFilter.sdkSource;
      jsonContrast['platform'] = that._commonFilter.platform;
      jsonContrast['eventId'] = that.contrastObj.selectedEvent;
      jsonContrast['definitionEvent'] = that.contrastObj.definitionEvent;
      jsonContrast['aggregationFiled'] = that.selectedDimension;
      jsonContrast['aggregationType'] = json['aggregationType'];
      if (
        that.contrastObj.showObjFilter &&
        that._crowdFilterContrast &&
        that._crowdFilterContrast.crowdFilter &&
        that._crowdFilterContrast.crowdFilter.definition
      ) {
        jsonContrast['definition'] = that._crowdFilterContrast.crowdFilter.definition;
      }
      queryAllParams['jsonContrast'] = jsonContrast;
      (queryAllParams['eventContrastMap'] = that.contrastObj.eventMap),
        (queryAllParams['selectedEventContrast'] = that.contrastObj.selectedEvent);
    }
    localStorage.setItem('eventFilter', JSON.stringify(queryAllParams));
    that.onSearch.emit(queryAllParams);
  }

  getAggregationType(value: any) {
    let type = null;
    for (let i = 0; i < this.leftAllList.length; i++) {
      if (this.leftAllList[i].esfieldname == value) {
        type = this.leftAllList[i].profilemetaType;
      }
    }
    return type;
  }

  _onFilter(filter: any) {
    this._commonFilter = filter || {};
    if (!this._commonFilter['sdk']) {
      this._commonFilter['sdk'] = this._commonFilterInit.sdk;
    }

    if (filter.sdkChange) {
      this.getSelecteEventType(true);
    } else {
      if (!filter.dateChange && !filter.platformChange) {
        this.getSelecteEventType(false);
      }
    }
  }

  _getDefinition(obj: any) {
    const filters = [];
    const conditionMap = {};
    // 组装最外层
    if (obj.query) {
      filters.push({
        condition: 'condition_1',
        not: 'false',
        operator: obj.query.operator
      });
      conditionMap['condition_1'] = {
        indice: {
          type: 'attribute'
        },
        queryList: this.mergeQueryList(obj.query, obj.indice)
      };
    }

    const definition = {
      filters: filters,
      condition: conditionMap
    };
    return definition;
  }

  parseQueryList(query: any) {
    let queryObj = {};
    if (query) {
      const queryList = query.condition.condition_1.queryList;
      for (let i = 0; i < queryList.length; i++) {
        const obj = queryList[i];
        let j = 0;

        const boolFilterList = [];
        for (; j < obj.boolFilters.length; j++) {
          const boolFilterObj = obj.boolFilters[j];

          const valueList = [];

          for (const key in boolFilterObj.must.term) {
            let value = boolFilterObj.must.term[key];
            if (boolFilterObj.must.attributeType === 'Date') {
              value = value ? new Date(value) : '';
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
            value: valueList[0].value,
            value2: null,
            prop1ValueList: []
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

        queryObj = {
          operator: obj.operator,
          boolFilters_0: [],
          boolFilters: boolFilterList
        };
      }
    }

    return queryObj;
  }

  // 转换json用
  mergeQueryList(queryList: any, indice: any) {
    const returnValue = [];
    let eventTypeBoolFilter: any;
    const boolFilters = [];
    for (let j = 0; j < queryList.boolFilters.length; j++) {
      const singleFiled = queryList.boolFilters[j];

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
        } else if (singleFiled.displayType === 'String') {
          operatorValue[singleFiled.eqType] = singleFiled.value;
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
      operator: queryList.operator,
      eventTypeBoolFilter: eventTypeBoolFilter
    });

    return returnValue;
  }

  check(obj: any, isSubmit: boolean) {
    let failure = false;
    if (isSubmit) {
      // 检测所有属性检测项
      for (let k = 0; k < obj.boolFilters.length; k++) {
        const boolFilter = obj.boolFilters[k];
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
        } else if (boolFilter.displayType === 'String') {
          if (!boolFilter.value) {
            boolFilter.valueCheckFailure = true;
            failure = true;
          }
        }
      }

      if (failure) {
        this.message.create('error', '请为空白项输入值');
      }
    }
    return !failure;
  }
}
