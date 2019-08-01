import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CmMessageService } from 'ng-cosmos-td-ui';

import { MonitorSourceService } from '../../../services/source/monitor.source.service';
import { ConsumerPortraitSourceService } from '../../../services/source/consumerPortrait.source.service';

@Component({
  selector: 'cusanalysis-operation-container',
  templateUrl: './cusanalysis-operation-container.component.html',
  styleUrls: ['./cusanalysis-operation-container.component.less'],
  providers: [
    CmMessageService,
    MonitorSourceService,
    ConsumerPortraitSourceService,
  ],
})
export class CusanalysisOperationContainerComponent implements OnInit {


  private validateForm: FormGroup; // 表单数据
  private metricDataList: any = [ // 事件数据类型
    {
      key: 10,
      value: '曝光',
    },
    {
      key: 20,
      value: '点击',
    },
  ];
  private dataRelationList: any = [ // 数据关联类型
    {
      key: 10,
      value: '并集',
    },
    {
      key: 20,
      value: '交集',
    },
  ];
  private modalVisible: boolean = false; // 监测链接选项弹窗
  private modalMonitorLinksList: any[] = []; // 弹窗监测链接的列表
  private saveMonitorLinks: string = ''; // 存储监测链接状态
  private modalSearch: any = ''; // 弹窗搜索字段
  private operationType: boolean = true; // 新建（true） 编辑（false）

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private monitor: MonitorSourceService,
    private consumerPortrait: ConsumerPortraitSourceService,
    private _message: CmMessageService,
  ) {
    // 当前路由判断 创建（create）还是编辑（edit）
    const type = activatedRoute.snapshot.data.type === 'create';
    this.operationType = type;

    this.getMonitorList();
    this.initForm(type);
  }

  ngOnInit() {
  }

  // 获取当前活动下的监测链接
  getMonitorList() {
    this.monitor.getAllMonitorLink().then((res: any) => {
      if (res.code === 200) {
        const data = res.result;
        let list = [];
        if (data.length > 0) {
          list = data.map((x: any) => {
            return {
              label: x.value,
              value: x.id,
            };
          });
        }
        this.modalMonitorLinksList = list;
        if (typeof this.getFormControl('monitorLinks').value === 'string') {
          this.changeLinksType();
        }
      }
    });
  }

  /**
   * 初始化表单数据
   * @param flag [判断创建还是编辑]
   */
  private editId: any = null; // 当前编辑的画像ID
  private editMonitorLinks: any = ''; // 编辑状态下暂存的已选项
  initForm(flag?: boolean) {
    const form = this.fb.group({
      name: [null, [ Validators.required, Validators.maxLength(30) ]],
      monitorLinks: [null],
      metricData: [10, [ Validators.required ]],
      dataRelation: [10, [ Validators.required ]],
    });
    this.validateForm = form;

    if (!flag) {
      const id = this.activatedRoute.snapshot.queryParams.id;
      this.consumerPortrait.getConsumerPortraitById(id).then((res: any) => {
        if (res.code === 200) {
          const data = res.result;
          this.editId = data.id;
          this.getFormControl('name').setValue(data.name);
          this.editMonitorLinks = data.monitorLinks;
          this.getFormControl('metricData').setValue(data.metricData);
          this.getFormControl('dataRelation').setValue(data.dataRelation);
          if (this.modalMonitorLinksList.length > 0) {
            this.changeLinksType();
          }
        }
      });
    }
  }

  getFormControl(name: string) {
    return this.validateForm.controls[ name ];
  }

  // 编辑状态下初始化监测链接默认选中状态
  changeLinksType() {
    const checked = this.editMonitorLinks;
    const list = checked.split(',');
    this.modalMonitorLinksList.map((item: any) => {
      const copy = item;
      if (list.indexOf(copy.value.toString()) > -1) {
        copy.checked = true;
      }
      return copy;
    })
    const select = this.modalMonitorLinksList.filter((x: any) => x.checked);
    this.getFormControl('monitorLinks').setValue(select);
    this.saveMonitorLinks = JSON.stringify(this.modalMonitorLinksList);
    this.checkedCount = select.length;
  }

  /**
   * 切换数据关系事件
   * @param key [选择的数据关系信息]
   */
  onCheckedRelation(key: any) {
    this.getFormControl('dataRelation').setValue(key);
  }

  /**
   * 监测链接列表内容切换选中事件
   * @param list [监测链接列表]
   */
  private checkedCount: number = 0; // 已选项个数
  onchangeLinks(list: any) {
    this.checkedCount = list.filter((x: any) => x.checked).length;
  }

  // 显示监测链接弹窗
  showModal() {
    this.modalVisible = true;
    this.saveMonitorLinks = JSON.stringify(this.modalMonitorLinksList);
  }

  // 提交监测链接选项
  handleOk() {
    this.saveMonitorLinks = JSON.stringify(this.modalMonitorLinksList);
    this.modalVisible = false;
    const select = this.modalMonitorLinksList.filter((item: any) => item.checked);
    if (select.length > 0) {
      this.getFormControl('monitorLinks').setValue(select);
    }
  }

  // 取消弹窗展示
  handleCancel() {
    this.modalVisible = false;
    setTimeout(() => {
      this.modalMonitorLinksList = JSON.parse(this.saveMonitorLinks);
      this.checkedCount = this.modalMonitorLinksList.filter((x: any) => x.checked).length;
    }, 0);
  }

  /**
   * 取消当前监测链接的选择
   */
  onDel(info: any) {
    this.modalMonitorLinksList.map((x: any) => {
      const copy = x;
      if (copy.value === info.value && copy.checked) {
        copy.checked = false;
      }
      return copy;
    });
    this.saveMonitorLinks = JSON.stringify(this.modalMonitorLinksList);
    const select = this.modalMonitorLinksList.filter((x: any) => x.checked);
    this.getFormControl('monitorLinks').setValue(select);
    this.checkedCount = select.length;
  }

  // 提交用户画像表单
  submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }

    setTimeout(() => {
      const validFlag = this.validateForm.valid;
      if (validFlag) {
        this.submitFormData();
      }
    }, 100);
  }

  // 发送提交请求
  submitFormData() {
    let params = this.validateForm.value;
    
    if (this.operationType) {
      params.monitorLinks = params.monitorLinks.map((x: any) => x.value).join(',');
    } else {
      params = {
        id: this.editId,
        monitor_Links: params.monitorLinks.map((x: any) => x.value).join(','),
        name: params.name,
        metricData: params.metricData,
        dataRelation: params.dataRelation,
      };
      // params.id = this.editId;
    }
    const fn = this.operationType ?
      this.consumerPortrait.insertConsumerPortrait(params) : this.consumerPortrait.updateConsumerPortrait(params);
    fn.then((res: any) => {
      if (res.code === 200) {
        this._message.success('提交成功！');
        this.router.navigate(['/cus-analysis']);
      }
    })
  }
}
