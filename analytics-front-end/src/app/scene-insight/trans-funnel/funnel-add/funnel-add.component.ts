import { Component, Injector, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FunnelAddService } from './funnel-add.service';
import { BaseComponent } from '../../../common/base-component';

let $scope;

@Component({
  selector: 'app-funnel-add',
  templateUrl: './funnel-add.component.html',
  styleUrls: ['./funnel-add.component.less'],
  providers: [FunnelAddService]
})
export class FunnelAddComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() isInDialog: any;
  @Output() onHide = new EventEmitter<any>();
  public funnelId: any;
  public nls: any;
  public vm: any;
  tagName: any;
  sdkId: any;
  isVisitor: boolean;
  urlParams: any;
  systemError: any = {
    isError: false,
    msg: ''
  };

  isSaving: any = false;

  constructor(private funnelAddService: FunnelAddService, private injector: Injector) {
    super(injector);

    this.initRouterList('用户档案');

    this.buildUrlParams();
    $scope = this;
  }

  buildUrlParams() {
    this.urlParams = {};
  }

  initSelectEventMap($data: any) {
    $data.eventNameError = false;
    const eventTypeId = $data.eventTypeId || '';
    const initValue = $data.eventId || '';
    $data.eventSelect2 = {
      apiUrl: this.funnelAddService.queryEventUrl + $scope.productId,
      apiType: 'post',
      apiData: true,
      apiPaging: true,
      apiSearch: true,
      keywordFiled: 'dicItemAliasOrValue',
      initValue: initValue,
      initFirst: true,
      apiParam: {
        dicItemKey: 'eventid',
        eventTypeId: eventTypeId,
        productId: $scope.productId,
        sdkId: $scope.sdkId,
        id: initValue
      }
    };
  }

  onSelectEvent(option: any, data: any) {
    data.eventNameError = false;
    console.dir([option, data]);
    if (option) {
      data.eventId = option.value;
    }
  }

  ngOnInit() {
    // 使用 funnelId 作为编辑的标记
    $scope.funnelId = $scope.route.snapshot.routeConfig.path === 'edit' && $scope.route.snapshot.params['funnelId'];
    $scope.tagName = $scope.route.snapshot.params['tag'] || '';
    $scope.isVisitor = $scope.route.snapshot.params['isVisitor'] == 'true' ? true : false;
    $scope.sdkId = $scope.route.snapshot.params['sdkId'] || '';
    if (!this.isInDialog) {
      if (
        $scope.isVisitor &&
        $scope.tagName !== 'App' &&
        $scope.tagName !== 'H5' &&
        $scope.tagName !== 'miniprogram' &&
        $scope.tagName !== 'Web'
      ) {
        this.commonService.goInto({
          name: '添加漏斗',
          url: `/scene-insight/trans-funnel`
        });
      }
    }
    $scope.nls = {
      headerByAdd: $scope.tagName === 'miniprogram' ? '添加小程序漏斗' : `添加${$scope.tagName}漏斗`,

      headerByEdit: $scope.tagName === 'miniprogram' ? '编辑小程序漏斗' : `编辑${$scope.tagName}漏斗`,
      inputName: '漏斗名称',
      inputNamePlaceholder: '请输入漏斗名称',
      inputStepTooltip:
        '以用户逐步执行的事件或访问页面为依据，构造最少2个步骤的转化漏斗，系统将逐步过滤，计算出用户在整个过程中的转化率。',
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

    $scope.vm = {
      form: {
        nameValue: undefined,
        nameError: false,
        stepValue: [],
        stepSelect_eventType: [],
        stepSelect_eventName: {}
      }
    };

    // 开始
    $scope.initStepValue(function() {
      $scope.initStepSelect_eventType(function() {
        let a, b, i;
        if ($scope.vm.form.stepValue) {
          for (a = $scope.vm.form.stepValue, i = 0; (b = a[i]); i++) {
            $scope.handlerEventTypeChange(b, false, i);
          }
        } else {
          let eventTypeId = null;
          if ($scope.vm.form.stepSelect_eventType.length > 0) {
            eventTypeId = $scope.vm.form.stepSelect_eventType[0].value;
          }
          $scope.vm.form.stepValue = [
            {
              eventId: null,
              eventSelect: null,
              eventSelect2: null,
              eventNameError: false,
              eventTypeError: false,
              eventTypeId: eventTypeId,
              name: ''
            },
            {
              eventId: null,
              eventSelect: null,
              eventSelect2: null,
              eventNameError: false,
              eventTypeError: false,
              eventTypeId: eventTypeId,
              name: ''
            }
          ];
          $scope.initSelectEventMap($scope.vm.form.stepValue[0]);
          $scope.initSelectEventMap($scope.vm.form.stepValue[1]);
        }
      });
    });
  }

  /**
   * 初始化
   */
  initStepValue($next?: any) {
    if (!$scope.funnelId) {
      const obj: any = [
        {
          eventTypeId: undefined,
          eventId: undefined,
          name: undefined
        },
        {
          eventTypeId: undefined,
          eventId: undefined,
          name: undefined
        }
      ];
      obj.name = undefined;

      $scope.vm.form.stepValue = obj.steps;
      $scope.vm.form.nameValue = obj.name;

      // 执行下一步
      if ($next) {
        $next();
      }
    } else {
      $scope.funnelAddService.getStepValue($scope.funnelId).subscribe((response: any) => {
        $scope.vm.form.stepValue = response.list.steps;
        $scope.vm.form.nameValue = response.list.name;

        // 执行下一步
        if ($next) {
          $next();
        }
      });
    }
  }

  initStepSelect_eventType($next?: any) {
    $scope.funnelAddService.getStepSelect_eventType($scope.productId).subscribe((response: any) => {
      let a, b, i;
      for (a = [], i = 0; (b = response.list[i]); i++) {
        a.push({
          label: b.dicItemAlias,
          value: b.id
        });
      }
      // $scope.vm.form.stepSelect_eventType = a;

      $scope.vm.form.stepSelect_eventType = [];
      if (this.tagName == 'App' || this.tagName == 'H5' || this.tagName == 'Web') {
        for (let i = 0; i < a.length; i++) {
          if (a[i].label == '系统预置事件' || a[i].label == '自定义事件' || a[i].label == '访问页面') {
            $scope.vm.form.stepSelect_eventType.push(a[i]);
          }
        }
      } else if (this.tagName == 'miniprogram') {
        for (let i = 0; i < a.length; i++) {
          if (
            a[i].label == '系统预置事件' ||
            a[i].label == '小程序自定义事件' ||
            a[i].label == '访问页面' ||
            a[i].label == '小程序场景事件' ||
            a[i].label == '小程序扫码事件' ||
            a[i].label == '小程序分享事件' ||
            a[i].label == '小程序点击分享Link事件'
          ) {
            $scope.vm.form.stepSelect_eventType.push(a[i]);
          }
        }
      } else {
        $scope.vm.form.stepSelect_eventType = a;
      }
      // 执行下一步
      if ($next) {
        $next();
      }
    });
  }

  initStepSelect_eventName($i: any, $next?: any) {
    const p = {
      productId: $scope.productId,
      eventTypeId: $i,
      sdkId: $scope.sdkId
    };
    $scope.funnelAddService.getStepSelect_eventName(p).subscribe((response: any) => {
      let a, b, i;
      for (a = [], i = 0; (b = response.list[i]); i++) {
        a.push({
          label: b.dicItemAlias,
          value: b.id
          //   smartEvent: true
        });
        $scope.vm.form.stepSelect_eventName[$i] = a;

        // 执行下一步
        if ($next) {
          $next();
        }
      }
    });
  }

  /**
   * 处理改变
   */
  handlerEventTypeChange($data: any, isChange: boolean, index: any) {
    let i;

    if ((i = $data.eventTypeId) && !$scope.vm.form.stepSelect_eventName[i]) {
      // 1. 标记，避免重复请求
      $scope.vm.form.stepSelect_eventName[i] = [];

      // 2. 请求
      //$scope.initStepSelect_eventName(i);
    }

    if (isChange) {
      // 3. 清除事件名称值
      $data.eventId = undefined;
      // $scope.initSelectEventMap($data);
    }
    $scope.initSelectEventMap($data);
  }

  handlerAddStep() {
    const newStep = $scope.funnelAddService.getStepValue_empty();
    if ($scope.vm.form.stepSelect_eventType.length > 0) {
      newStep.eventTypeId = $scope.vm.form.stepSelect_eventType[0].value;
    }
    $scope.initSelectEventMap(newStep);
    $scope.vm.form.stepValue.push(newStep);
  }

  handlerRemoveStep($i: any) {
    $scope.vm.form.stepValue.splice($i, 1);
  }

  /**
   * 处理检查
   */
  handlerInputCheck_nameError() {
    this.systemError = {
      isError: false,
      msg: ''
    };

    return ($scope.vm.form.nameError = !$scope.vm.form.nameValue);
  }

  handlerInputCheck_stepPropError($step: any, $prop: any) {
    switch ($prop) {
      case 'eventTypeId':
        return ($step.eventTypeError = !$step.eventTypeId);

      case 'eventId':
        return ($step.eventNameError = !$step.eventId);
    }
  }

  handlerSubmitCheck() {
    let a, b, i;

    // 名称
    if ($scope.handlerInputCheck_nameError()) {
      a = true;
    }
    if ($scope.vm.form.stepValue && $scope.vm.form.stepValue.length > 0) {
      for (i = 0; (b = $scope.vm.form.stepValue[i]); i++) {
        // 事件类型
        if ($scope.handlerInputCheck_stepPropError(b, 'eventTypeId')) {
          a = true;
        }

        // 事件名称
        if ($scope.handlerInputCheck_stepPropError(b, 'eventId')) {
          a = true;
        }
      }
    }
    return !a;
  }

  /**
   * 处理提交
   */
  handlerSubmit() {
    const _this1 = this;
    if (this.isSaving) {
      return;
    }
    if (!$scope.sdkId && $scope.isVisitor) {
      $scope.message.create('warning', '缺少sdkId参数');
      this.commonService.goInto({
        name: '添加漏斗',
        url: `/scene-insight/trans-funnel`
      });
      return;
    }
    if ($scope.handlerSubmitCheck()) {
      const p = {
        funnelId: $scope.funnelId,
        nameValue: $scope.vm.form.nameValue,
        stepValue: $scope.vm.form.stepValue,
        stepSelect_eventType: $scope.vm.form.stepSelect_eventType,
        stepSelect_eventName: $scope.vm.form.stepSelect_eventName,
        sdkId: $scope.sdkId
      };
      this.isSaving = true;
      $scope.funnelAddService.setStepValue(p).subscribe(
        (response: any) => {
          this.isSaving = false;
          const a = {
            success: response.success,
            message: response.msg
          };
          if (a.success) {
            $scope.message.create('success', a.message);
            _this1._goPage();
          } else {
            $scope.message.create('error', a.message);
          }
        },
        (error: any) => {
          this.isSaving = false;
        }
      );
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
