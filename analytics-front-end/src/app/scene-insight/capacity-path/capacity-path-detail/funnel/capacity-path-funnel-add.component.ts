import { Component, Injector, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../../common/base-component';
import { CapacityPathFunnelAddService } from './capacity-path-funnel-add.service';

@Component({
  selector: 'app-capacity-path-funnel-add',
  templateUrl: './capacity-path-funnel-add.component.html',
  styleUrls: ['./capacity-path-funnel-add.component.less'],
  providers: [CapacityPathFunnelAddService]
})
export class CapacityPathFunnelAddComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() isInDialog: any;
  @Input() eventList: any;
  @Input() param: any;
  @Output() onHide = new EventEmitter<any>();
  systemError: any = {
    isError: false,
    msg: ''
  };
  isSaving: any = false;
  _eventList: any[];
  _eventTypeMap: any = {};
  _funnelParam: any = {};
  vm: any = {
    form: {
      nameValue: null,
      nameError: false,
      stepValue: []
    }
  };
  nls: any = {
    headerByAdd: '添加漏斗',
    inputName: '漏斗名称',
    inputNamePlaceholder: '请输入漏斗名称',
    inputStepTooltip:
      '以用户逐步执行的事件或访问页面为依据，构造最少2个步骤，最多8个步骤的转化漏斗，系统将逐步过滤，计算出用户在整个过程中的转化率。',
    inputStepLabel: 'step',
    inputStepHeader1: '步骤',
    inputStepBefore1: '追踪依据',
    inputStepBefore2: '是',
    inputStepBefore3: '步骤名称',
    inputStepPlaceholder1: '请选择事件类型',
    inputStepPlaceholder2: '请选择',
    inputStepNamePlaceholder: '请输入步骤名称',
    inputStepAdd: '添加步骤',
    submit: '保存',
    cancel: '取消'
  };

  constructor(private service: CapacityPathFunnelAddService, private injector: Injector) {
    super(injector);
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.eventList && changes.eventList.currentValue) {
      this._eventList = changes.eventList.currentValue;
    }
    if (changes.param && changes.param.currentValue) {
      this._funnelParam = changes.param.currentValue;
    }
    this._queryEventTypes();
  }

  _getIdsByList(list: any[]) {
    const ids = [];
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        ids.push(list[i].value);
      }
    }
    return ids;
  }

  _queryEventTypes() {
    const eventIds = this._getIdsByList(this._eventList);
    this.service.queryEventType(eventIds).subscribe((response: any) => {
      if (response && response.list) {
        this._eventTypeMap = response.list;
        this.vm.form.stepValue = this._getStepValue(this._eventList);
      }
    });
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

  _getStepValue(eventList: any[]) {
    const steps = [];
    if (eventList && eventList.length > 0) {
      for (let i = 0; i < eventList.length; i++) {
        const _event = eventList[i];
        steps.push({
          eventTypeId: this._eventTypeMap[_event.value]['id'],
          eventTypeName: this._eventTypeMap[_event.value]['dicItemValue'],
          eventId: _event.value,
          eventName: this._getObjectByValue(_event.value, this._eventList)['label'],
          stepName: ''
        });
      }
    }
    return steps;
  }

  /**
   * 处理检查
   */
  handlerInputCheck_nameError() {
    this.systemError = {
      isError: false,
      msg: ''
    };
    return (this.vm.form.nameError = !this.vm.form.nameValue);
  }

  handlerInputCheck_stepPropError($step: any, $prop: any) {
    switch ($prop) {
      case 'eventTypeId':
        return ($step.eventTypeError = !$step.eventTypeId);
      case 'eventId':
        return ($step.eventNameError = !$step.eventId);
      case 'stepName':
        return ($step.stepNameError = !$step.stepName);
    }
  }

  handlerSubmitCheck(selectedSteps: any[]) {
    let a, b, i;
    if (selectedSteps && selectedSteps.length > 0) {
      for (i = 0; (b = selectedSteps[i]); i++) {
        // 事件类型
        if (this.handlerInputCheck_stepPropError(b, 'eventTypeId')) {
          a = true;
        }
        // 事件名称
        if (this.handlerInputCheck_stepPropError(b, 'eventId')) {
          a = true;
        }
        // 步骤名
        if (this.handlerInputCheck_stepPropError(b, 'stepName')) {
          a = true;
        }
      }
    }
    return !a;
  }

  _getSteps(steps: any) {
    const _steps = [];
    if (steps && steps.length > 0) {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        _steps.push({
          eventTypeId: step.eventTypeId,
          name: step.stepName,
          stepConditions: [
            {
              filter: 'eventid',
              operator: 'eq',
              values: [step.eventId],
              displayType: 'Tag'
            }
          ]
        });
      }
    }
    return _steps;
  }

  _getFunnelParams(selectedSteps: any[]) {
    const params = {
      id: null,
      productId: this.productId,
      name: this.vm.form.nameValue,
      dateRange: this._funnelParam.dateRange || '',
      funnelOrder: '1',
      sdkId: this._funnelParam.sourceid || null,
      steps: this._getSteps(selectedSteps)
    };
    return params;
  }

  _getSelectedSteps(steps: any[]) {
    const selectedSteps = [];
    if (steps && steps.length > 0) {
      for (let i = 0; i < steps.length; i++) {
        if (steps[i].checked) {
          selectedSteps.push(steps[i]);
        }
      }
    }
    return selectedSteps;
  }

  /**
   * 处理提交
   */
  handlerSubmit() {
    const _this1 = this;
    if (this.isSaving) {
      return;
    }
    if (this.handlerInputCheck_nameError()) {
      this.message.create('warning', this.nls.inputNamePlaceholder);
      return;
    }
    const selectedSteps = this._getSelectedSteps(this.vm.form.stepValue);
    if (selectedSteps.length === 0) {
      this.message.create('warning', '请勾选生成转化漏斗的步骤。');
      return;
    } else if (selectedSteps.length < 2) {
      this.message.create('warning', '转化漏斗最少2个步骤。');
      return;
    } else if (selectedSteps.length > 8) {
      this.message.create('warning', '转化漏斗最多8个步骤。');
      return;
    }
    if (this.handlerSubmitCheck(selectedSteps)) {
      const p = this._getFunnelParams(selectedSteps);
      this.isSaving = true;
      this.service.add(p).subscribe(
        (response: any) => {
          this.isSaving = false;
          if (response.success) {
            this.message.create('success', response.msg);
            _this1._goPage();
          } else {
            this.message.create('error', response.msg);
          }
        },
        (error: any) => {
          this.isSaving = false;
        }
      );
    } else {
      this.message.create('warning', '请完成必填项后再保存。');
    }
  }

  _goPage() {
    if (this.isInDialog) {
      this.onHide.emit(true);
    } else {
      this.goBack();
    }
  }

  handlerCancel() {
    this._goPage();
  }
}
