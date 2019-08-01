import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'create-container',
  templateUrl: './create-container.component.html',
  styleUrls: ['./create-container.component.less']
})
export class CreateContainerComponent implements OnInit, OnDestroy {
  validateForm: FormGroup; // 响应式表单

  private static activityPermission: any = [ // 活动管理权限
    { label: '营销活动', value: '营销活动' },
    { label: '营销效果', value: '营销效果' },
    { label: '营销报告', value: '营销报告' },
    { label: '媒体探索', value: '媒体探索' },
    { label: '客群探索', value: '客群探索' },
    { label: '品牌增长', value: '品牌增长' },
    { label: '数据导出', value: '数据导出' },
  ];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      licensee: [ null, [ Validators.required, Validators.email ] ],
      activityPermission: [ CreateContainerComponent.activityPermission ]
    });
  }

  /**
   * 提交表单
   */
  _submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }
  }

  /**
   * 重置表单
   */
  _resetForm(): void {
    this.validateForm.reset();
  }

  ngOnDestroy(): void {

  }
}
