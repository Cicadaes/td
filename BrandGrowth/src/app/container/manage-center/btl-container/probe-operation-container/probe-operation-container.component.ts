import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CmMessageService } from 'ng-cosmos-td-ui';
import { BtlSourceService } from '../../../../services/source/btl.source.service';
import { Config } from '../../../../config/Interceptor/config';


@Component({
  selector: 'probe-operation-container',
  templateUrl: './probe-operation-container.component.html',
  styleUrls: ['./probe-operation-container.component.less'],
  providers: [
    BtlSourceService,
  ],
})
export class ProbeOperationContainerComponent implements OnInit {
  private downloadUrl: string = ''; // 下载模板的链接
  private validateForm: FormGroup; // 表单
  private operationType: boolean = true; // 新建（true） 编辑（false）
  private sourceFile: string = ''; // 编辑状态下返回的探针组文件名称

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private btlSourceService: BtlSourceService,
    private _message: CmMessageService,
  ) {
    // 初始化获取下载模板的URL，如果本地没有就发请求获取
    this.downloadUrl = `${Config.BASE_API_URL}/探针文件模板.csv`;
    /* const url = localStorage.getItem('TD_BG_BTL_PROBE_DOWNLOADURL');
    if (!url) {
      btlSourceService.getTemplate().then((res: any) => {
        if (res.code === 200) {
          this.downloadUrl = res.result;
          localStorage.setItem('TD_BG_BTL_PROBE_DOWNLOADURL', res.result);
        }
      });
    } else {
      this.downloadUrl = url;
    } */
    
    // 当前路由判断 创建（create）还是编辑（edit）
    const type = activatedRoute.snapshot.data.type === 'create';
    this.operationType = type;

    this.initForm(type);
  }

  ngOnInit() {
  }
  
  private fileList: any[] = [];
  beforeUpload = (file: any): boolean => {
    this.fileList = [file];
    this.probeFileState = false;
    this.probeFileType = false;
    return false;
  }

  /**
   * 初始化表单数据
   * @param flag [判断为创建（true）还是编辑（false）]
   */
  initForm(flag: boolean) {
    const formData = this.fb.group({
      type: [1],
      name: [null, [ Validators.required, Validators.maxLength(30) ]],
      remark: [null, [ Validators.required, Validators.maxLength(100) ]],
      probeFile: [null],
    });
    this.validateForm = formData;
    // 编辑状态获取区域数据
    if (!flag) {
      const id = this.activatedRoute.snapshot.queryParams.id;
      this.btlSourceService.getBtlById(id).then((res: any) => {
        if (res.code === 200) {
          const data = res.result.btl;
          this.sourceFile = data.sourceFile;
          this.validateForm.reset({
            type: 1,
            name: data.name,
            remark: data.remark,
          });
        }
      })
    }
  }

  // 提交表单数据
  private probeFileState: boolean = false; // 探针文件判断
  private probeFileType: boolean = false; // 探针文件类型判断
  submitForm() {
    // 判断文件格式是否为 CSV
    if (this.fileList.length > 0) {
      const file = this.fileList[0].name;
      const fileType = file.substring(file.lastIndexOf('.')).toLowerCase();
      this.probeFileType = fileType !== '.csv';
    }

    // 新建下没有上传文件(fileList.length === 0)
    if (this.operationType) {
      this.probeFileState = this.fileList.length === 0;
      this.validateForm.value.probeFile = this.fileList[0];
    } else {
      // 编辑下没有文件名称也没有上传文件
      this.probeFileState = this.fileList.length === 0 && this.sourceFile === '';
      this.validateForm.value.probeFile = this.fileList.length === 0 ? null : this.fileList[0];
    }
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }
    setTimeout(() => {
      const validFlag = this.validateForm.valid;
      if (validFlag && !this.probeFileState && !this.probeFileType) {
        this.submitFormData();
      }
    }, 100);
  }

  submitFormData() {
    const params = this.validateForm.value;
    if (!this.operationType) {
      params.btlId = this.activatedRoute.snapshot.queryParams.id;
    }
    const btlFn = this.operationType ? this.btlSourceService.addBtl(params) : this.btlSourceService.updateBtl(params);
    btlFn.then((res: any) => {
      if (res.code === 200) {
        this._message.success('提交成功！');
        this.onCancel();
      }
    });
  }

  // 取消表单填写 返回列表页面
  onCancel() {
    this.router.navigate(['/manage-center/btl']);
  }

  getFormControl(name: string) {
    return this.validateForm.controls[ name ];
  }
}
