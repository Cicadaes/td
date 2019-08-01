import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../../../common/config/page.size.config';
import { EventMgtService } from '../event-mgt.service';
import { Globals } from '../../../../utils/globals';

let $scope;

@Component({
  selector: 'app-event-mgt-discontinuation',
  templateUrl: './event-mgt-discontinuation.component.html',
  styleUrls: ['./event-mgt-discontinuation.component.less'],
  providers: [EventMgtService]
})
// zhanghong code
export class EventMgtDiscontinuationComponent implements OnInit {
  public productId: any;
  public nls: any;
  public vm: any;

  @Output() $recoveryUse = new EventEmitter();

  constructor(public globals: Globals, private eventMgtService: EventMgtService) {
    $scope = this;

    this.productId = this.globals.getProductIdByStorage();
  }

  ngOnInit() {
    $scope.nls = {
      header: '已停用事件（将不再接收以下事件的数据）',
      searchEventNamePlaceholder: '请输入事件名称 / 显示名',
      contentSourceName: '事件名称',
      contentDisplayName: '显示名',
      contentDiscontinuationDate: '停用日期',
      contentOperation: '操作',
      contentRecoveryUse: '恢复使用'
    };

    $scope.vm = {
      search: {
        eventNameValue: undefined
      },

      content: {
        data: [],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        pageSizeOption: TABLE_PAGE_SIZE_OPTIONS,
        loading: false
      }
    };

    if ($scope.productId) {
      $scope.initContentData();
    }
  }

  /**
   * 初始化
   */
  initContentData($next?: any) {
    const p = {
      productId: $scope.productId,
      eventNameValue: $scope.vm.search.eventNameValue,
      pageIndex: $scope.vm.content.pageIndex,
      pageSize: $scope.vm.content.pageSize,
      status: 0
    };

    $scope.vm.content.loading = true;
    $scope.eventMgtService.post_getEventList(p).subscribe((response: any) => {
      let a, b, i;
      for (a = [], i = 0; (b = response.list[i]); i++) {
        a.push({
          id: b.eventid,
          sourceName: b.eventname,
          displayName: b.eventalias,
          registerDate: b.createTime.slice(0, -2),
          updateTime: b.updateTime.slice(0, -2),
          editableDisplayName: b.eventtype !== 'App灵动事件' && b.eventtype !== 'H5灵动事件'
        });
      }

      a.total = response.total;

      $scope.vm.content.data = a;
      $scope.vm.content.total = a.total;
      $scope.vm.content.loading = false;

      if ($scope.vm.content.pageIndex !== 1 && a.length === 0) {
        $scope.vm.content.pageIndex = 1;
        $scope.initContentData();
      }
    });
  }

  /**
   * 处理搜索
   */
  handlerSearch($event: any) {
    if ($event.keyCode === 13) {
      $scope.initContentData();
    }
  }

  /**
   * 处理内容
   */
  handlerContent_recoveryUse($data: any) {
    let p = {
      productId: this.productId,
      id: $data.id,
      status: 1,
      eventname: $data.sourceName
    };

    $data._status = { loading: true };
    $scope.eventMgtService.post_updateEvent(p).subscribe((response: any) => {
      const _data = {
        success: response.success,
        message: response.msg
      };

      if (_data.success) {
        // 刷新已停用事件
        $scope.initContentData();
        // 刷新主列表
        $scope.$recoveryUse.emit();
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
    $scope.vm.search.eventNameValue = undefined;
    $scope.vm.content.pageIndex = 1;
    $scope.initContentData();
  }
}
