import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UserConfiguredService } from '../../../user-configured.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit, OnChanges {
  @Output() cancelEtim = new EventEmitter<any>();
  @Output() saveEtim = new EventEmitter<any>();
  @Input() title: any = ''; // 编辑时候的title 父组件传入
  @Input() count: any = 0; // 编辑时候可选属性数量 父组件传入

  @Input() configuredObj: any; // 编辑时 常规配置还是用户洞察配置
  @Input() attributeData: any;
  attrTabId: any = 0; // 默认选中第一个属性
  allChecked = false; // 属性全选按钮选中状态
  indeterminate = false; // 属性全选按钮半选中状态
  chooseCount: any = 0;

  constructor(private userConfiguredService: UserConfiguredService, private message: NzMessageService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['attributeData'] && !changes['attributeData'].firstChange) {
      this.getCount();
    }
  }

  ngOnInit() {}

  // 取消
  cancel() {
    this.attrTabId = 0;
    this.cancelEtim.emit();
  }

  // 保存
  save() {
    const obj = {};
    obj['cofigMetaAttributeGroupDetails'] = [];
    obj['configMetaAattributeGroup'] = this.configuredObj;
    for (let i = 0; i < this.attributeData.length; i++) {
      if (this.attributeData[i]['attributeLabel']) {
        this.attributeData[i].attributeLabel.map(one => {
          if (one.checked === true) {
            const item = {};
            item['attributeCode'] = one.esfieldname;
            item['attributeId'] = one.id;
            item['type'] = 1; // 属性1，行为2
            obj['cofigMetaAttributeGroupDetails'].push(item);
          }
        });
      }
    }

    this.userConfiguredService.insertArrtibute(obj).subscribe((response: any) => {
      this.attrTabId = 0;
      this.saveEtim.emit();
    });
  }

  // 点击tab
  queryAttribute(index: any) {
    this.attrTabId = index;
    this.getCount();
  }

  // 全选
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.attributeData[this.attrTabId].attributeLabel.forEach(item => (item.checked = true));
    } else {
      this.attributeData[this.attrTabId].attributeLabel.forEach(item => (item.checked = false));
    }
  }

  // 选择某个属性
  updateSingleChecked(): void {
    this.getCount();
    if (this.count > 0 && this.chooseCount >= this.count) {
      this.message.info(`最多可选择"${this.count}"个属性`);
    }
  }

  getCount(): void {
    if (!this.attributeData.length && this.attributeData.length === 0) {
      return;
    }
    // 获取当前tab选择数
    let i = 0;
    this.attributeData[this.attrTabId].attributeLabel.map((item: any) => {
      if (item.checked) {
        i++;
      }
    });

    this.allChecked = i === this.attributeData[this.attrTabId].attributeLabel.length;
    this.indeterminate = i > 0 && i < this.attributeData[this.attrTabId].attributeLabel.length;

    // 获取总选择数
    let chooseCount = 0;
    for (let j = 0; j < this.attributeData.length; j++) {
      this.attributeData[j].attributeLabel.map((item: any) => {
        if (item.checked) {
          chooseCount++;
        }
      });
    }
    this.chooseCount = chooseCount;
  }

  // 删除某个选中的属性
  removeSelect(item: any) {
    item.checked = false;
    this.getCount();
  }
}
