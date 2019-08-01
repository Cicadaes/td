import { Component, Injector, OnInit } from '@angular/core';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../../common/config/page.size.config';
import { ActivityMgtService } from './activity-mgt.service';
import { BaseComponent } from '../../../common/base-component';

let $scope;

@Component({
  selector: 'app-activity-mgt',
  templateUrl: './activity-mgt.component.html',
  styleUrls: ['./activity-mgt.component.less'],
  providers: [ActivityMgtService]
})
// zhanghong code
export class ActivityMgtComponent extends BaseComponent implements OnInit {
  public nls: any;
  public vm: any;

  constructor(private injector: Injector, private activityMgtService: ActivityMgtService) {
    super(injector);

    $scope = this;
  }

  ngOnInit() {
    $scope.nls = {
      header: '活动管理',
      searchNamePlaceholder: '请输入活动名称 / 显示名',
      contentSourceName: '活动名称',
      contentDisplayName: '显示名',
      contentRegisterDateName: '登记日期',
      contentHiddenSource: '隐藏活动',
      contentDisplay: '显示',
      contentHidden: '隐藏'
    };

    $scope.vm = {
      search: {
        sourceNameValue: undefined
      },

      content: {
        data: [],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        pageSizeOption: TABLE_PAGE_SIZE_OPTIONS,
        loading: true
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
      sourceNameValue: $scope.vm.search.sourceNameValue,
      pageIndex: $scope.vm.content.pageIndex,
      pageSize: $scope.vm.content.pageSize
    };

    $scope.vm.content.loading = true;
    $scope.activityMgtService.post_getCampaignList(p).subscribe((response: any) => {
      let a, b, i;
      for (a = [], i = 0; (b = response.list[i]); i++) {
        a.push({
          id: b.id,
          sourceName: b.dicItemValue,
          displayName: b.dicItemAlias,
          registerDate: this.globals.dateFormat(b.createTime, 'seconds'),
          status: b.status
        });
      }
      a.total = response.total;

      $scope.vm.content.data = a;
      $scope.vm.content.total = a.total;
      $scope.vm.content.loading = false;
    });
  }

  /**
   * 处理搜索
   */
  handlerSearch(value: any) {
    $scope.vm.search.sourceNameValue = value;
    $scope.vm.content.pageIndex = 1;
    $scope.initContentData();
  }

  /**
   * 处理内容
   */
  handlerContent_displayNameEdit($data: any, $power?: any) {
    if ($power !== undefined) {
      // 保存
      if ($power) {
        $scope.handlerContent_displayNameUpdate($data);
      } else {
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
      dicItemValue: $data.sourceName
    };

    $data._displayName.loading = true;
    $scope.activityMgtService.post_update_activity(p).subscribe((response: any) => {
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

  handlerContent_status($data: any, $power: any) {
    const p = {
      productId: $scope.productId,
      id: $data.id,
      status: $power,
      dicItemValue: $data.sourceName
    };

    $data._status = { loading: true };
    $scope.activityMgtService.post_update_activity(p).subscribe((response: any) => {
      const _data = {
        success: response.success,
        message: response.msg
      };

      $data.status = !_data.success ? !$power : $power;
      delete $data._status;
    });
  }

  handlerContent_pageIndex($i: any) {
    ($scope.vm.content.pageIndex = $i), $scope.initContentData();
  }

  handlerContent_pageSize($i: any) {
    ($scope.vm.content.pageIndex = 1), ($scope.vm.content.pageSize = $i), $scope.initContentData();
  }
}