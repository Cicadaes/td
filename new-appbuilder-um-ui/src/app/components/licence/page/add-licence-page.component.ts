import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddLicencePageService } from './add-licence-page.service';
import { Router } from "@angular/router";
import { NzModalService } from 'ng-cosmos-ui';
import { ApplistService } from '../../../@themes/transform-service'
import { ScrollToTopService } from '../../../@themes/scroll-service'

@Component({
  selector: 'add-licence-page',
  templateUrl: './add-licence-page.component.html',
  styleUrls: ['./add-licence-page.component.css'],
  providers: [FormBuilder]
})

export class AddLicencePageComponent implements OnInit, OnChanges {
  @Output() onClose = new EventEmitter<any>();
  @Input() _dataSet: any = [];
  appList: any = [];
  selectedId: any;
  status = true;
  name = "";
  desc = "";
  licence: any = {};
  isNeedSubmitAddAppFormData: boolean;
  additionalAppIdSelect: any;
  @Input() isedit: boolean = false;
  isShowLicenceAppModal: boolean = false;
  currentData: any;
  ismultiple: boolean = false;
  queryParams: any;
  errorType: number = 0;

  private _current: number = 1
  // 编辑的数据
  private curIndex: number = -1

  constructor(private scrollSer: ScrollToTopService, private appListSer: ApplistService, private fb: FormBuilder, private service: AddLicencePageService, private router: Router, private confirmServ: NzModalService) {

  }


  submitAddAppForm(data: any) {
    if (this._dataSet.length == 0) {
      alert("请添加许可证属性！");
    } else {
      data.value.appAttribute = this._dataSet;
      this.isNeedSubmitAddAppFormData = false;
      if (data.status == 'VALID') {
        this.service.addLicence(data.value).subscribe((data: any) => {
          this.onClose.emit(false);
          this.router.navigate(['/licences/detailLicencePage', data.result]);
        })
      }
    }
  }
  handleOk = (e: any) => {

  }

  submmitLicence = (e: any) => {
    this.nzBlurEvent("name");
    this.nzBlurEvent("desc");
    if (!this.name) {
      //this.showDialog("请输入名称")
      return;
    }
    if (this.errorType != 0) {
      if (this.errorType == 1) {
        //this.showDialog("请输入名称")
      }
      if (this.errorType == 2) {
        //this.showDialog("名称已存在")
      }
      return;
    }
    if (this.appList.length == 0) {
      this.showDialog("请配置应用功能")
      return;
    }
    //校验属性
    if (this._dataSet.length > 0) {
      for (let i = 0; i < this._dataSet.length; i++) {
        let at = this._dataSet[i];
        if (!at.defalutValue) {
          this.showDialog("请输入Value(默认值)")
          return;
        }
      }
    }
    this.licence.name = this.name;
    this.licence.statusboo = this.status;
    this.licence.desc = this.desc;
    this.licence.licenceAttributeList = this._dataSet;
    this.licence.appList = this.appList;
    this.licence.appList = this.appListSer.deleteIcon(this.licence.appList) || []
    this.service.addLicence(this.licence).subscribe((data: any) => {
      this.onClose.emit(false);
      this.router.navigate(['/licences/detailLicencePage', data.data]);
    })
  }

  selectSearchAdditionalAppId(value: any, fieldName: string) {
    if (value) {
      this.selectedId = value.id;
      //alert(this.selectedId);
      //加载应用功能集合
    }
  }

  ngOnInit() {
    this.additionalAppIdSelect = {
      id: 3,
      fieldName: 'additionalAppId',
      fieldLabel: '关联主应用',
      fieldType: 'select',
      apiData: true,
      apiUrl: '/console-api/appController/queryListByName',
      apiParam: {},
      initValue: '',
      selectOptions: []
    };
  }

  addLicenceAttribute() {
    this.isedit = false;
    this.showAddAppModal();
  }


  showAddAppModal() {
    this.isShowLicenceAppModal = true;
  }

  hideAddAppModal() {
    this.isShowLicenceAppModal = false;
  }


  editAttribute(data: any, index: number) {
    this.isShowLicenceAppModal = true;
    this.isedit = true;
    this.curIndex = index
    this.currentData = data;
  }
  submitAttributeModal(data: any) {
    /*if(!this.isedit){
        this._dataSet.push(data)
    }*/
    this._dataSet = data;
  }

  deleteAttribute(data: any) {
    let _thiss = this;
    // let params = { "id": data.id };
    let title = '您确定要删除属性“' + data.name + '”吗？';

    this.confirmServ.confirm({
      nzTitle: title,
      nzContent: '',
      nzOnOk: () => {
        var key = data.key;
        var name = data.name;
        for (var i = _thiss._dataSet.length - 1; i >= 0; i--) {
          var p = _thiss._dataSet[i];
          if (p.key == key && p.name == name) {
            _thiss._dataSet.splice(i, 1);
          }
        }
      }
    });

  }

  refreshData() {
    let params = {};
    this.scrollSer.scrollToTop()
    /*if(params.id){
        this.service.getAttribute( params).subscribe((data: any) => {
            this._loading = false;
            this._dataSet = data.result;
        });
    }*/
  }

  onSubmitAppData(data: any) {
    this.appList = data
  }

  ngOnChanges(changes: SimpleChanges) {
    this.errorType = 0;
    if (changes.name) {
      if (this.name.trim()) {
        this.cheeckLicenceNane();
      } else {
        this.errorType = 1;
      }
    }
  }
  nzBlurEvent(value: any) {
    if (value == "name") {
      if (this.name.length > 256) {
        this.errorType = 9;
      }
      if (this.name.trim()) {
        this.cheeckLicenceNane();
      }
      if (this.name.length < 1) {
        this.errorType = 1;
      }
    }
    if (value == "desc") {
      if (this.desc.length > 256) {
        this.errorType = 10;
      }
    }

  }

  cheeckLicenceNane() {
    let nameV = this.name || ''
    nameV && (nameV = nameV.trim())
    let param = {
      name: nameV
    }
    this.service.queryOneNameById(param).subscribe((data: any) => {
      if (data.success == false) {
        this.errorType = 2;
      }
    })
  }
  showDialog(msg: any) {
    this.confirmServ.warning({
      nzTitle: "提示",
      nzContent: msg
    });
  }

  onInput() {
    this.errorType = 0;
  }

}
