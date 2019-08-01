import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CmMessageService } from 'ng-cosmos-td-ui';
import { BtlSourceService } from '../../../../services/source/btl.source.service';
import nzGlobalMonitor from '../../../../utils/nz-global-monitor';

@Component({
  selector: 'poi-operation-container',
  templateUrl: './poi-operation-container.component.html',
  styleUrls: ['./poi-operation-container.component.less'],
  providers: [
    BtlSourceService,
  ],
})
export class PoiOperationContainerComponent implements OnInit {
  private validateForm: FormGroup; // 表单
  private operationType: boolean = true; // 新建（true） 编辑（false）
  private poiMapShow: boolean = false; // poi 地图显示判断

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _message: CmMessageService,
    private btlSourceService: BtlSourceService,
  ) {
    // 当前路由判断 创建（create）还是编辑（edit）
    const type = activatedRoute.snapshot.data.type === 'create';
    this.operationType = type;

    this.initForm(type);
  }

  ngOnInit() {
  }

  /**
   * 初始化表单数据
   * @param flag [判断为创建（true）还是编辑（false）]
   */
  initForm(flag: boolean) {
    const formData = this.fb.group({
      type: [2],
      name: [null, [ Validators.required, Validators.maxLength(30) ]],
      remark: [null, [ Validators.required, Validators.maxLength(100) ]],
      poiJson: [null],
    });
    this.validateForm = formData;
    // 编辑状态获取区域数据
    if (!flag) {
      const id = this.activatedRoute.snapshot.queryParams.id;
      this.btlSourceService.getBtlById(id).then((res: any) => {
        if (res.code === 200) {
          const data = res.result;
          this.validateForm.reset({
            type: 2,
            name: data.btl.name,
            remark: data.btl.remark,
            poiJson: data.detail.poiJson,
          });
          this.selectedList = JSON.parse(data.detail.poiJson);
        }
      })
    }    
  }

  // 展示POI地图
  onChangePoiMap(flag: boolean) {
    this.poiMapShow = flag;
    this.poiJsonState = false;
    nzGlobalMonitor.setDocumentOverflowHidden(flag);
  }

  // 更改POI地图数据
  private selectedList: any[] = [];
  changePoiMapData(data: any) {
    this.selectedList = data;
    this.poiMapShow = false;
    nzGlobalMonitor.setDocumentOverflowHidden(false);
  }

  // 提交表单数据
  private poiJsonState: boolean = false; // 判断POI数据
  submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }
    this.poiJsonState = this.selectedList.length === 0;
    setTimeout(() => {
      const validFlag = this.validateForm.valid;
      if (validFlag && !this.poiJsonState) {
        this.submitFormData();
      }
    }, 100);
  }

  // 发送提交表单请求
  submitFormData() {
    const params = this.validateForm.value;
    params.poiJson = JSON.stringify(this.selectedList);
    if (!this.operationType) {
      params.btlId = this.activatedRoute.snapshot.queryParams.id;
    }
    const fn = this.operationType ?
      this.btlSourceService.addBtl(params) : this.btlSourceService.updateBtl(params);
    fn.then((res: any) => {
      if (res.code === 200) {
        this._message.success('提交成功！');
        this.onCancel();
      }
    });
  }

  /**
   * 取消某个区域
   * @param index [当前删除的索引]
   */
  delSelected(index: number) {
    this.selectedList = this.selectedList.filter((x: any, i: number) => (i !== index));
  }

  // 取消表单填写 返回列表页面
  onCancel() {
    this.router.navigate(['/manage-center/btl']);
  }

  getFormControl(name: string) {
    return this.validateForm.controls[ name ];
  }
}
