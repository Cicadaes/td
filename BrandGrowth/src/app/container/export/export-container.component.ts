import { Component, OnInit, ChangeDetectorRef, OnDestroy, OnChanges, ViewEncapsulation} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as reducer from './../../ngrx/reducer';
import * as global from '../../ngrx/action/global';
import * as secondLevel from '../../ngrx/action/secondLevel';
import * as moment from 'moment';
import { Router } from "@angular/router"
import { AsyncPipe } from '@angular/common';

const _ = require("lodash");

import { ExportSourceService } from '../../services/source/export.source.service'

@Component({
  selector: 'export-container',
  templateUrl: './export-container.component.html',
  styleUrls: ['./export-container.component.less'],
  providers: [
    ExportSourceService,
    AsyncPipe
  ],
  encapsulation: ViewEncapsulation.None
})
export class ExportContainerComponent implements OnInit {
  private exportList: any[] = [];    // 导出列表
  private dataSource: any;    // 数据源列表
  private searchValue: string = '';  // 搜索内容

  constructor(
    private router: Router,
    private store$: Store<reducer.State>,
    private asyncPipe: AsyncPipe,
    private exportSourceService: ExportSourceService,
  ) {
    
  }             

  ngOnInit() {      
    this.getExportAllList("");
  }

  // 新建数据导出
  create(name: any) {
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_NAME,
      secondLevelName: name
    })
    this.router.navigate(['/export/create/', name])
  }

  // 下载
  download(item: any) {
    if(item.downloadUrl != null){
      document.location.href = item.downloadUrl;
    }
  }

  // 删除
  delete(one: any) {
    this.exportSourceService.deleteExport(one.id).then((result: any) => {
      if (result.code === 200) {
        this.exportList.map((item: any) => {
          if (item.id == one.id) {
            this.exportList = this.exportList.filter((old: any) => {
              return old.id !== item.id;
            })
          }
        });
      }
    });
  }

  // 导出失败，点击重试
  again(item: any) {
    this.exportSourceService.againExport(item.id).then((result: any) => {
      if (result.code === 200) {
        this.getExportAllList("");
      }
    });
  }

  // 获取媒体监测链接列表
  getMonitorLink(flag:any,params:any) {
    if(flag){
      let obj = {
        activityKey: params.activityKey,
        eventId: params.eventId,
        start: moment(params.startTime).format('YYYY-MM-DD'),
        end: moment(params.entTime).format('YYYY-MM-DD')
      }

      if(!params.dataSource) {
        this.exportSourceService.getListMonitorLink(obj).then((data: any) => {
          if (data.code == 200 && data.result) {
            let list: any = [];
            params.monitorLinkIds.forEach((ci: any) => {
              data.result.forEach((ei: any) => {
                ei.monitorList.forEach((el: any) => {
                  if(el["id"] == ci){
                    list.push(el)
                  }
                })
              });
            });
            params.dataSource = list;
          }
        })
      }
    }
  }

  getExportAllList(params: any) {
    this.exportList = [];
    this.exportSourceService.getExportList(params).then((data: any) => {
      if (data.code == 200 && data.result) {
        data.result.map((item: any) => {     // 循环遍历将表格需要的内容push进数组
          this.exportList.push({
            id: item.id,  
            user: item.user,
            taskName: item.taskName,
            eventId: item.eventId,
            activityKey: item.activityKey,
            startTime: moment(item.startTime).format('YYYY.MM.DD'),
            entTime: moment(item.entTime).format('YYYY.MM.DD'),
            monitorLinkIds: item.monitorLinkIds.split(','),
            downloadUrl:item.downloadUrl,
            state: item.state
            //dataSource: []
          })
        })
        this.exportList = _.cloneDeep(this.exportList);
      }
    })
  }

  // 获取数据源个数
  getArrayLength(arr: any) {
    if (Object.prototype.toString.call(arr) == '[object Array]') {
      if(arr[0] == ''){
        return 0;
      }
      return arr.length;
    }
    return 0;
  }
}
