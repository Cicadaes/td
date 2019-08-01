import { Component, ViewChild, Injector, OnInit } from '@angular/core';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../../common/config/page.size.config';
import { EventMgtDiscontinuationComponent } from './event-mgt-discontinuation/event-mgt-discontinuation.component';
import { EventMgtService } from './event-mgt.service';
import { BaseComponent } from '../../../common/base-component';
import { DomSanitizer } from '@angular/platform-browser';

let $scope;

@Component({
  selector: 'app-event-mgt',
  templateUrl: './event-mgt.component.html',
  styleUrls: ['./event-mgt.component.less'],
  providers: [EventMgtService]
})
// zhanghong code
export class EventMgtComponent extends BaseComponent implements OnInit {
  public nls: any;
  public vm: any;

  @ViewChild(EventMgtDiscontinuationComponent) discontinuation: EventMgtDiscontinuationComponent;

  constructor(
    private injector: Injector,
    private eventMgtService: EventMgtService,
    private domSanitizer: DomSanitizer
  ) {
    super(injector);

    $scope = this;
  }

  ngOnInit() {
    $scope.nls = {
      header: '事件管理',
      headerMenuDescriptionTitle: '说明',
      headerMenuDescription1: '显示名：',
      headerMenuDescription2: '为事件设定一个显示名称，便于分析中进行识别。',
      headerMenuDescription3: '登记日期：',
      headerMenuDescription4: '首次侦测到此事件数据的时间。',
      headerMenuDescription5: '停用：',
      headerMenuDescription6: '停用事件后服务器将不再接收对应 Event ID 的数据，直至事件被恢复使用为止。',
      headerMenuMore1: '导入事件显示名',
      headerMenuMore2: '导出事件显示名',
      searchEventName: '事件：',
      searchEventNamePlaceholder: '请输入事件名称 / 显示名',
      searchEventType: '事件分类：',
      searchEventTypePlaceholder: '请选择',
      searchAppVersion: 'App 版本：',
      searchAppVersionPlaceholder: '请选择 APP 版本',
      searchMiniProgram: '小程序事件：',
      searchMiniProgramPlaceholder: '请选择小程序事件',
      searchQuery: '查询',
      searchAdvanced: '搜索条件',
      contentSourceName: '事件名称',
      contentDisplayName: '显示名',
      contentUnEditableDisplayNameTip: '请到灵动分析页面修改灵动事件名称',
      contentRegisterDate: '登记日期',
      contentOperation: '操作',
      contentLookUp: '查看',
      contentDiscontinuation: '停用',
      modalEventPropTitle: '查看属性',
      modalEventImportTitle: '导入事件'
    };

    $scope.vm = {
      search: {
        eventNameValue: undefined,
        eventTypeSelect: [],
        eventTypeValue: undefined,
        appVersionSelect: [],
        appVersionValue: undefined,
        eventSelectLoading: false,
        miniProgramValue: null,
        miniProgramSelect: [],
        advanced: true // 2018-6-21
      },

      content: {
        data: [],
        dataByEventPropModal: {},
        dataByEventExport: '',
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        pageSizeOption: TABLE_PAGE_SIZE_OPTIONS,
        loading: false
      }
    };

    if ($scope.productId) {
      $scope.initSearchEventType();
      //            $scope.initContentData();
    }
  }

  /**
   * 初始化
   */
  initSearchEventType($next?: any) {
    $scope.eventMgtService.post_getEventTypeList().subscribe((response: any) => {
      let a, b, i;
      for (a = [], i = 0; (b = response.list[i]); i++) {
        a.push({
          label: b.eventtype,
          value: b.eventtype
        });
      }

      $scope.vm.search.eventTypeSelect = a;
      if (a && a.length > 0) {
        $scope.vm.search.eventTypeValue = a[0].value;
      }
      $scope.vm.content.pageIndex = 1;
      if (
        $scope.vm.search.eventTypeValue === '小程序事件' ||
        $scope.vm.search.eventTypeValue === 'App代码事件' ||
        $scope.vm.search.eventTypeValue === 'App灵动事件'
      ) {
        $scope.handlerSearchEventType(true);
      } else {
        $scope.initContentData();
      }
    });
  }

  initContentData($next?: any) {
    const p = {
      productId: $scope.productId,
      eventNameValue: $scope.vm.search.eventNameValue,
      eventTypeValue: ($scope.vm.search.advanced && $scope.vm.search.eventTypeValue) || undefined,
      appVersionValue: ($scope.vm.search.advanced && $scope.vm.search.appVersionValue) || undefined,
      miniprogramEventTypeId: ($scope.vm.search.advanced && $scope.vm.search.miniProgramValue) || null,
      pageIndex: $scope.vm.content.pageIndex,
      pageSize: $scope.vm.content.pageSize,
      status: 1
    };

    $scope.vm.content.loading = true;
    $scope.eventMgtService.post_getEventList(p).subscribe(
      (response: any) => {
        let a, b, i;
        for (a = [], i = 0; (b = response.list[i]); i++) {
          a.push({
            id: b.eventid,
            sourceName: b.eventname,
            displayName: b.eventalias,
            registerDate: b.createTime.slice(0, -2),
            updateTime: b.updateTime.slice(0, -2),
            editableDisplayName:
              b.eventtype !== 'App灵动事件' && b.eventtype !== 'H5灵动事件' && b.eventtype !== '小程序事件',
            lingDongFlag: b.eventtype === 'App灵动事件' || b.eventtype === 'H5灵动事件'
          });
        }

        a.total = response.total;

        if (a) {
          $scope.vm.content.data = a;
          $scope.vm.content.total = a.total;

          if ($scope.vm.content.pageIndex !== 1 && a.length === 0) {
            $scope.vm.content.pageIndex = 1;
            $scope.initContentData();
          }
        }
        $scope.vm.content.loading = false;
      },
      (error: any) => {
        $scope.vm.content.loading = false;
      }
    );
  }

  /**
   * 处理搜索
   */
  handlerSearch($event: any) {
    if ($scope.vm.search.advanced || $event.keyCode === 13) {
      $scope.vm.content.pageIndex = 1;
      $scope.initContentData();
    }
  }

  handlerSearchEventType($init: any) {
    $scope.vm.search.miniProgramValue = null;
    $scope.vm.search.appVersionValue = null;
    if ($scope.vm.search.eventTypeValue === '小程序事件') {
      $scope.handlerSearchMiniprogramEventTypeList($init);
    } else if ($scope.vm.search.eventTypeValue === 'App代码事件' || $scope.vm.search.eventTypeValue === 'App灵动事件') {
      $scope.handlerSearchAppVersion($init);
    }
  }

  handlerSearchMiniprogramEventTypeList($init: any) {
    $scope.vm.search.eventSelectLoading = true;
    $scope.eventMgtService.post_getMiniprogramEventTypeList().subscribe(
      (response: any) => {
        const a = [];
        let b, i;
        if (response && response.list && response.list.length > 0) {
          for (i = 0; (b = response.list[i]); i++) {
            a.push({
              label: b.dicItemAlias,
              value: b.id
            });
          }
          $scope.vm.search.miniProgramValue = a[0].value;
        }
        $scope.vm.search.miniProgramSelect = a;
        $scope.vm.search.appVersionValue = null;
        $scope.vm.search.eventSelectLoading = false;
        if ($init) {
          $scope.initContentData();
        }
      },
      (error: any) => {
        $scope.vm.search.eventSelectLoading = false;
      }
    );
  }

  handlerSearchAppVersion($init: any) {
    $scope.vm.search.eventSelectLoading = true;
    $scope.eventMgtService.post_getAppVersionList($scope.vm.search.eventTypeValue).subscribe(
      (response: any) => {
        const a = [];
        let b, i;
        if (response && response.list && response.list.length > 0) {
          for (i = 0; (b = response.list[i]); i++) {
            a.push({
              label: b.version,
              value: b.version
            });
          }
        }

        $scope.vm.search.appVersionSelect = a;
        $scope.vm.search.appVersionValue = null;
        $scope.vm.search.miniProgramValue = null;
        $scope.vm.search.eventSelectLoading = false;
        if ($init) {
          $scope.initContentData();
        }
      },
      (error: any) => {
        $scope.vm.search.eventSelectLoading = false;
      }
    );
  }

  handlerSearch_advanced() {
    $scope.vm.search.advanced = !$scope.vm.search.advanced;
  }

  /**
   * 处理内容
   */
  handlerContent_displayNameEdit($data: any, $power?: any) {
    if ($power !== undefined) {
      if ($power) {
        // 保存
        $scope.handlerContent_displayNameUpdate($data);
      } else {
        // 取消
        delete $data._displayName;
      }
    } else {
      $data._displayName = { value: $data.displayName, loading: false };
    }
  }

  handlerContent_displayNameUpdate($data: any) {
    const p = {
      productId: $scope.productId,
      id: $data.id,
      displayName: $data._displayName.value,
      eventname: $data.sourceName
    };

    $data._displayName.loading = true;
    $scope.eventMgtService.post_updateEvent(p).subscribe((response: any) => {
      const _data = {
        success: response.success,
        message: response.msg
      };

      if (_data.success) {
        $data.displayName = $data._displayName.value;
      }
      delete $data._displayName;
    });
  }

  handlerContent_discontinuation($data: any) {
    const p = {
      productId: $scope.productId,
      id: $data.id,
      status: 0,
      eventname: $data.sourceName
    };

    $data._status = { loading: true };
    $scope.eventMgtService.post_updateEvent(p).subscribe((response: any) => {
      const _data = {
        success: response.success,
        message: response.msg
      };

      if (_data.success) {
        // 刷新主列表
        $scope.initContentData();
        // 刷新已停用事件
        $scope.discontinuation.handlerContent_refresh();
      }
    });
  }

  handlerContent_pageIndex($i: any) {
    ($scope.vm.content.pageIndex = $i), $scope.initContentData();
  }

  handlerContent_pageSize($i: any) {
    ($scope.vm.content.pageIndex = 1), ($scope.vm.content.pageSize = $i), $scope.initContentData();
  }

  handlerContent_refresh() {
    /* $scope.vm.search.eventNameValue     = undefined;
         $scope.vm.search.eventTypeValue     = undefined;
         $scope.vm.search.appVersionValue    = undefined;
         $scope.vm.search.appVersionSelect   = [];*/
    $scope.vm.content.pageIndex = 1;
    $scope.initContentData();
  }

  /**
   * 处理显示对话框
   */
  handlerShowModal_eventProp($data: any, $modal: any) {
    $scope.vm.content.dataByEventPropModal = $data;

    $scope.modalService.create({
      nzTitle: $scope.nls.modalEventPropTitle,
      nzMaskClosable: false,
      nzContent: $modal,
      nzFooter: null,
      nzWidth: 600,
      nzMask: true
    });
  }

  handlerShowModal_eventImport($modal: any) {
    $scope.modalService.create({
      nzTitle: $scope.nls.modalEventImportTitle,
      nzMaskClosable: false,
      nzContent: $modal,
      nzFooter: null,
      nzWidth: 600,
      nzMask: true,
      nzOnCancel: $scope.handlerContent_refresh
    });
  }

  handlerEventExport() {
    $scope.vm.content.dataByEventExport = $scope.domSanitizer.bypassSecurityTrustResourceUrl(
      `/reportservice/ExportEventExcelSerlet?productid=${$scope.productId}&eventname=${$scope.vm.search
        .eventNameValue || ''}&eventtype=${$scope.vm.search.eventTypeValue || ''}&version=${$scope.vm.search
        .appVersionValue || ''}&miniprogramEventTypeId=${$scope.vm.search.miniProgramValue || ''}`
    );
  }
}
