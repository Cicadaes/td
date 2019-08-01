import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { CheckboxTreeService } from './checkbox-tree.service';
import { NzModalService } from 'ng-cosmos-ui';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode } from 'ng-cosmos-ui';

@Component({
  selector: 'checkbox-tree',
  templateUrl: './checkbox-tree.component.html',
  styleUrls: ['./checkbox-tree.component.css']
})
export class CheckboxTreeComponent implements OnInit, OnDestroy, OnChanges {
  @Output() click = new EventEmitter();
  @Input() treeDatas: any[] = [];
  @Input() isSet = false;
  @Output() onBack = new EventEmitter<any>();
  isFirst = true;
  _cmData: any[];
  constructor(private service: CheckboxTreeService, private confirmServ: NzModalService) {

  }

  @Input()
  set cmData(cmData: any) {
    this.isFirst = false;
    this.treeDatas = cmData;
    // console.log('this.treeDatas', this.treeDatas);
  }

  @Input()
  set cmSet(cmSet: boolean) {
    this.isSet = cmSet;
  }

  updateParentCheckbox(node: any) {
    if (node.children && Object.prototype.toString.call(node.children) === '[object Array]') {
      // const len = node.children.length;
      let m = 0;
      node.children.forEach((child: any) => {
        if (child.checked) m++;  // 保存下一级中选中的个数
        // if (child.isSelect) n ++; // 保存下一级中横杆的个数
      });
      // node.isSelect = ( n > 0 ) || ( m !== len && m > 0 );
      // node.checked = m === len;
      node.checked = (m > 0);
    }
    return node;
  }

  updateChildrenCheckbox(node: any) {
    if (!this.isSet || !node) {
      return false;
    }
    if (node.checked) {
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          const item = node.children[i];
          item.checked = true;
          if (item.children && item.children.length > 0) {
            this.updateChildrenCheckbox(item);
          }
        }
      }
    } else {
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          const item = node.children[i];
          item.checked = false;
          if (item.children && item.children.length > 0) {
            this.updateChildrenCheckbox(item);
          }
        }
      }
    }
  }

  checkNeedChecked(list: any[]) {
    let checked = false;
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].checked) {
          checked = true;
          break;
        }
      }
    }
    return checked;
  }

  onBackData(data: any, node: any) {
    // console.dir([data,node]);
    if (node) {
      node.checked = this.checkNeedChecked(node.children);
      // this.onBack.emit(node);
      this.onBack.emit(this.updateParentCheckbox(node));
    }
  }

  updateCheckbox(isChecked: boolean, node: any) {
    this.updateChildrenCheckbox(node);
    this.onBack.emit(node);
  }

  ngOnInit() {
    this._cmData = this.treeDatas;
  }

  ngOnDestroy() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isSet) {
      this.isSet = changes.isSet.currentValue || false;
    }

    if (changes.treeDatas) {
      this._cmData = changes.treeDatas.currentValue || [];
    }
  }

  /**
   * 检查是否有选中
   * @return {[type]} [description]
   */
  private checkNodeChecked(data: any) {
    if (data && data.checked) {
      return true;
    } else if (data.children && data.children.length) {
      for (const item of data.children) {
        this.checkNodeChecked(item);
      }
    }
    return false;
  }

}
