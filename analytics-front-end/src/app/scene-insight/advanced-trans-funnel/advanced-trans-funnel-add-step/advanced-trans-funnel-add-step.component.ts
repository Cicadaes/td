import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AdvancedTransFunnelService } from '../advanced-trans-funnel.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Globals } from '../../../utils/globals';

@Component({
  selector: 'app-advanced-trans-funnel-add-step',
  templateUrl: './advanced-trans-funnel-add-step.component.html',
  styleUrls: ['./advanced-trans-funnel-add-step.component.less']
})
export class AdvancedTransFunnelAddStepComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() isSubmit: boolean;
  @Input() sdkId: any;
  @Input() funnelOrder: any;
  @Input() tagName: any;
  @Output() onBack = new EventEmitter<any>();
  _stepsData: any[];
  _steps: any[];
  _stepsBack: any[];
  _eventTypes: any[];
  _conditionTypes: any[];

  _conditionTagOperators: any[];
  _conditionTagEventOperators: any[];
  _conditionNumberOperators: any[];
  _conditionStringOperators: any[];
  _conditionValues: any[];
  _conditionEventsValuesMap: any = {};
  _searchValue: any;

  _isSubmit: boolean;
  _isValid: boolean;
  _funnelOrder: any;

  constructor(
    private service: AdvancedTransFunnelService,
    private message: NzMessageService,
    public globals: Globals
  ) {}

  onSearchEvent(value: any, step: any) {
    step.page = 1;
    this._searchValue = value;
    this.queryConditionEventsValues(step.eventTypeId, value, step.page, null, step);
  }

  loadMoreEvent(step: any) {
    console.dir([step]);
    step.page = step.page || 1;
    step.page++;
    this.queryConditionEventsValues(step.eventTypeId, this._searchValue, step.page, null, step);
  }

  changeEventType(value: any, step: any) {
    //    step.isError = false;
    console.dir([value]);
    step.stepConditions = [];
    const eventType = this._getItemById(step.eventTypeId, this._eventTypes);
    step.conditionTypes = this.initConditionTypes(eventType);
    const stepCondition = this._getStepCondtion(step.conditionTypes, step);
    step.stepConditions.push(stepCondition);
    if (stepCondition.filter === 'eventid') {
      this.queryConditionEventsValues(step.eventTypeId, '', 1, stepCondition, step);
    }
  }

  changeConditionEvent(value: any, step: any, condition: any) {
    step.conditionTypes = [step.conditionTypes[0]];
    step.stepConditions = [step.stepConditions[0]];
    this.queryConditionTypeOptions(value, step, condition, null);
  }

  queryConditionTypeOptions(value: any, step: any, condition: any, _step: any) {
    const params = {
      productId: this.globals.getProductIdByStorage(),
      eventId: value
    };
    this.service.queryEventAttrs(params).subscribe((response: any) => {
      console.dir([response]);
      if (response) {
        condition.typeOptions = step.conditionTypes;
        this._buildOption(condition.typeOptions, response.list);
        this._rebuildTypeOptionsOrder(condition.typeOptions);
        if (_step && _step.stepConditions && _step.stepConditions.length > 0) {
          for (let i = 0; i < _step.stepConditions.length; i++) {
            const _condition = _step.stepConditions[i];
            if (_condition.filter !== 'eventid') {
              this.addStepCondition(step, _condition);
            }
          }
        }
      }
    });
  }

  _buildOption(arrs: any[], list: any[]) {
    arrs = arrs || [];
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const li = list[i];
        arrs.push(li);
      }
    }
  }

  _rebuildTypeOptionsOrder(list: any[]) {
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const li = list[i];
        if (li.displayType === 'Integer' || li.displayType === 'Double') {
          li.displaynameOrder = li.displayname + '(单次)';
        } else {
          li.displaynameOrder = li.displayname;
        }
      }
    }
  }

  _getItemById(id: any, list: any[]) {
    let item;
    if (id && list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (id === list[i].id) {
          item = list[i];
          break;
        }
      }
    }
    return item;
  }

  _getStepCondtion(list: any[], step: any) {
    let stepCondition;
    let condtion = {
      operator: 'eq' || null, // 初始化事件默认操作符
      value: null
    };
    if (step && step.stepConditions && step.stepConditions.length > 0) {
      condtion = step.stepConditions[0];
      if (condtion.value) {
        condtion.value = parseFloat(condtion.value);
      }
    }
    if (list && list.length > 0) {
      stepCondition = {
        filter: list[0].esfieldname, // es中 字段名
        typeOption: list[0] || {}, // 默认第一个
        typeOptions: list,
        operator: condtion.operator || null, // key和value关系 eq gt lt range like
        value: condtion.value || null, // es中 字段的值
        isError: false
      };
    }
    return stepCondition;
  }

  queryConditionEventsValues(eventTypeId: any, keyword: string, page: any, condition: any, step: any) {
    const searchName = keyword || '';
    if (!this._conditionEventsValuesMap[eventTypeId]) {
      this._conditionEventsValuesMap[eventTypeId] = [];
    }
    let eventId;
    if (condition && condition.value) {
      eventId = condition.value;
    }
    const params = {
      page: page || 1,
      dicItemKey: 'eventid',
      rows: 20,
      eventTypeId: eventTypeId,
      id: eventId || '',
      dicItemAliasOrValue: searchName,
      sdkId: this.sdkId || null
    };
    this.service.queryChildEvents(params).subscribe((response: any) => {
      console.dir([response]);
      if (page === 1) {
        this._conditionEventsValuesMap[eventTypeId] = response.list;
      } else {
        this._conditionEventsValuesMap[eventTypeId] = this._conditionEventsValuesMap[eventTypeId].concat(response.list);
      }
      this._conditionEventsValuesMap[eventTypeId] = this.arrUniqueByAttr(
        this._conditionEventsValuesMap[eventTypeId],
        'id'
      );
      if (
        condition &&
        !condition.value &&
        this._conditionEventsValuesMap[eventTypeId] &&
        this._conditionEventsValuesMap[eventTypeId].length > 0
      ) {
        // 初始化事件默认值
        condition.value = this._conditionEventsValuesMap[eventTypeId][0].id;
        this.queryConditionTypeOptions(condition.value, step, condition, null);
      }
    });
  }

  /**
   * 数组对象去重（根据属性）
   * @param arr
   * @param name
   */
  arrUniqueByAttr(arr, name) {
    const hash = {};
    return arr.reduce((item, next) => {
      if (!hash[next[name]]) {
        hash[next[name]] = true && item.push(next);
      }
      return item;
    }, []);
  }

  openConditionType(value: any, condition: any, step: any) {
    console.dir([value, condition, step]);
    condition.typeOptions = [];
    if (value && step.conditionTypes && step.conditionTypes.length > 0) {
      for (let i = 0; i < step.conditionTypes.length; i++) {
        //                const repeat = this._checkConditonRepeat(step.conditionTypes[i], step.stepConditions);
        //        if (!repeat) {
        if (step.conditionTypes[i].esfieldname !== 'eventid') {
          const typeOption = step.conditionTypes[i];
          condition.typeOptions.push(typeOption);
        }
        //        }
      }
    }
  }

  removeStep(i: number) {
    this._steps.splice(i, 1);
  }

  removeCondition(condition: any, step: any, index: any) {
    if (condition && step.stepConditions && step.stepConditions.length > 0) {
      const stepConditions = step.stepConditions;
      for (let i = 0; i < stepConditions.length; i++) {
        if (index === i) {
          //               if (condition.filter === stepConditions[i].filter) {
          stepConditions.splice(i, 1);
          break;
        }
      }
    }
  }

  _validIsConditionValues(step: any) {
    let isError = false;
    if (step && step.stepConditions && step.stepConditions.length > 0) {
      const stepConditions = step.stepConditions;
      for (let i = 0; i < stepConditions.length; i++) {
        const condtion = stepConditions[i];
        if (condtion.operator === 'range') {
          if (condtion.typeOption.displayType === 'Date') {
            if (condtion.filter && condtion.operator && condtion.value) {
              condtion.isError = false;
            } else {
              isError = true;
              condtion.isError = true;
            }
          } else {
            if (
              condtion.filter &&
              condtion.operator &&
              (condtion.value1 || condtion.value1 === 0) &&
              (condtion.value2 || condtion.value2 === 0)
            ) {
              condtion.isError = false;
            } else {
              isError = true;
              condtion.isError = true;
            }
          }
        } else {
          if (condtion.filter && condtion.operator && (condtion.value || condtion.value === 0)) {
            condtion.isError = false;
          } else {
            isError = true;
            condtion.isError = true;
          }
        }
      }
    }
    return isError;
  }

  _checkIsSelectedEvent(step: any) {
    let selected = false;
    if (step && step.stepConditions && step.stepConditions.length > 0) {
      const firstCondition = step.stepConditions[0];
      if (firstCondition.filter === 'eventid' && firstCondition.operator === 'eq' && firstCondition.value) {
        selected = true;
      }
    }
    return selected;
  }

  formatterInputNumber(value: any, condition: any, field: string) {
    if (value && condition && condition.typeOption && condition.typeOption.displayType) {
      if (condition.typeOption.displayType === 'Integer' && value.toString().indexOf('.') !== -1) {
        setTimeout(() => {
          condition[field] = parseInt(value.toString(), 10);
        }, 10);
      }
    }
    this.initNumberRange(value, condition, field);
  }

  initNumberRange(value: any, condition: any, field: string) {
    setTimeout(() => {
      if (value && condition && condition.typeOption && condition.typeOption.displayType) {
        if (condition.typeOption.displayType === 'Integer' || condition.typeOption.displayType === 'Double') {
          if (
            field === 'value1' &&
            condition['value2'] &&
            parseFloat(condition['value2']) < parseFloat(condition[field])
          ) {
            condition['value2'] = condition[field];
          }
        }
      }
    }, 10);
  }

  addStepCondition(step: any, _condition: any) {
    let isInit = false;
    if (_condition) {
      isInit = true;
    }
    _condition = _condition || {};
    let stepIsError = false;
    step.isError = false;
    if (step && !step.name) {
      stepIsError = true;
      step.isError = true;
    }
    const conditionIsError = this._validIsConditionValues(step);
    if (!isInit && (stepIsError || conditionIsError)) {
      this.message.create('error', '请完成必填项后再添加属性。');
      return false;
    }
    const isSelectedEvent = this._checkIsSelectedEvent(step);
    if (!isInit && !isSelectedEvent) {
      this.message.create('error', '必须为是才能添加属性。');
      return false;
    }

    let condition = {
      filter: null, // es中 字段名
      typeOption: {}, // 默认第一个
      typeOptions: [],
      operator: null, // key和value关系 eq gt lt range like
      value: null, // es中 字段的值
      value1: null,
      value2: null,
      isError: false
    };

    let initTypeOption = {};
    const initTypeOptions = [];
    let initValue = null;
    if (isInit) {
      initTypeOption = this._getOptionByEsfieldname(_condition.filter, step.conditionTypes);
      initTypeOptions.push(initTypeOption);
      const initValues = _condition.values;
      if (_condition.displayType === 'Tag') {
        initValue = initValues;
        condition = {
          filter: _condition.filter || null, // es中 字段名
          typeOption: initTypeOption || {}, // 默认第一个
          typeOptions: step.conditionTypes,
          operator: _condition.operator || null, // key和value关系 eq gt lt range like
          value: initValue, // es中 字段的值
          value1: null,
          value2: null,
          isError: false
        };
      } else if (_condition.displayType === 'String') {
        initValue = _condition.value;
        condition = {
          filter: _condition.filter || null, // es中 字段名
          typeOption: initTypeOption || {}, // 默认第一个
          typeOptions: initTypeOptions,
          operator: _condition.operator || null, // key和value关系 eq gt lt range like
          value: initValue, // es中 字段的值
          value1: null,
          value2: null,
          isError: false
        };
      } else if (_condition.displayType === 'Integer' || _condition.displayType === 'Double') {
        if (_condition.operator === 'range') {
          initValue = _condition.values;
          condition = {
            filter: _condition.filter || null, // es中 字段名
            typeOption: initTypeOption || {}, // 默认第一个
            typeOptions: initTypeOptions,
            operator: _condition.operator || null, // key和value关系 eq gt lt range like
            value: null, // es中 字段的值
            value1: initValue[0],
            value2: initValue[1],
            isError: false
          };
        } else {
          initValue = _condition.value;
          condition = {
            filter: _condition.filter || null, // es中 字段名
            typeOption: initTypeOption || {}, // 默认第一个
            typeOptions: initTypeOptions,
            operator: _condition.operator || null, // key和value关系 eq gt lt range like
            value: initValue, // es中 字段的值
            value1: null,
            value2: null,
            isError: false
          };
        }
      } else if (_condition.displayType === 'Date') {
        if (_condition.operator === 'range') {
          initValue = [];
          if (_condition.values && _condition.values.length === 2) {
            initValue.push(new Date(parseFloat(_condition.values[0])));
            initValue.push(new Date(parseFloat(_condition.values[1])));
          }
        } else {
          initValue = new Date(parseFloat(_condition.value));
        }
        condition = {
          filter: _condition.filter || null, // es中 字段名
          typeOption: initTypeOption || {}, // 默认第一个
          typeOptions: initTypeOptions,
          operator: _condition.operator || null, // key和value关系 eq gt lt range like
          value: initValue, // es中 字段的值
          value1: null,
          value2: null,
          isError: false
        };
      }
    }

    //    if (step.conditionTypes && step.conditionTypes.length > 0
    // && step.conditionTypes.length > step.stepConditions.length) {
    if (step.conditionTypes && step.conditionTypes.length > 1) {
      // 去掉限制重复
      let isFirst = false;
      if (!isInit) {
        for (let i = 0; i < step.conditionTypes.length; i++) {
          //                    const repeat = this._checkConditonRepeat(step.conditionTypes[i], step.stepConditions);
          //        if (!repeat) {//去掉限制重复
          const typeOption = step.conditionTypes[i];
          if (!isFirst && step.conditionTypes[i].esfieldname !== 'eventid') {
            condition.typeOption = typeOption;
            condition.filter = step.conditionTypes[i].esfieldname;
            condition.operator = this._getOperatorByOption(typeOption);
            isFirst = true;
          }
          condition.typeOptions.push(typeOption);
          //        }
        }
      } else {
        /*const typeOption = this._getOptionByEsfieldname(condition.filter, step.conditionTypes);
                if (typeOption) {
                  condition.typeOptions.push(typeOption);
                }*/
      }

      if (condition.filter) {
        step.stepConditions.push(condition);
        this.queryTagValuesByEsfieldname(condition);
      }
    } else {
      // 无可添加的条件
      /*step.isError = true;
            step.errorMsg = '没有属性可以添加了。';*/
      if (!isInit) {
        this.message.create('error', '没有属性可以添加了。');
      }
    }
  }

  _getOperatorByOption(typeOption: any) {
    let operator;
    if (typeOption && typeOption.displayType === 'Tag') {
      operator = this._conditionTagOperators[0].value;
    } else if (typeOption && typeOption.displayType === 'String') {
      operator = this._conditionStringOperators[0].value;
    } else if (
      typeOption &&
      (typeOption.displayType === 'Date' || typeOption.displayType === 'Integer' || typeOption.displayType === 'Double')
    ) {
      operator = this._conditionNumberOperators[0].value;
    }
    return operator;
  }

  _getOptionByEsfieldname(esfieldname: string, list: any[]) {
    let option;
    if (esfieldname && list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (esfieldname === list[i].esfieldname) {
          option = list[i];
          break;
        }
      }
    }
    return option;
  }

  _checkConditonRepeat(condition: any, stepConditions: any[]) {
    let repeat = false;
    if (condition && stepConditions && stepConditions.length > 0) {
      for (let i = 0; i < stepConditions.length; i++) {
        if (condition.esfieldname === stepConditions[i].filter) {
          repeat = true;
          break;
        }
      }
    }
    return repeat;
  }

  changeConditionType(option: any, condition: any) {
    console.dir([option, condition]);
    condition.filter = option.esfieldname;
    condition.operator = this._getOperatorByOption(option) || null;
    condition.value = null;
    this.queryTagValuesByEsfieldname(condition);
  }

  changeConditionOperator(operator: any, condition: any) {
    if (condition.filter === 'eventid') {
      condition.value = null;
    }
    //        this.queryTagValuesByEsfieldname(condition);
  }

  onSelectConditionTag(value: any, condition: any) {
    console.dir([value, condition]);
    let idsValue = null;
    if (value && value.length > 0) {
      idsValue = [];
      for (let i = 0; i < value.length; i++) {
        idsValue.push(value[i].value);
      }
    }
    condition.value = idsValue;
  }

  _arrToString(list: any[]) {
    let str = '';
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (i === list.length - 1) {
          str += list[i];
        } else {
          str += list[i] + ',';
        }
      }
    }
    return str;
  }

  queryTagValuesByEsfieldname(condition: any) {
    if (condition.filter !== 'eventid' && condition.typeOption.displayType === 'Tag') {
      const ids = this._arrToString(condition.value);
      condition.tagSelect = {
        apiUrl: this.service.queryEventPostUrl,
        apiType: 'post',
        apiData: true,
        apiSearch: true,
        apiPaging: true,
        keywordFiled: 'dicItemAliasOrValue',
        initValue: condition.value,
        model: 'multiple',
        apiParam: {
          productId: this.globals.getProductIdByStorage(),
          sort: 'dic_item_alias',
          order: 'asc',
          dicItemKey: condition.filter,
          rows: 20,
          page: 1,
          dicItemAliasOrValue: '',
          ids: ids
        }
      };
    }
  }

  initSteps() {
    this._steps = [];
    if (this._stepsData && this._stepsData.length > 0) {
      for (let i = 0; i < this._stepsData.length; i++) {
        const _step = this._stepsData[i];
        this.addStep(_step);
      }
    } else {
      this.addStep(null);
      this.addStep(null);
    }
  }

  addStep(data: any) {
    this._isValid = false;
    const _step = data || {};

    const step = {
      eventTypeId: _step.eventTypeId || null, // 步骤事件类型id
      stepConditions: [],
      name: _step.name || '',
      conditionTypes: [],
      isError: false,
      errorMsg: ''
    };
    let eventTypeId = null;
    if (this._eventTypes && this._eventTypes.length > 0) {
      eventTypeId = _step.eventTypeId || this._eventTypes[0].id;
      step.eventTypeId = eventTypeId;
      const eventType = this._getItemById(eventTypeId, this._eventTypes);
      step.conditionTypes = this.initConditionTypes(eventType);
      const stepCondition = this._getStepCondtion(step.conditionTypes, _step);
      step.stepConditions.push(stepCondition);
      if (stepCondition.filter === 'eventid') {
        this.queryConditionEventsValues(eventTypeId, '', 1, stepCondition, step);
      }
      if (stepCondition && stepCondition.value) {
        this.queryConditionTypeOptions(stepCondition.value, step, stepCondition, _step);
      }
    }
    if (this._steps.length < 8) {
      this._steps.push(step);
    }
  }

  queryEventTypes() {
    this.service.queryEventTypes().subscribe((response: any) => {
      if (response) {
        this._eventTypes = [];
        if (this.tagName == 'App' || this.tagName == 'H5' || this.tagName == 'Web') {
          for (let i = 0; i < response.list.length; i++) {
            if (
              response.list[i].dicItemValue == '系统预置事件' ||
              response.list[i].dicItemValue == '自定义事件' ||
              response.list[i].dicItemValue == '访问页面'
            ) {
              this._eventTypes.push(response.list[i]);
            }
          }
        } else if (this.tagName == 'miniprogram') {
          for (let i = 0; i < response.list.length; i++) {
            if (
              response.list[i].dicItemValue == '系统预置事件' ||
              response.list[i].dicItemValue == '小程序自定义事件' ||
              response.list[i].dicItemValue == '访问页面' ||
              response.list[i].dicItemValue == '小程序场景事件' ||
              response.list[i].dicItemValue == '小程序扫码事件' ||
              response.list[i].dicItemValue == '小程序分享事件' ||
              response.list[i].dicItemValue == '小程序点击分享Link事件'
            ) {
              this._eventTypes.push(response.list[i]);
            }
          }
        } else {
          this._eventTypes = response.list;
        }
        this.initSteps();
      }
    });
  }

  initConditionTypes(data: any) {
    let label = '';
    if (data) {
      if (data.dicItemAlias) {
        label = data.dicItemAlias + '名称';
      } else if (data.dicItemValue) {
        label = data.dicItemValue + '名称';
      }
    }
    const conditionTypes = [
      {
        esfieldname: 'eventid',
        displayname: label,
        displayType: 'Tag'
      }
    ];
    return conditionTypes;
  }

  initOperators() {
    this._conditionTagEventOperators = [
      {
        value: 'eq',
        label: '是'
      },
      {
        value: 'ne',
        label: '不是'
      }
    ];
    this._conditionTagOperators = [
      {
        value: 'eq',
        label: '等于'
      },
      {
        value: 'ne',
        label: '不等于'
      }
    ];
    this._conditionStringOperators = [
      {
        value: 'eq',
        label: '等于'
      },
      {
        value: 'ne',
        label: '不等于'
      },
      {
        value: 'like',
        label: '包含'
      },
      {
        value: 'notlike',
        label: '不包含'
      }
    ];
    this._conditionNumberOperators = [
      {
        value: 'eq',
        label: '等于'
      },
      {
        value: 'ne',
        label: '不等于'
      },
      {
        value: 'gt',
        label: '大于'
      },
      {
        value: 'ge',
        label: '大于等于'
      },
      {
        value: 'lt',
        label: '小于'
      },
      {
        value: 'le',
        label: '小于等于'
      },
      {
        value: 'range',
        label: '区间'
      }
    ];
  }

  _validStepsValue() {
    let isError = false;
    if (this._steps && this._steps.length > 0) {
      for (let i = 0; i < this._steps.length; i++) {
        const _step = this._steps[i];
        if (!_step.eventTypeId || !_step.name) {
          isError = true;
          _step.isError = true;
          //          break;
          //                } else if (!_step.name) {
          //                    isError = true;
          //                    _step.isError = true;
          //          break;
        }
        if (_step.stepConditions && _step.stepConditions.length > 0) {
          for (let j = 0; j < _step.stepConditions.length; j++) {
            const condition = _step.stepConditions[j];
            if (!condition.filter || !condition.operator) {
              isError = true;
              condition.isError = true;
              //              break;
              //                        } else if (!condition.operator) {
              //                            isError = true;
              //                            condition.isError = true;
              //              break;
            } else {
              if (condition.operator === 'range') {
                if (condition.typeOption.displayType === 'Date') {
                  if (!condition.value || condition.value.length < 2) {
                    isError = true;
                    condition.isError = true;
                  }
                } else {
                  if ((!condition.value1 && condition.value1 !== 0) || (!condition.value2 && condition.value2 !== 0)) {
                    isError = true;
                    condition.isError = true;
                  }
                }
              } else {
                if (!condition.value && condition.value !== 0) {
                  isError = true;
                  condition.isError = true;
                }
              }
              //              break;
            }
          }
        }
      }
    }
    return isError;
  }

  _buildStepsBack() {
    this._stepsBack = [];
    if (this._steps && this._steps.length > 0) {
      for (let i = 0; i < this._steps.length; i++) {
        const _step = this._steps[i];
        const stepItem = {
          eventTypeId: _step.eventTypeId,
          stepConditions: [],
          name: _step.name
        };
        if (_step.stepConditions && _step.stepConditions.length > 0) {
          for (let j = 0; j < _step.stepConditions.length; j++) {
            const condition = _step.stepConditions[j];
            const displayType = condition.typeOption.displayType;
            const operator = condition.operator;
            let values = [];
            if (displayType !== 'Tag' && displayType !== 'String') {
              if (displayType === 'Date') {
                if (operator === 'range') {
                  if (condition.value && condition.value.length === 2) {
                    const value1 = this.globals.getDateZeroTime(condition.value[0]);
                    const value2 = this.globals.getDateZeroTime(condition.value[1]);
                    values.push(value1);
                    values.push(value2);
                  }
                } else {
                  values.push(this.globals.getDateZeroTime(condition.value));
                }
              } else {
                if (operator === 'range') {
                  values.push(condition.value1);
                  values.push(condition.value2);
                } else {
                  values.push(condition.value);
                }
              }
            } else if (displayType === 'Tag') {
              if (condition.filter === 'eventid') {
                values.push(condition.value);
              } else {
                values = condition.value;
              }
            } else if (displayType === 'String') {
              values.push(condition.value);
            }
            stepItem.stepConditions.push({
              filter: condition.filter,
              operator: operator,
              values: values,
              displayType: displayType
            });
          }
        }
        this._stepsBack.push(stepItem);
      }
    }
  }

  _onBack() {
    const isError = this._validStepsValue();
    if (!isError) {
      this._buildStepsBack();
      setTimeout(() => {
        this.onBack.emit(this._stepsBack);
      }, 10);
    } else {
      this.message.create('error', '请完成必填项后再保存。');
      setTimeout(() => {
        this.onBack.emit(null);
      }, 10);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this._isSubmit = false;
    if (changes.data && changes.data.currentValue) {
      this._stepsData = changes.data.currentValue;
      this.initSteps();
    }
    if (changes.isSubmit) {
      this._isSubmit = changes.isSubmit.currentValue;
    }
    if (this._isSubmit) {
      this._isValid = true;
      this._onBack();
    }
    if (changes.funnelOrder) {
      this._funnelOrder = changes.funnelOrder.currentValue;
    }
  }

  ngOnInit() {
    this.initOperators();
    this.queryEventTypes();
  }
}
