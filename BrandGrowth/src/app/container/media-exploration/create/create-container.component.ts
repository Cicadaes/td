import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { CmMessageService } from 'ng-cosmos-td-ui';
import { Store } from '@ngrx/store';
import * as reducer from '../../../ngrx/reducer';
import * as secondLevel from '../../../ngrx/action/secondLevel';
// import services
import { PeoplegroupSourceService } from '../../../services/source/peoplegroup.source.service';
import { MediaSourceService } from '../../../services/source/media.source.service';
import { MediaExploreSourceService } from '../../../services/source/mediaExplore.source.service'
@Component({
  selector: 'create-exploration',
  templateUrl: './create-container.component.html',
  styleUrls: ['./create-container.component.less'],
  providers: [
    PeoplegroupSourceService,
    MediaSourceService,
    CmMessageService,
    MediaExploreSourceService,
  ]
})
export class CreateContainerComponent implements OnInit, OnDestroy {
  private validateForm: FormGroup;
  // 是否显示弹框
  private modalVisible: boolean = false;
  private mediaVisible: boolean = false;
  private names: any;
  // 人群/媒体数据
  private peopGroup: number;
  private medGroup: number;
  private peoGroupList: any = [];
  private medGroupList: any = [];
  private peoGroupChecked: any = [];
  private medGroupChecked: any = [];
  private peoId: any = [];
  private medId: any = [];
  private peocheckCount: any = [];
  private medCheckCount: any = [];
  // 搜索字段
  private modalSearch: string = '';
  private mediaSearch: string = '';
  // 全局状态管理
  private _store: any;
  private levelId: any;
  // 验证字段
  private ispeoChecked: boolean = false;
  private ismedChecked: boolean = false;
  // 取消时状态
  private peoCancel: string ='';
  private medCancel: string ='';
  constructor(
    private peoplegroupSourceService: PeoplegroupSourceService,
    private mediaSourceService: MediaSourceService,
    private fb: FormBuilder,
    private store$: Store<reducer.State>,
    private mediaExploreSourceService: MediaExploreSourceService,
    private _message: CmMessageService,
  ) {
    this.getpeoGroup();
    this.getmedGroup();
    // 获取编辑状态Id
    this._store = this.store$.select('secondLevel').debounceTime(1000).distinctUntilChanged().subscribe((result: any) => {
      if (result.secondLevelId) {
        this.levelId = result.secondLevelId;
        this.getMediaOnlyId(this.levelId)
      }
    })
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      callBackName: [null, [Validators.required]],
    });
  }
  showModel() {
    this.peoCancel = JSON.stringify(this.peoGroupList);
    this.modalVisible = true;
  }
  showMedia() {
    this.mediaVisible = true;
    this.medCancel = JSON.stringify(this.medGroupList);
  }
  // 表单验证
  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    if (this.peoGroupChecked.length <= 0) {
      this.ispeoChecked = true;
    }
    if (this.medGroupChecked.length <= 0) {
      this.ismedChecked = true;
    }
  }
  getFormControl(name: any) {
    return this.validateForm.controls[name];
  }
  getCaptcha(e: MouseEvent) {
    e.preventDefault();
  }
  ngOnDestroy() {
    this._store.unsubscribe();
  }
  // 获取人群
  getpeoGroup() {
    this.peoplegroupSourceService.getPeoplegroupById().then((data: any) => {
      if (data.code == 200 && data.result.length > 0) {
        const list = data.result.map((item: any) => {
          return { value: item.id, label: item.name };
        });
        this.peoGroupList = list;
      }
    })
  }
  // 获取媒体
  getmedGroup() {
    this.mediaExploreSourceService.getChannelMappingList().then((res: any) => {
      if (res.code == 200 && res.result.length > 0) {
        const list = res.result.map((item: any) => {
          return { value: item.id, label: item.name };
        });
        this.medGroupList = list;
      }
    })
  }
  // 指定id获取探索数据
  getMediaOnlyId(id: any) {
    this.mediaExploreSourceService.getOneMediaExplore(id).then((res: any) => {
      if (res.code == 200 && res.result) {
        let channel: any, customer: any;
        if (res.result.channelId) {
          this.medId = res.result.channelId.split(',')
        }
        if (res.result.customerGroup) {
          this.peoId = res.result.customerGroup.split(',')
        }
        this.names = res.result.name;
        this.dataHandle(this.peoGroupList, this.peoId, this.peoGroupChecked);
        this.dataHandle(this.medGroupList, this.medId, this.medGroupChecked);
        this.medCheckCount = this.medGroupChecked;
        this.peocheckCount = this.peoGroupChecked;
      }
    })
  }
  // 处理编辑时已选中的数据
  dataHandle(data: any, idArr: any, checked: any) {
    data.forEach((item: any) => {
      for (let i = 0; i < idArr.length; i++) {
        if (item.value == idArr[i]) {
          item.checked = true;
          checked.push(item)
        }
      }
    })
  }

  // 确定所选数据
  handleOk() {
    this.peoCancel = JSON.stringify(this.peoGroupList);
    this.peoGroupChecked = [];
    this.peoId = [];
    this.peoGroupList.forEach((item: any) => {
      if (item.checked) {
        this.peoGroupChecked.push(item);
        this.peoId.push(item.value)
      }
    })
    this.modalVisible = false;
    if (this.peoGroupChecked.length > 0) {
      this.ispeoChecked = false

    }

  }
  Ok() {
    this.medCancel = JSON.stringify(this.medGroupList);
    this.medGroupChecked = [];
    this.medId = [];
    this.medGroupList.forEach((item: any) => {
      if (item.checked) {
        this.medGroupChecked.push(item);
        this.medId.push(item.value);
      }
    })
    this.mediaVisible = false;
    if (this.medGroupChecked.length > 0) {
      this.ismedChecked = false
    }
  }
  // 取消弹窗展示
  modalCancel() {
    this.modalVisible = false;
    this.peoGroupList = JSON.parse(this.peoCancel);
    this.onchangeLinks(this.peoGroupList)
  }
  Cancel() {
    this.mediaVisible = false;
    this.medGroupList = JSON.parse(this.medCancel);
    this.onchangeLink(this.medGroupList)
  }
  // 选择人群个数（ 未确定之前）
  onchangeLinks(list: Array<any>) {
    this.peocheckCount = [];
    if(list.length>0){
      list.forEach((item: any) => {
        if (item.checked) {
          this.peocheckCount.push(item);
        }
      })
    }
  }
  // 选择媒体个数（ 未确定之前）
  onchangeLink(list: Array<any>) {
    this.medCheckCount = [];
    if(list.length>0){
      list.forEach((item: any) => {
        if (item.checked) {
          this.medCheckCount.push(item);
        }
      })
    }
  }
  // 删除已选公共
  deleteData(list: any, item: any) {
    list.forEach((opt: any) => {
      if (opt == item) {
        opt.checked = false;
      }
    })
  }
  // 删除已选人群
  deletePeo(item: any) {
    this.deleteData(this.peoGroupList, item);
    this.onchangeLinks(this.peoGroupList);
    this.handleOk()
  }
  // 删除已选媒体
  deleteMed(item: any) {
    this.deleteData(this.medGroupList, item);
    this.onchangeLink(this.medGroupList);
    this.Ok()
  }

  // 提交
  save() {
    this._submitForm();
    if (this.validateForm.invalid || this.ispeoChecked == true || this.ismedChecked == true) {
      return;
    } else {

      let opt;
      if (this.levelId) {
        opt = {
          id: this.levelId,
          name: this.names,
          customerGroup: this.peoId.join(','),
          channelId: this.medId.join(','),
        }
        this.mediaExploreSourceService.updateMediaExplore(opt).then((res: any) => {
          if (res.code == 200) {
            this._message.success("更新成功")
          }
        })
      } else {
        opt = {
          name: this.names,
          customerGroup: this.peoId.join(','),
          channelId: this.medId.join(','),
        }

        this.mediaExploreSourceService.insertMediaExplore(opt).then((res: any) => {
          if (res.code == 200) {
            this._message.success("创建成功")
          }
        })
      }
    }
  }

}
