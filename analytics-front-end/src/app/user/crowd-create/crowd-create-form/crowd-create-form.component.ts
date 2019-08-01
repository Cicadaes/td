import { Component, Injector, ChangeDetectorRef, OnInit, OnChanges } from '@angular/core';
import { CrowdCreateService } from '../crowd-create.service';
import { DatePipe } from '@angular/common';
import { BaseComponent } from '../../../common/base-component';

@Component({
  selector: 'app-crowd-create-form',
  templateUrl: './crowd-create-form.component.html',
  styleUrls: ['./crowd-create-form.component.less']
})
export class CrowdCreateFormComponent extends BaseComponent implements OnInit, OnChanges {
  parentId: any;
  parentName: any;
  isLoading = false;
  isSaving = false;
  // 人群构建视图json
  crowdVO2: any = {
    crowd: {
      name: '',
      productId: this.productId,
      parentId: null
    },
    referenceCollection: {
      references: []
    },
    conditions: [
      {
        indice: 'attribute',
        not: 'false',
        operator: '',
        queryList: [
          {
            operator: '',
            boolFilters: []
          }
        ]
      }
    ]
  };

  isEdit: any = false;
  crowdId: any;
  hasChange: any = false;
  _crowdFilter: any = {};
  _isCheck: boolean;
  _ifRestart: boolean;

  constructor(
    private crowdCreateService: CrowdCreateService,
    private injector: Injector,
    public changeDetectorRef: ChangeDetectorRef
  ) {
    super(injector);
    this.initRouterList('新建/编辑用户分群');
  }

  ngOnInit() {
    this.crowdVO2.crowd.productId = this.productId;

    // 判断是否为编辑功能
    const id = this.route.snapshot.params['id'];
    if (id && id !== 'null' && id !== 'undefined') {
      this.isEdit = true;
      this.crowdId = Number(id);
    }

    // 判断是否有父人群id
    const parentId = this.route.snapshot.params['parentId'];
    if (parentId && parentId !== 'null' && parentId !== 'undefined') {
      this.parentId = parentId;
      this.crowdVO2.crowd.parentId = this.parentId;

      this.crowdCreateService.queryCrowd(this.crowdVO2.crowd.parentId).subscribe((response: any) => {
        this.parentName = response.data.crowd.name;
      });
    }
    this.queryCrowdById();
  }

  queryCrowdById() {
    if (this.isEdit) {
      this.crowdCreateService.queryCrowd(this.crowdId).subscribe((response: any) => {
        this.crowdVO2 = response.data;
      });
    }
  }

  _saveApi() {
    if (!this.check() || !this._crowdFilter.isChecked) {
      return;
    }
    const crowdVO2 = this.crowdVO2;
    if (crowdVO2.crowd.name !== null) {
      crowdVO2.crowd.name = crowdVO2.crowd.name.trim();
    }
    const bigJson = {
      crowd: crowdVO2.crowd,
      referenceCollection: {
        references: this._crowdFilter.references
      },
      definition: this._crowdFilter.definition
    };

    if (!this.isEdit) {
      this.isSaving = true;
      this.crowdCreateService.saveCrowd(bigJson).subscribe((resObj: any) => {
        if (resObj.code === 200) {
          this.message.create('success', `保存成功`);
          this.goBack();
        } else if (resObj.code === 400) {
          this.message.create('error', resObj.message);
        }
        this.isSaving = false;
      });
    } else {
      this.isSaving = true;
      this.crowdCreateService.updateCrowd(bigJson, this.crowdId).subscribe((resObj: any) => {
        if (resObj.code === 200) {
          this.message.create('success', `保存成功`);
          if (this._ifRestart) {
            this.restart();
          } else {
            this.goBack();
          }
        } else if (resObj.code === 400) {
          this.message.create('error', resObj.message);
        }
        this.isSaving = false;
      });
    }
  }

  // 保存前转换json
  save(ifRestart?) {
    this._ifRestart = ifRestart;
    this._isCheck = true;
  }

  // 取消
  cancel() {
    this.goBack();
  }

  showConfirm() {
    if (this.hasChange) {
      this.modalService.confirm({
        nzTitle: '提示',
        nzContent: '数据已更改,重新计算前是否需要保存?',
        nzOnOk: () => {
          this.save(true);
          this.globals.resetBodyStyle();
        },
        nzOnCancel: () => {
          this.restart();
          this.globals.resetBodyStyle();
        }
      });
    } else {
      let pass = this.check();
      if (pass) {
        this.restart();
      }
    }
  }

  restart() {
    this.crowdCreateService.restart(this.crowdId).subscribe((resObj: any) => {
      if (resObj.code === 200) {
        this.message.create('success', `重新计算成功`);
        this.goBack();
      }
    });
  }

  logChange(obj?, field?) {
    this.hasChange = true;
    if (obj && typeof obj === 'object' && field) {
      obj[field + 'CheckFailure'] = false;
    }
  }

  check() {
    let failure = false;
    let tooLong = false;
    let invalidChart = false;
    if (!this.crowdVO2.crowd.name) {
      setTimeout(() => {
        this.crowdVO2.crowd.nameCheckFailure = true;
      }, 10);
      failure = true;
    }

    if (this.crowdVO2.crowd.name && this.crowdVO2.crowd.name.length > 52) {
      setTimeout(() => {
        this.crowdVO2.crowd.nameCheckFailure = true;
      }, 10);
      tooLong = true;
    }

    const reg = /^[A-Za-z0-9\u4e00-\u9fa5\-_]+$/;
    if (this.crowdVO2.crowd.name && !reg.test(this.crowdVO2.crowd.name)) {
      setTimeout(() => {
        this.crowdVO2.crowd.nameCheckFailure = true;
      }, 10);
      invalidChart = true;
    }

    if (failure) {
      this.message.create('error', '请为空白项输入值');
    }
    if (tooLong) {
      this.message.create('error', '人群名称长度不能大于52个字符');
    }
    if (invalidChart) {
      this.message.create('error', '人群名称含有特殊字符');
    }
    return !failure && !tooLong && !invalidChart;
  }

  onFilter(crowdFilter: any) {
    setTimeout(() => {
      this._isCheck = false;
    }, 10);
    this._crowdFilter = crowdFilter || {};
    this.hasChange = this._crowdFilter.hasChange;
    if (this._crowdFilter.isSubmit) {
      this._saveApi();
    }
  }
}
