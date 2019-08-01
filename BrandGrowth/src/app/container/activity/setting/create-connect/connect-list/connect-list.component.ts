import { Component, OnInit, Output, EventEmitter, Input, Optional, Host } from '@angular/core';
import { indexGroupTab } from '../../../../../utils/index-list-group';
import { Store } from '@ngrx/store';
import * as reducer from '../../../../../ngrx/reducer';
import * as global from '../../../../../ngrx/action/global';
import * as secondLevel from '../../../../../ngrx/action/secondLevel';

import * as moment from 'moment';
import { CreateConnectComponent } from '../create-connect.component'
import { IndicatorsSourceService } from '../../../../../services/source/indicators.source.service'
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';
import { setTimeout } from 'timers';
@Component({
  selector: 'connect-list',
  templateUrl: './connect-list.component.html',
  styleUrls: ['./connect-list.component.less'],
  providers: [
    IndicatorsSourceService,
  ]

})

export class ConnectListComponent implements OnInit {
  private allChecked = false; //是否全选
  private count: any = 0;     //选中几个
  private indexGroupData: any = indexGroupTab(true);
  private checkedOptions: any = []  //选中项
  private parmas: any = {}; //请求所有选项的参数
  private linkId: any;   // 默认选中项id
  private _store: any; //状态管理
  private details:any=[];
  @Input() detail: any = []; //默认被选中项
  @Output() onVoted = new EventEmitter<any>();

  constructor(
    @Optional() @Host() private parentComp: CreateConnectComponent,
    private indicatorsSourceService: IndicatorsSourceService,
    private store$: Store<reducer.State>,

  ) {

    this._store = this.store$.select('global').debounceTime(1000).distinctUntilChanged().subscribe(result => {
      let key = result.activityKey ? result.activityKey : JSON.parse(localStorage.getItem("TD_BG_ACTIVITY_OPTION")).value;

      let parmas = {
        "metrics": ["impression_uv"],
        "dimension": "monitor",
        "conditions": {
          "activityKey": key,
          "start": moment(result.startTime).format('YYYY-MM-DD'),
          "end": moment(result.endTime).format('YYYY-MM-DD'),
        },
        "detail": true,
      }

      this.indicatorsSourceService.queryMetricData(parmas).then((data: any) => {
        if (data && data.result) {
          const list = data.result.map((item: any) => {
            return {
              label: item.monitorName,
              value: item.monitorName,
              pinyin: item.pinyin.toUpperCase(),
              checked: false,
              monitorLinkId: item.monitorLinkId,
              key: item.activityKey,
            };
          })
          // 处理list数据添加到类型分组中
          list.forEach((activityItem: any) => {
            this.indexGroupData.forEach((group: any, i: number) => {
              const indexList = group.list;
              group._$isSelected = i === 0;
              indexList.forEach((indexName: any) => {
                const pinyinName = activityItem.pinyin;
                if (pinyinName === indexName) {
                  group.itemList.push(activityItem);
                }
              });
            });
          });

          // 判断是否为编辑状态 包含linkId则为编辑状态
          this.store$.select('secondLevel').subscribe((result: any) => {
            this.linkId = result.secondLevelId;
            if (this.linkId) {
              setTimeout(() => {
                this.editChecked();
              }, 0);
            
            }
          })
        }

      })
    })
  }

  ngOnChanges(changes: SimpleChange) {
    if (changes['detail'].currentValue && changes['detail'].currentValue !== changes['detail'].previousValue) {
      this.details = changes['detail'].currentValue;
    }
  }

  ngOnInit() {
    // this.checkedList();
  }

  ngOnDestroy() {
    this._store.unsubscribe();
  }

  // 全选/全部取消
  updateAllChecked() {
    this.indexGroupData[0].itemList.forEach((item: any) => item.checked = this.allChecked);
    this.checkedList();
  }

  // 清空已选项
  emptyAll() {
    this.indexGroupData[0].itemList.forEach((item: any) => item.checked = false);
    this.allChecked = false;
    this.checkedList();
  }

  // 是否全部选中
  updateSingleChecked() {
    const list = this.indexGroupData[0].itemList;
    this.allChecked = list.every((item: any) => item.checked === true);
    this.checkedList();
  }
  // 编辑默认选中监测链接
  editChecked() {
   
    this.detail=this.details;
    if (this.detail && this.detail.length > 0) {
      this.indexGroupData[0].itemList.forEach((item: any) => {
        this.detail.forEach((val: any) => {
          if (val.linkId === item.monitorLinkId) {
            item.checked = true;
          }
        })
      })
      this.checkedList();
    }
  }

  // 获取已选项，传递给父组件
  checkedList() {
    const groupMapParameters: any[] = [];
    const checked: any[] = [];
    this.indexGroupData[0].itemList.forEach((item: any) => {
      if (item.checked === true) {
        checked.push(item)
        groupMapParameters.push({
          "activityKey": item.key,
          "monitorLinkId": item.monitorLinkId
        });
      }
    })
    this.checkedOptions = checked;
    this.count = checked.length;
    this.onVoted.emit(groupMapParameters);
    this.parentComp.groupMapParameters = groupMapParameters
  }
  /**
   * 类型切换事件
   * @param index [当前点击项的索引]
   */
  indexGroupDataChange(index: any) {
    this.indexGroupData.map((item: any, i: number) => (item._$isSelected = i === index));
  }

  /**
   * 取消选择当前点击项
   * @param e [当前删除项的信息]
   */
  delete(e: any) {
    this.indexGroupData[0].itemList.forEach((item: any) => {
      if (item.checked == true && item.monitorLinkId == e.monitorLinkId) {
        item.checked = false;
      }
    })
    this.allChecked = false;
    this.checkedList();
  }

}
