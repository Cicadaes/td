import { Component, OnInit } from '@angular/core';
import { EarlyWarningService } from '../early-warning.service';
import { CommonService } from 'src/app/common/services/common.service';

@Component({
  selector: 'app-warning-history',
  templateUrl: './warning-history.component.html',
  styleUrls: ['./warning-history.component.less']
})
export class WarningHistoryComponent implements OnInit {
  tableData: any;
  pageIndex = 1;
  total = 0;
  pageSize = 10;
  loading = false;
  queryParams: any = {};
  moreSearch = false;
  searchValue: any;
  order: any;
  filterObj: any = {
    alarmType: null,
    effectStatus: null
  };

  alarmTypeList = [
    {
      label: '全部',
      value: null
    },
    {
      label: '业务指标预警',
      value: 1
    },
    {
      label: '营销效果预警',
      value: 2
    }
  ];

  effectStatusList = [
    {
      label: '全部',
      value: null
    },
    {
      label: '待运行',
      value: 0
    },
    {
      label: '运行中',
      value: 1
    },
    {
      label: '已暂停',
      value: 2
    },
    {
      label: '已结束',
      value: 3
    }
  ];
  constructor(private service: EarlyWarningService, private commonService: CommonService) {}

  ngOnInit() {
    this.refreshData(true);
  }

  // 新建预警规则
  add() {}

  // 是否显示高级搜索框
  showMoreFilter() {
    this.moreSearch = !this.moreSearch;
  }

  // 按照更新时间排序
  sort(sort: { key: string; value: string }): void {
    if (sort && sort.value) {
      if (this.order === sort.value) {
        return;
      }

      this.order = sort.value;
      if (sort.value === 'descend') {
        this.queryParams = { orderBy: 'updateTime', order: 'desc' };
      } else {
        this.queryParams = { orderBy: 'updateTime', order: 'asc' };
      }

      if (this.searchValue) {
        this.queryParams['alarmName'] = this.searchValue;
      }

      this.refreshData();
    }
  }

  // 根据规则名称模糊搜索
  onSearch(event: any, type: any) {
    const that = this;
    if (type === 'click') {
      if (event) {
        event = event.replace(/(^\s*)|(\s*$)/g, '');
      }
      that.queryParams['alarmName'] = event;
      that.refreshData(true);
    } else {
      if (event.keyCode === 13) {
        if (that.searchValue) {
          that.searchValue = that.searchValue.replace(/(^\s*)|(\s*$)/g, '');
        }
        that.queryParams['alarmName'] = that.searchValue;
        that.refreshData(true);
      }
    }
  }

  handlerFilter(value: any) {
    for (const key in value) {
      if (key === 'updateTime') {
        let startTimeBegin;
        let startTimeEnd;
        if (value[key] && value[key].length && value[key][0]) {
          const date1 = value[key][0];
          startTimeBegin = this.commonService.getDateStr(date1);
        }
        if (value[key] && value[key].length && value[key][1]) {
          const date2 = value[key][1];
          startTimeEnd = this.commonService.getDateStr(date2);
        }
        this.queryParams['updateTimeBegin'] = startTimeBegin;
        this.queryParams['updateTimeEnd'] = startTimeEnd;
      } else {
        this.queryParams[key] = value[key];
      }
    }
    this.refreshData();
  }

  // 查询接口列表
  refreshData(reset = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    // this.loading = true;
    const params = {};
    params['page'] = this.pageIndex;
    params['pageSize'] = this.pageSize;
    for (const key in this.queryParams) {
      if (this.queryParams[key]) {
        params[key] = this.queryParams[key];
      }
    }

    this.tableData = [
      {
        alarmName: '规则名称',
        alarmType: 1,
        updateTime: '2018-12-20 00:00:00',
        creator: '李欣',
        effectStatus: 0,
        description: '欧洲杯期间两个月时间进行活动宣传推广促动'
      },
      {
        alarmName: '规则名称1',
        alarmType: 2,
        updateTime: '2018-12-20 00:00:00',
        creator: '李欣',
        effectStatus: 1,
        description:
          '欧洲杯期间两个欧洲杯期间两个月时间进行活动宣传推广促动欧洲杯期间两个月时间进行活动宣传推广促动欧洲杯期间两个月时间进行活动宣传推广促动欧洲杯期间两个月时间进行活动宣传推广促动月时间进行活动宣传推广促动'
      },
      {
        alarmName: '规则名称1',
        alarmType: 2,
        updateTime: '2018-12-20 00:00:00',
        creator: '李欣',
        effectStatus: 2,
        description: '欧洲杯期间两个月时间进行活动宣传推广促动'
      },
      {
        alarmName: '规则名称1',
        alarmType: 2,
        updateTime: '2018-12-20 00:00:00',
        creator: '李欣',
        effectStatus: 3,
        description: '欧洲杯期间两个月时间进行活动宣传推广促动'
      }
    ];
    this.total = this.tableData.length;
    // console.log(params);
    // this.service.getWarningRule(params).subscribe((response: any) => {
    //     if (response.code === 200) {
    //         this.loading = false;
    //         this.tableData = response.data.data;
    //         this.total = response.data.total;
    //     }
    // });
  }
}
