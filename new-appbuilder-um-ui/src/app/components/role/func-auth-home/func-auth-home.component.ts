import { Component, OnInit, OnDestroy, Input, SimpleChanges, EventEmitter } from '@angular/core';
import { FuncAuthHomeService } from './func-auth-home.service';
import { ApplistService } from '../../../@themes/transform-service';

@Component({
  selector: 'func-auth-home',
  templateUrl: './func-auth-home.component.html',
  styleUrls: ['./func-auth-home.component.css']
})
export class FuncAuthHomeComponent implements OnInit, OnDestroy {
  @Input() isSuper: boolean;
  @Input() tenantId: number;
  @Input() appList: any;
  @Input() roleId: number;

  tabs = [{
      key: 'func',
      value: '功能授权',
    }, {
        key: 'data-obj',
        value: '数据对象授权',
    }, {
        key: 'data-detail',
        value: '数据明细授权',
    }];

  constructor(private appListSer: ApplistService, private service: FuncAuthHomeService) {

  }

  
  ngOnInit() {
  }

  ngOnDestroy() {

  }

}
