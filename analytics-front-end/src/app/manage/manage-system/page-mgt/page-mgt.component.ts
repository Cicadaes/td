import { Component, Injector, OnInit } from '@angular/core';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../../common/config/page.size.config';
import { PageMgtService } from './page-mgt.service';
import { BaseComponent } from '../../../common/base-component';

let $scope;

@Component({
  selector: 'app-page-mgt',
  templateUrl: './page-mgt.component.html',
  styleUrls: ['./page-mgt.component.less'],
  providers: [PageMgtService]
})
// zhanghong code
export class PageMgtComponent extends BaseComponent implements OnInit {
  public nls: any;
  public vm: any;

  constructor(private injector: Injector, private pageMgtService: PageMgtService) {
    super(injector);
    $scope = this;
  }

  ngOnInit() {
    $scope.nls = {
      header: '页面管理',
      searchPlatform: '平台：',
      searchPlatformPlaceholder: '请选择平台',
      searchName: '页面：',
      searchNamePlaceholder: '请输入页面名称 / 显示名',
      searchQuery: '查询',
      searchAdvanced: '搜索条件',
      contentSourceName: '页面名称',
      contentDisplayName: '显示名'
    };

    $scope.vm = {
      search: {
        platformSelect: [],
        platformValue: null,
        nameValue: undefined,
        advanced: true // 2018/6/21
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
      $scope.queryPlatforms();
    }
  }

  queryPlatforms() {
    const param = {
      productId: $scope.productId,
      dicItemKey: '_td_sdk_source'
    };
    $scope.pageMgtService.getPlatforms(param).subscribe((response: any) => {
      if (response && response.list && response.list.length > 0) {
        $scope.vm.search.platformValue = response.list[0].id;
        for (let i = 0; i < response.list.length; i++) {
          $scope.vm.search.platformSelect.push({
            value: response.list[i].id,
            label: response.list[i].dicItemValue
          });
        }
      }
      $scope.initContentData();
    });
  }

  /**
   * 初始化
   */
  initContentData($next?: any) {
    const p = {
      productId: $scope.productId,
      platformValue: $scope.vm.search.advanced && $scope.vm.search.platformValue,
      nameValue: $scope.vm.search.nameValue,
      pageIndex: $scope.vm.content.pageIndex,
      pageSize: $scope.vm.content.pageSize
    };

    $scope.vm.content.loading = true;
    $scope.pageMgtService.post_getPageList(p).subscribe((response: any) => {
      let a, b, i;
      for (a = [], i = 0; (b = response.list[i]); i++) {
        a.push({
          id: b.id,
          sourceName: b.dicItemValue,
          displayName: b.dicItemAlias
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
  handlerSearch($event: any) {
    if ($scope.vm.search.advanced || $event.keyCode === 13) {
      $scope.vm.content.pageIndex = 1;
      $scope.initContentData();
    }
  }

  handlerSearch_advanced() {
    $scope.vm.search.advanced = !$scope.vm.search.advanced;
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
    $scope.pageMgtService.post_updatePage(p).subscribe((response: any) => {
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

  handlerContent_pageIndex($i: any) {
    ($scope.vm.content.pageIndex = $i), $scope.initContentData();
  }

  handlerContent_pageSize($i: any) {
    ($scope.vm.content.pageIndex = 1), ($scope.vm.content.pageSize = $i), $scope.initContentData();
  }
}
