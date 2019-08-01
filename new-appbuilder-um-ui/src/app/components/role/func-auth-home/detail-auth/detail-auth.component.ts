import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FuncAuthHomeService } from '../func-auth-home.service';
import { NzNotificationService, NzModalService } from 'ng-cosmos-ui';
import { AddDataDialogComponent } from '../add-data-dialog/add-data-dialog.component';
import { EditDataDialogComponent } from '../edit-data-dialog/edit-data-dialog.component';

@Component({
  selector: 'detail-auth',
  templateUrl: './detail-auth.component.html',
  styleUrls: ['./detail-auth.component.css']
})
export class DetailAuthComponent implements OnInit {
  _dataSet = [];
  _roleId:any;
  _tenantId:any;
  indeterminate = false;
  allChecked = false;
  dataObject = [];
  userAuthFieldArray = [];
  total = 0;
  @ViewChild(AddDataDialogComponent)
  private addData:AddDataDialogComponent;

  @ViewChild(EditDataDialogComponent)
  private editData:EditDataDialogComponent;

  @Input() set roleId(roleId: number){
    this._roleId = roleId;
  };
 
  @Input() set tenantId(tenantId: any){
    this._tenantId = tenantId;
  };

  param = {
    roleId: 0,
    tenantId: 0,
    page:1,
    pageSize:10
  };

  constructor(
    private funcAuthHomeService: FuncAuthHomeService,
    private notification: NzNotificationService,
    private confirmServ: NzModalService
  ) {
    
   }

  ngOnInit() {
    this.initUserAuthFieldArray();

    this.param.roleId = this._roleId;
    this.param.tenantId = this._tenantId;
    this.getDetailByRoleId(this.param);

    /**获取数据对象列表 */
    this.funcAuthHomeService.queryDataauthByRoleId({
      roleId: this._roleId,
      tenantId: this._tenantId
    }).then(data => {
      if(data.code == 200 && data.data){
        this.dataObject = data.data;
      } else {
        this.dataObject = [];
      }
      
    }).then(res => {
      this.initUserAuthFieldArray();
    });
  }

  /**
   * 获取数据明细列表
   */
  getDetailByRoleId(param){
   return this.funcAuthHomeService.queryDataDetailByRoleId(param).then(data => {
      if(data.code == 200 && data.data && data.data.data){
        this._dataSet = data.data.data;
        this.total = data.data.total;
      } else {
        this._dataSet = [];
        this.total = 0;
      }
      
    })
  }

  /**
   * 查询回调
   * @param params 搜索参数
   */
  onSearchUserAuthList(params: any) {
    params.vroleId = this.roleId;
    params.tenantId = this.tenantId;
    let newParams = Object.assign({}, this.param);
    Object.keys(params).forEach(key => {
      if(params[key] && params[key].trim().length){
        newParams[key] = params[key].trim();
      }
    })

    this.getDetailByRoleId(newParams);

  }

  /**
   * 初始化查询表单
   */
  initUserAuthFieldArray(): void {
     let selectOptions = this.handleSelectOptions()

      this.userAuthFieldArray = [ {
        id: 1,
        fieldName: 'targetId',
        fieldLabel: '数据对象',
        fieldType: 'select',
        apiData: false,
        initValue: '',
        selectOptions: selectOptions
      }, {
        id: 2,
        fieldName: 'dataName',
        fieldLabel: '数据对象实例名称',
        fieldType: 'input',
        initValue: '',
      }, {
        id: 3,
        fieldName: 'operatorName',
        fieldLabel: '操作权限',
        fieldType: 'input',
        initValue: '',
      }
      ];
  }

  /**
   * 处理数据对象下拉框列表
   */
  handleSelectOptions(){
    let options = [{
      value: '',
      label: '全部'
    }];
    this.dataObject.forEach(item => {
      options.push({
        value: item.targetId,
        label: item.targetName
      })
    });
    return options;
  }
  
  /**
   * 翻页
   * @param $event 
   */
  pageIndexChange($event){
    this.param.page = $event;
    this.getDetailByRoleId(this.param);
  }

  /**
   * 打开新建数据对象实例的操作权限窗口
   */
  showAddData(){
    this.addData.showModal();
  }

  /**
   * 编辑数据对象实例的操作权限
   * @param data 当前数据对象实例
   */
  showEditData(data){
    this.editData.showModal(data);
  }

  /**
   * 删除数据对象实例
   * @param data 数据
   */
  deleteData(data?: any){
    let ids = [];
   
    if(data){
      ids.push(data.id);
    } else {
      this._dataSet.forEach(item => {
        if(item.checked){
          ids.push(item.id);
        }
      });
    }
    
    if (ids.length) {
      let that = this;
      this.confirmServ.confirm({
        nzTitle: '您确认要删除选定数据对象实例吗？',
        nzContent: '<strong></strong>',
        nzOnOk: () => {
          that.funcAuthHomeService.deleteDetailAuthByIds(ids).then(data => {
            console.log(data)
            if(data.code == 200){
              // that.notification.success('success', data.data);
              that.getDetailByRoleId(that.param);
            } else {
              that.notification.error('error', data.data);
            }
          })
        }
      });
    } else {
      this.confirmServ.info({
        nzTitle: '请先选择数据对象实例',
        nzContent: '<strong></strong>'
      });
    }
   
  }

  /**
   * 
   * @param $event 选中所有
   */
  checkAll($event){
    this._dataSet.forEach(item => {
      item.checked = $event;
    })

  }

  /**
   * 刷新复选框状态
   */
  refreshStatus(): void {
    const allChecked = this._dataSet.every(value => value.checked === true);
    const allUnChecked = this._dataSet.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  /**
   * 刷新列表数据
   * @param $event 是否刷新
   */
  refreshData($event){
    if($event){
      this.getDetailByRoleId(this.param);
    }
  }
}
