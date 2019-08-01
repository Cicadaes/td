import { Component, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { DetailLicencePageService } from './detail-licence-page.service';
import { ActivatedRoute, NavigationEnd, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { NzModalService } from 'ng-cosmos-ui';
import { ApplistService } from '../../../@themes/transform-service'
import { ScrollToTopService } from '../../../@themes/scroll-service'


@Component({
  selector: 'detail-licence-page',
  templateUrl: './detail-licence-page.component.html',
  styleUrls: ['./detail-licence-page.component.css'],
  providers: [DetailLicencePageService]
})

export class DetailLicencePageComponent implements OnInit {
  @Input() isEdit: boolean = false;

  @ViewChild('detailRoot') detailRoot: any;

  functionFieldArray: any[];
  isShowEditLicenceModal: boolean = false;
  isShowLicenceAttributeModal: boolean = false;
  id: number;
  licence: any;
  appAttributeParams: any = {};
  _dataSet: any = [];
  currentData: any;
  appList: any;
  queryParams: any = {};
  rolecode: any;
  showEdit: boolean = true;
  companyFieldArray: any[];
  authLicencesTableFieldParams: any;
  tabs = [
    {
      name: '基本信息',
      code: '1'
    },
    {
      name: '授权信息',
      code: '2'
    }
  ];


  constructor(private scrollSer: ScrollToTopService, private appListSer: ApplistService, private service: DetailLicencePageService, private route: ActivatedRoute, private confirmServ: NzModalService) {

  }


  initFunctionFieldArray(): void {

  }

  onSearchCompanyList(params: any) {
    if (params.status === '') {
      params.status = null;
    }
    this.authLicencesTableFieldParams = params;
    // this.authLicencesTableFieldParams.id = this.id;
  }
  initCompanyFieldArray(): void {
    this.companyFieldArray = [{
      id: 1,
      fieldName: 'companyName',
      fieldLabel: '公司名称',
      fieldType: 'input'
    }, {
      id: 3,
      fieldName: 'status',
      fieldLabel: '租户状态',
      fieldType: 'select',
      apiData: false,
      initValue: '',
      selectOptions: [{
        value: '',
        label: '全部'
      }, {
        value: 1,
        label: '正常'
      }, {
        value: 0,
        label: '禁用'
      }]
    }];
  }
  ngOnInit() {
    this.initFunctionFieldArray();
    this.initCompanyFieldArray();
    this.id = this.route.snapshot.params['id'];
    this.appAttributeParams.id = this.id;
    this.queryParams.id = this.id;
    // this.functionFieldArray[1].apiParam.id = this.id;
    this.reflashAppDetail();
    this.reflashLicenceAttribute();
    this.rolecode = window['appConfig'].rolecode;
    if (this.rolecode == "UM_OPER_ADMIN") {
      this.showEdit = false;
    }

    // 获取功能配置数据（改为不在此处请求）
    this.queryLicencesAppList();
  }

  //初始化数据根据许可证id查询app功能集
  queryLicencesAppList() {
    let param: any = {};
    param.id = this.id;
    const _appList = this.appList
    this.appList = null
    this.service.queryLicencesAppList(param).then((data: any) => {
      if (data.success == '200') {
        this.appList = data.result;
      }
    }).catch((err: any) => {
      this.appList = _appList
      console.log(err);
    });
  }

  showEditLicenceModal() {
    this.isShowEditLicenceModal = true;
  }
  showLicenceAttributeModal() {
    this.isShowLicenceAttributeModal = true;
  }

  addAttribute = (e: any) => {
    this.isEdit = false;
    this.showLicenceAttributeModal();
  }

  editAttribute(data: any) {
    this.currentData = data;
    this.showLicenceAttributeModal();
    this.isEdit = true;
  }

  deleteAttribute(data: any) {
    let _thiss = this;
    let params = { "id": data.id };
    let title = '您确定要删除属性“' + data.name + '”吗？';
    this.confirmServ.confirm({
      nzTitle: title,
      nzContent: '',
      nzOnOk: () => {
        _thiss.service.deleteLicenceAttribute(params).then((data: any) => {
          if (data.success) {
            _thiss.reflashLicenceAttribute();
            _thiss.reflashAppDetail();
          } else {
            alert("删除失败");
          }
        }).catch((err: any) => {
          console.log(err);
        });
      },
      nzOnCancel: () => { }
    });

  }
  hideEditAppModal() {
    this.isShowEditLicenceModal = false;
    this.reflashAppDetail();
  }

  hideLicenceAttributModal() {
    this.isShowLicenceAttributeModal = false;
    this.reflashLicenceAttribute();
    this.reflashAppDetail();
  }

  reflashAppDetail() {
    this.service.getAppPageDetail(this.id).then((data: any) => {
      if (data.success == '200') {
        this.licence = data.result;
      }
    }).catch((err: any) => {
      console.log(err);
    });
  }
  reflashLicenceAttribute() {
    this.scrollSer.scrollToTop()
    this.service.getLicenceAttribute(this.id).then((data: any) => {
      if (data.success == '200') {
        this._dataSet = data.result;
      }
    }).catch((err: any) => {
      console.log(err);
    });
  }

  onSubmitAppData(data: any) {

    if (data == null || data.length == 0) {
      this.confirmServ.warning({
        nzTitle: "已选功能不能为空，请选择功能",
        // content: content,
        nzOnCancel: () => {
        }
      });
    } else {
      this.appList = data;
      // 修改关联的应用
      this.updateLicenceApp();
    }

  }

  resetCarouselAppList(data: any) {
    if (data) {
      this.queryLicencesAppList();
    }
  }
  updateLicenceApp() {
    this.licence.id = this.id;
    this.licence.appList = this.appList;

    let params: any = JSON.parse(JSON.stringify(this.licence))
    params.appList = this.appListSer.deleteIcon(params.appList) || []
    this.service.updateLicenceAppList(params).then((data: any) => {
      //this.onClose.emit(false);
      this.queryLicencesAppList();
      this.reflashAppDetail();
    }).catch((err: any) => {
      console.log(err);
    })
  }

}
