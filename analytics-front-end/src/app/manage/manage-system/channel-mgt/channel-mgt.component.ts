import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/common/base-component';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../../common/config/page.size.config';
import { ChannelMgtService } from './channel-mgt.service';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-channel-mgt',
  templateUrl: './channel-mgt.component.html',
  styleUrls: ['./channel-mgt.component.less'],
  providers: [ChannelMgtService]
})
export class ChannelMgtComponent extends BaseComponent implements OnInit {
  pageIndex: number = 1; // 页码
  pageSize: number = 10; // 每页条数
  loading: boolean = false; // 加载中
  totalCount: number = 100; // 数据总条数
  listOfChannel: any = []; // 渠道列表
  _moreSearchFieldArray: any[] = []; // 模糊搜索框
  searchParam: any; // 模糊搜索条件
  pageOptions = TABLE_PAGE_SIZE_OPTIONS;

  getList$ = new Subject(); // 获取数据列表信息

  // 渠道类型
  channelTypeMap = {
    _td_channel: '分包渠道',
    _td_utm_source: '推广渠道'
  };

  constructor(private injector: Injector, private channelMgtService: ChannelMgtService) {
    super(injector);
    this._moreSearchFieldArray = [
      {
        fieldName: 'dicItemKey',
        fieldLabel: '类型',
        fieldType: 'select',
        apiData: false,
        span: 6,
        initValue: '',
        search: true,
        selectOptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '_td_channel',
            label: '分包渠道'
          },
          {
            value: '_td_utm_source',
            label: '推广渠道'
          }
        ]
      },
      {
        fieldName: 'status',
        fieldLabel: '报表显示状态',
        span: 6,
        fieldType: 'select',
        apiData: false,
        initValue: '',
        search: true,
        selectOptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '显示'
          },
          {
            value: '0',
            label: '隐藏'
          }
        ]
      },
      {
        fieldName: 'collectDataStatus',
        fieldLabel: '数据采集状态',
        fieldType: 'select',
        apiData: false,
        span: 6,
        initValue: '',
        search: true,
        selectOptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '启用'
          },
          {
            value: '0',
            label: '停用'
          }
        ]
      },
      {
        fieldName: 'dicItemValue',
        fieldLabel: '渠道',
        span: 6,
        fieldType: 'input',
        placeHolder: '请输入渠道名称 / 显示名'
      }
    ];
  }

  ngOnInit() {
    this.getList$
      .pipe(
        switchMap(() => {
          return this.getList();
        })
      )
      .subscribe(res => {
        this.loading = false;
        if (res['success'] && res['list']) {
          this.totalCount = res['list']['total'];
          res['list']['list'].forEach(element => {
            // 保存一份备份
            element['beforName'] = element['dicItemAlias'];
            element['isEditName'] = false;
          });
          this.listOfChannel = res['list']['list'];
        }
      });
    this.getList$.next();
  }

  /**
   * 获取渠道列表
   */
  getList() {
    this.loading = true;
    let param = {
      page: this.pageIndex,
      rows: this.pageSize,
      productId: localStorage.getItem('productId')
    };
    if (this.searchParam) {
      Object.assign(param, this.searchParam);
    }
    if (param['dicItemValue']) {
      param['dicItemValue'] = param['dicItemValue'].trim();
    }
    return this.channelMgtService.getChannelList(param);
  }

  /**
   * 修改渠道信息
   * @param data 渠道信息
   * @param editType 修改类型 1：别名 2：报表显示状态 3：数据采集状态
   */
  editChannel(data: any, editType: number) {
    let param = {
      id: data.id,
      dicItemKey: data['dicItemKey']
    };
    switch (editType) {
      case 1:
        param['dicItemAlias'] = data['dicItemAlias'];
        param['productId'] = localStorage.getItem('productId');
        break;
      case 2:
        param['status'] = data['status'];
        break;
      case 3:
        param['collectDataStatus'] = data['collectDataStatus'];
        break;
      default:
        break;
    }
    return this.channelMgtService.updateChannel(param);
  }

  /**
   * 模糊搜索
   * @param event
   */
  onSearchMoreSearch(event: Event) {
    this.pageIndex = 1;
    this.searchParam = event;
    this.getList$.next();
  }

  /**
   * 改变分页组件
   * @param changePage
   */
  changePage(changePage: boolean = false) {
    if (changePage) {
      this.pageIndex = 1;
    }
    this.getList$.next();
  }

  /**
   * 修改别名
   * @param data
   * @param isUpdate true 修改别名  false 取消修改
   */
  editAlias(data: any, isUpdate?: boolean) {
    if (isUpdate !== undefined) {
      if (isUpdate) {
        // 保存修改
        this.editChannel(data, 1).subscribe(res => {
          if (res['success']) {
            data['isEditName'] = false;
            // 更新成功需要更新一下备份别名
            data['beforName'] = data['dicItemAlias'];
          }
        });
      } else {
        data.dicItemAlias = data['beforName'];
        data['isEditName'] = false;
      }
    } else {
      data['isEditName'] = true;
    }
  }

  /**
   * 改变报表显示状态
   * @param data
   * @param event
   */
  changeReportStatus(data: any, event: Event) {
    data['status'] = event ? 1 : 0;
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: `${
        event
          ? '显示状态下的渠道将被统计且显示在渠道分析、渠道筛选器等相关模块内，请确认是否要显示该渠道'
          : '隐藏状态下的渠道将不被统计且不显示在渠道分析、渠道筛选器等相关模块内，请确认是否要隐藏该渠道'
      }`,
      nzOnOk: () => {
        this.editChannel(data, 2).subscribe(res => {
          if (!res['success']) {
            data['status'] = !event;
          }
        });
      },
      nzOnCancel: () => {
        data['status'] = !event;
      }
    });
  }

  /**
   * 改变数据采集状态
   * @param data
   * @param event
   */
  changeCollectDataStatus(data: any, event: Event) {
    data['collectDataStatus'] = event ? 1 : 0;

    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: `${
        event
          ? '启用后将对该渠道进行数据采集，请确认是否要启用该渠道'
          : '停用后将不再对其进行数据采集，后续启用将会出现数据断档，请确认是否要停用该渠道'
      }`,
      nzOnOk: () => {
        this.editChannel(data, 3).subscribe(res => {
          if (!res['success']) {
            data['collectDataStatus'] = !event;
          }
        });
      },
      nzOnCancel: () => {
        data['collectDataStatus'] = !event;
      }
    });
  }
}
