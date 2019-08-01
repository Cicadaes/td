import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CarouselAppManageService } from './carousel-app-manage.service';
import { NzModalService } from 'ng-cosmos-ui';
import { ActivatedRoute } from '@angular/router';
import { AppCommunicationService } from '../../../@themes/communication-service/app-communication.service';


@Component({
  selector: 'carousel-app-manage',
  templateUrl: 'carousel-app-manage.component.html',
  styleUrls: ['carousel-app-manage.component.css']
})
export class CarouselAppManageComponent implements OnInit, OnDestroy {
  @Input() queryParams: any;
  @Input() showEdit = true;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onReset = new EventEmitter<boolean>();
  isShowAddModal = false;

   //  private appListDia: any
  @Input() tenantAppList: any[];
  @Input() isTenant = false;
  @Input() tenantId: any;

  private defaultAppIcon: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUQxRTM0M0ExREUzMTFFODk2N0RFM0VGMTJGMTJEQzgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUQxRTM0M0IxREUzMTFFODk2N0RFM0VGMTJGMTJEQzgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5RDFFMzQzODFERTMxMUU4OTY3REUzRUYxMkYxMkRDOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5RDFFMzQzOTFERTMxMUU4OTY3REUzRUYxMkYxMkRDOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pj7PrGsAAAaGSURBVHja7FtdbBVFFJ5b4NYo2IeiSa34IEkLidpafgoaI/VBbdTGhqit1geBFChY4ckIGhNjkPhABMRWEggJ+IMKgaatqQ+AxtT+QEAkAo34IFZItQSsUmhp6zn0u8lm3ZmdmZ27NtKTfEk7Mztzzje7Z86ZmZsor3pXxCylhG2EHF/5OcJiwpdxKpMh4pcg4wXKtsWtzH9BQI5l3f+GgDEl4wTc6ARMjGmcPMLDhEKNtlsIxwhfE7rGEgFJwkrCNEI94XRI+3sJLxEWEu4yGKfG8/cvhD2EHYTjIc/lE5YRzhLeJwy4JOAmwj7CY/ifDXuU0OFrl8A6v5bwgIMJYuJWA62EdYRmwoivXTGhhZCF/1m3pwlXXPgAv/ECA31FmOspK4KSTY6M9wv32YgxihTGC+i6D7pHIiAZYLyfhIcIGwidhHkx+JN5GGsD/IrfeD8JySgE1EqM95LwDV7ROFeUDIx5SGK8l4TaKD4g15HCw5i1g4TD8O7dhL9RfwvG4tViNqGEMMcRqXdGIWArHF6W5eC/Yln7CN5ZJlcJFwg/wOsLrDYvEFaEGaGQS7DB+hM4idfokuHAvVB8OmF9iPEyOYtnp6OvXgvjWfcfo64C7YYkfEaYQfhAdy0OkQH0xX3uNjS+3VUozB2VhbS5RlhOeI7wRxocH/dZgTGuhbQt0zHeNBdYqKi7TChHhBgmUxHQHEegcgWh71uoC5N6jHXZUlcrAorwHcpmvhJBig6JPxFeQ6icCRQQ3iCc0VS+EWPK3gTWdZYrAhLw5BMk9ZwfNGga/3nIinIr2uiQ0ICxg2QC8oGECwJKFREeO6UPNfq4jbBdRyG04ba3a7TlsT9RRIylLghYo1jqVmp+Qi9jdnWF267SbMs6/C6pWxuVgPsID0rqXjfw9mXCXJ7UbHcB/kOWQBVEIeBFSTnn6SY7uDMsCMg3aLsdOpnYoEVAhaS8jjCY5oTHJIgahE5B8qwtAfdIYnBObHYZGnPKgoCfDdvvgm5+mYYky5gA2bffiSTHRBosCGiySLw6JXULbAgokpQfsDCG1+Q/Ddpz2/csxjkoKS9QEcBr5W9idJ/Ni2rJM0csFOshLBL/3ssLkhG07bEY57CkvCbAPra5NEPIz+pkclrYyR44pD5FG657xrMnYComul0/i8wQ5udx5yJ49i8IdxPeIZyA9+ZdoaOEt1G3J0L/prrl2ByM9DlIa9coIswoYqzb+NmgxTNTxrA9U2wIMP5uNNvxfjxvSX+HV3PEEH14tlaE7O1b6JaS80zAEv7DcYyeiy2pjUhLJ1vM5mQ8uxF95TrSLSW8Lb+YCWgGcwkfZNvJszRmnndsCh2+2oWIDDND2s2WlG8NsI/D/GaVDzgqKS8JUWKpY+O90Vx1SJsS0+BNRcC3kvK5Qn1Q8XwanZyqb9ZpjqTukA0BJxAuBj1TZZFDuJD7FXVVEns4SeqyXQZl+20rFJ45mUYCMhVjynatd0eJA3YqXrclkrotaSRA1vcixWe5MwoB34vRCwlBwgcZ2QHlrxD2psH4vejbL9nII4KkFTZEigTXScqzkef7ZQhZX51D4+vQ51BA3SbJRKh0NyKA44QOSV0Flr0gEjgHr7TM6737CJXoK8j4asXK0AHdIxMwolAgNQOybe9PEZ3x52JyvN2LZ/LRR5DwmJsldUOeTRAnydARhQNKYrWQncJcJLyJaPMpKN2G2R0EelC2GW3uwDMXJX0+gTGTCmeptXM10dAJye7b3EzYL0ZPgGRHZYMIkRsj+oOlIGpSiK5O0+FiGKgSVqgeMzNVuBfu82OMMSmk7X7o7ISAoHt4KmHHyFdrljkKipLo6yQcoo5kQefiqATMNDTeO1u8dPF5/6vC7rZZLp49g75M36oUCTOj+IBqYX9DLBUxrsd6zIcWB+CcuhCj/+XJ/bltHtLtR4Sba3JZsGG1LQHdjr7fDLyOxSJ+6Y7yCWzCayQTvo21ALs2wzEaNYyVoESob6+1wAZrAviEtlxCQuoqGt/rX4V9gvYYjG/HWLXI8x+XkNAC3QeirgL9ASQE3cPjb3u+GL3Y0JoGw1vR93xfkNMWQELK+H5XgVA/Qs/UDyY42DklCZubANsfTHiFb4vyadIOof7BRBv8S+oHExwJXtUZIBHTDyfz4Ct4r3C5RuZ3DK/3mPrJTBTp8hgTRkBNnEvE+NHYOAHjBMQuqrPI8zcCAbKzyOtndXEr848AAwAwPncSJqDy8AAAAABJRU5ErkJggg==';

  private loadingFlag = false;
  @Input() set refresh(refresh: EventEmitter<any>) {
    refresh && refresh.subscribe && refresh.subscribe((data: any) => {
      this.getFunTree();
    })
  }

  @Input() set _refresh(_refresh: EventEmitter<any>) {
    _refresh && _refresh.subscribe && _refresh.subscribe((data: any) => {
    })
  }

  isCollapse = true;
  curApp: any = {};
  resourceTreeDatas: any[] = [];
  resourceTreeDataDia: any[] = [];
  isSetTreeDatas = true;
  isReset = false;
  addType: any;
  private roleId: any = '';
  private role: any = '';

  private curAppId: any;

  database: any; // 已选数据
   //  重写

   //  @Input() appList: any[];
  private _appList: any;   //  app数据列表
  @Input() set appList(appList: any) {
    this.loadingFlag = appList ? false : true;
    this._appList = appList;
    this.database = appList;
    this.initCurApp();
  }

  private isShowModel: boolean = false   //  是否显示配置弹窗

  constructor(private appComService: AppCommunicationService, private route: ActivatedRoute, private service: CarouselAppManageService, private confirmServ: NzModalService) {
    this.roleId = this.route.snapshot.params['roleId']
  }

  /**
   * 显示配置弹窗
   * @return {[type]} [description]
   */
  private showAddModal(type: any) {
    if (this.role != 'UM_TENANT_ADMIN') {
      this.addType = type;
      this.undisabledAppListTreeDatas();
      this.isShowModel = true;
    }
  }

  /**
   * 关闭配置弹窗
   * @param  {any}    data [description]
   * @return {[type]}      [description]
   */
  private hideAddModal(data: any) {
    this.disabledTreeDatas(this.resourceTreeDatas);
    this.isShowModel = false;
  }

  onSubmitModal(data: any) {
    if (window['appConfig'].rolecode === 'UM_SUPER_ADMIN') {
      if (data && data.length) {
            this.updateData(data);
            this.isShowAddModal = false;
      } else {
        this.confirmServ.warning({
          nzTitle: '已选功能不能为空，请选择功能',
           // nzContent: content,
          nzOnCancel: () => {
          }
        });
      }
    } else {
      this.updateData(data);
    }
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }

  undisabledTreeDatas(datas: any[]) {
    if (datas && datas.length > 0) {
      for (let i = 0; i < datas.length; i++) {
        datas[i].disabled = false;
        if (datas[i].children && datas[i].children.length > 0) {
          this.undisabledTreeDatas(datas[i].children);
        }
      }
    }
  }

  undisabledAppListTreeDatas() {
    if (this._appList && this._appList.length > 0) {
      for (let i = 0; i < this._appList.length; i++) {
        this.undisabledTreeDatas(this._appList[i].tree);
      }
    }
  }

  /**
   * 设置当前的app
   * @param  {any}    app [description]
   * @return {[type]}     [description]
   */
  resetCurApp(app: any) {
    if (this._appList && this._appList.length > 0) {
      for (let i = 0; i < this._appList.length; i++) {
        this._appList[i].active = false;
      }
    }
    app.active = true;
    this.curApp = app;
    this.queryResourceTreeDatasByApp();
  }

  editApp(app: any) {
    this.resetCurApp(app);
  }

  getBackTreeDatas(datas: any[]) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.appList && changes.appList.currentValue && changes.appList.currentValue.length > 0) {
       //  this.appList = changes.appList.currentValue;
       //  this.initCurApp()
    } else {
       // 清空当前选中的
       //  this.resourceTreeDatas = [];
       //  this.resourceTreeDataDia = JSON.parse(JSON.stringify(this.resourceTreeDatas))
      this.curAppId = this.curApp.id;
    }
  }

  ngOnInit() {
     //  this.initView()
     //  this.initCurApp();
  }

  ngOnDestroy() {

  }



  getFunTree() {
    this.service.queryAppListByRoleId({ vroleId: this.roleId }).then((data: any) => {
      if (data.success === 200) {
          
        this.resourceTreeDatas = data.result[0].tree;
        this.resourceTreeDataDia = JSON.parse(JSON.stringify(this.resourceTreeDatas));

        this.curAppId = data.result[0].id;
        this.disabledTreeDatas(this.resourceTreeDatas);
      }
    }).catch((err: any) => {
      console.log(err);
    });
  }

  /**
   * 更新数据
   * @param  {any}    data [description]
   * @return {[type]}      [description]
   */
  private updateData(data: any) {
    this._appList = data;
    this.initCurApp();
    this.onSubmit.emit(data);
  }

  /**
   * 初始化视图
   * @return {[type]} [description]
   */
  async initView() {
    await this.getAppList();
    this.initCurApp();
  }

  /**
   * 初始化数据根据许可证id查询app功能集
   * @return {[type]} [description]
   */
  private getAppList(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      if (this.appComService.userInfo.rolecode == 'UM_SUPER_ADMIN') {
        this.service.queryLicencesAppList({ id: this.route.snapshot.params.id }).then((data: any) => {
          if (data.success == '200') {
            this.loadingFlag = false;
            this._appList = data.result;
            resolve();
          }
        }).catch((err: any) => {
          reject();
        });
      } else {
        this.service.queryAppListByUser({ userId: this.route.snapshot.params['id'] }).then((data: any) => {
          if (data.success) {
            this.loadingFlag = false;
            this._appList = data.data;
            resolve();
          }
        }).catch((err: any) => {
          reject();
        });
      }
    });

  }

  /**
   * 初始化AppList
   * @return {[type]} [description]
   */
  private initCurApp() {
    if (this._appList && this._appList.length > 0) {
      this._appList[0].active = true;
      this.curApp = this._appList[0];
      this.queryResourceTreeDatasByApp();
    }
  }

  /**
   * 查询具体某个app的功能
   * @return {[type]} [description]
   */
  private queryResourceTreeDatasByApp() {
      
    if (this.curApp.tree) {
      this.resourceTreeDatas = this.curApp.tree;
      this.resourceTreeDataDia = JSON.parse(JSON.stringify(this.resourceTreeDatas))
      this.curAppId = this.curApp.id;
    }
    this.disabledTreeDatas(this.resourceTreeDatas);
  }


  /**
   * 使app功能树不可编辑
   * @param  {any[]}  datas [description]
   * @return {[type]}       [description]
   */
  private disabledTreeDatas(datas: any[]) {
    if (datas && datas.length > 0) {
      for (let i = 0; i < datas.length; i++) {
        datas[i].disabled = true;
        if (datas[i].children && datas[i].children.length > 0) {
          this.disabledTreeDatas(datas[i].children);
        }
      }
    }
  }
}
