import { AddActionFormComponent } from './../form/add-action-form.component';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd, ParamMap } from '@angular/router';
import { AddActionPageService } from './add-action-page.service';
import { NzModalService } from 'ng-cosmos-ui';
// import { DetailAppPageService } from '../../app/detailPage/detail-app-page.service';
import { AddActionFormService } from '../form/add-action-form.service';
@Component({
  selector: 'add-action-page',
  templateUrl: './add-action-page.component.html',
  styleUrls: ['./add-action-page.component.css'],
  providers: [FormBuilder]
})

export class AddActionPageComponent implements OnInit {
  initIdFlag: number;
  @Output() onClose = new EventEmitter<any>();
  @Output() onFresh = new EventEmitter<any>(); // 当编辑/添加完成时向父级输出
  freshNum: number;
  @Input() _dataSet: any = [];
  @Input() paramsId: any;

  // @Input() set initId(cube: any){//原先用来传递给详情页加载初始id,现已废弃
  //   this.initIdFlag= cube;
  // }
  private toSubmit: any = new EventEmitter<any>();

  id: number;
  fucTypeDicId: number;
  parentFucTypeDicId: number;
  action: any;
  resultData: any = {};
  additionalAppIdSelect: any;
  appAttributeParams: any;
  operation: string;
  functionId: number;
  isNeedSubmitAddActionFormData = false;
  editFlag = false;
  defaultType: number;
  editOrAdd = 'select';
  newCode: string;
  // paramsIdSubscription: Subscription;//监控显示详情的id参数

  @ViewChild('container') container: ElementRef;
  constructor(private fb: FormBuilder, private confirmServ: NzModalService, private service: AddActionPageService, private childService: AddActionFormService, private activatedRoute: ActivatedRoute, private router: Router) {

  }
  submitAddActionForm(data: any) {

    this.isNeedSubmitAddActionFormData = false;
    data.value.actionAttribute = this._dataSet;
    data.value.icon = '';

    if (this.resultData) {
      data.value.icon = this.resultData.icon;
    }
    // if(data.status == 'VALID'){
    data.value.appId = this.id;
    data.value.parentId = data.value.parentId == null ? 0 : data.value.parentId;
    data.value.id = this.functionId;
    data.value.operation = this.operation;
    if (this.parentFucTypeDicId) {
      data.value.fucTypeDicId = this.parentFucTypeDicId;
    }
    if (data.status === 'VALID') {

      this.service.addAction(data.value).subscribe((result: any) => {
        console.log(result);
        if (result.success === true) {
          this.onClose.emit(false);
          this.router.navigate(['/apps/detailAppPage', this.id]);
          let cont = '';
          if (this.operation === 'update') {
            cont = '修改成功';
          } else {
            cont = '新增成功';
            this.editOrAdd = 'newAdd';
          }
          this.confirmServ.info({
            nzTitle: '提示',
            nzContent: cont
          });
          this.freshNum = result.data; // 设定要传送的值
          this.onFresh.emit(this.freshNum); // 向父级传送事件值
        } else {
          this.confirmServ.info({
            nzTitle: '提示',
            nzContent: result.msg
          });
        }
      });
    }

  }
  handleOk = (e: any) => {
    this.toSubmit.emit();
  }
  cancel = (e: any) => { // 返回到查看页面
    this.getFunctionById(this.functionId, 'select', 0);
  }

  public getFunctionById(id: any, type: string, index: number) {

    if (id === 0 && type === 'select') {
      return;
    }
    this.editFlag = !this.editFlag;
    if (type === 'select' || type === 'update') { // 选中或者编辑状态时
      this.functionId = id;
    }
    if (type === 'update') {
      this.childService.idValue(id);
    }
    const params = {
      id: id,
      operation: type
    };
    this.operation = type;
    this.service.getFunctionById(params).subscribe((data: any) => {
      if (this.operation === 'addChild') {
        this.editFlag = false;
        // 创建子节点
        this.action = {};
        this.action.parentId = data.data ? data.data.id : 0;
        this.action.parentName = data.data ? data.data.name : 'root';
        this.editOrAdd === 'newAdd' ? this.editOrAdd = 'select' : this.editOrAdd = type;
        this.newCode = this.guid();
        this._dataSet = [];
      } else { // 编辑/查看
        this.editFlag = true;
        this.action = {};
        this.action = data.data;
        this._dataSet = data.data.actionAttribute;
        this.appAttributeParams = { functionId: this.functionId };
        // if(this.initIdFlag != 0){//有node数据的情况下
        data && data.data && data.data.fucTypeDicId ? this.fucTypeDicId = data.data.fucTypeDicId : this.fucTypeDicId = this.fucTypeDicId;
        // }
      }
    });

  }
  // 新增功能节点
  addNode(id: any) {
    console.log(id);
  }
  guid() {
    return (this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4());
  }
  S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  getActionAttribute() {

    const attributeParams = {
      functionId: this.functionId
    };

    this.service.getActionAttribute(attributeParams).subscribe((data: any) => {
      this._dataSet = data.list;
    });
  }

  submitResultData(data: any) {
    data && data.icon ? this.resultData.icon = data.icon : this.resultData.icon = '';
  }

  public resetAdditionalAppIdSelect() {
    const params = {
      params: { id: this.id, parentFucTypeDicId: this.parentFucTypeDicId }
    };
    this.service.getAppAttributeListByName(params).subscribe((data: any) => {
      // console.log('获取数据',data);
      this.defaultType = data.result && data.result.length !== 0 ? data.result[0].value : '';
      if (data.success === 200) {
        // console.log('打印数据', data);
        this.fucTypeDicId = this.fucTypeDicId != null && data.result.length ? this.fucTypeDicId : data.result[0].value;
        this.additionalAppIdSelect = {
          id: 3,
          fieldName: 'fucTypeDicId',
          fieldLabel: '功能类别',
          fieldType: 'select',
          apiData: false,
          apiUrl: '/console-api/appController/queryAppAttributeListByName',
          apiParam: { id: this.id },
          initValue: this.fucTypeDicId,
          selectOptions: data.result
        };
      }
    });
  }


  ngOnInit() {
    this.container.nativeElement.scrollTo(0, 0);
    this.id = this.activatedRoute.snapshot.params['id'];
    this.functionId = this.activatedRoute.snapshot.params['functionId'];
    this.operation = this.activatedRoute.snapshot.data['operation'];
    this.parentFucTypeDicId = this.activatedRoute.snapshot.params['parentFucTypeDicId'];
    this.resetAdditionalAppIdSelect();

    // let id = this.paramsId;

  }
}
