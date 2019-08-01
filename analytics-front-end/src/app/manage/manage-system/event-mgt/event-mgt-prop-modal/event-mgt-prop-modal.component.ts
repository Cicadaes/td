import { Component, Input } from '@angular/core';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../../../common/config/page.size.config';
import { EventMgtService } from '../event-mgt.service';

let $scope;

@Component({
  selector: 'app-event-mgt-prop-modal',
  templateUrl: './event-mgt-prop-modal.component.html',
  styleUrls: ['./event-mgt-prop-modal.component.less'],
  providers: [EventMgtService]
})
// zhanghong code
export class EventMgtPropModalComponent {
  public productId: any;
  public nls: any;
  public vm: any;

  @Input() set _productId($value: any) {
    $scope.productId = $value;
  }

  @Input() set _data($value: any) {
    $scope.vm.baseInfo.sourceName = $value.sourceName;
    $scope.vm.baseInfo.displayName = $value.displayName;
    $scope.vm.content.dataBySearch = $value;

    if ($scope.productId) {
      $scope.initContentData();
    }
  }

  constructor(private eventMgtService: EventMgtService) {
    this.nls = {
      baseInfoSourceName: '事件名称：',
      baseInfoDisplayName: '显示名：',
      contentPropName: '属性名称',
      contentPropCode: '属性编码',
      contentPropType: '属性类型'
    };

    this.vm = {
      baseInfo: {
        sourceName: undefined,
        displayName: undefined
      },

      content: {
        data: [],
        dataBySearch: {},
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        pageSizeOption: TABLE_PAGE_SIZE_OPTIONS,
        loading: false
      }
    };

    $scope = this;
  }

  /**
   * 初始化
   */
  initContentData($next?: any) {
    const p = {
      productId: $scope.productId,
      id: $scope.vm.content.dataBySearch.id,
      pageIndex: $scope.vm.content.pageIndex,
      pageSize: $scope.vm.content.pageSize,
      eventname: $scope.vm.content.dataBySearch.sourceName
    };

    $scope.vm.content.loading = true;
    $scope.eventMgtService.req_getEventAttrList(p).subscribe(
      (response: any) => {
        let a, b, i;
        for (a = [], i = 0; (b = response.list[i]); i++) {
          a.push({
            propName: b.attriname,
            propCode: b.column,
            propType: b.attritype
          });
        }

        a.total = response.total;

        $scope.vm.content.data = a;
        $scope.vm.content.total = a.total;
        $scope.vm.content.loading = false;
      },
      (error: any) => {
        $scope.vm.content.loading = false;
      }
    );
  }

  /**
   * 处理内容
   */
  handlerContent_pageIndex($i: any) {
    ($scope.vm.content.pageIndex = $i), $scope.initContentData();
  }

  handlerContent_pageSize($i: any) {
    ($scope.vm.content.pageIndex = 1), ($scope.vm.content.pageSize = $i), $scope.initContentData();
  }
}
