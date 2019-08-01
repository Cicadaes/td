import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CheckboxTreeService } from './checkbox-tree.service';

@Component({
  selector: 'checkbox-tree-dis',
  templateUrl: './checkbox-tree-dis.component.html',
  styleUrls: ['./checkbox-tree-dis.component.css']
})
export class CheckboxTreeDisComponent implements OnInit, OnDestroy {
  @Output() click = new EventEmitter();
  @Input() treeDatas: any[] = [];
  @Input() isSet: boolean = false;
  @Output() onBack = new EventEmitter<any>();

  isFirst: boolean = true;
  _cmData: any[];
  dataList: any[];
  constructor(private service: CheckboxTreeService) {

  }

  @Input()
  set cmData(cmData: any) {
    this.isFirst = false;
    this.treeDatas = cmData;
  }

  @Input()
  set cmSet(cmSet: boolean) {
    this.isSet = cmSet;
  }

  updateParentCheckbox(node: any) {
    if (node.children && Object.prototype.toString.call(node.children) === '[object Array]') {
      //   const len = node.children.length;
      let m = 0, n = 0;
      node.children.forEach((child: any) => {
        if (child.checked) m ++;   //  保存下一级中选中的个数
         // if (child.isSelect) n ++;  //  保存下一级中横杆的个数
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
          let item = node.children[i];
          item.checked = true;
          if (item.children && item.children.length > 0) {
            this.updateChildrenCheckbox(item);
          }
        }
      }
    } else {
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          let item = node.children[i];
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

  getChecked(data: any){
    if (data.children && Object.prototype.toString.call(data.children) === '[object Array]') {
     //    const len = data.children.length;
      let m = 0, n = 0;
      data.children.forEach((child: any) => {
        if (child.checked) m ++;   //  保存下一级中选中的个数
         // if (child.isSelect) n ++;  //  保存下一级中横杆的个数
      });
       // node.isSelect = ( n > 0 ) || ( m !== len && m > 0 );
       // node.checked = m === len;
      data.checked = (m > 0);
    }
    return data.checked;
  }

  onBackData(data: any, node: any) {
    this.dataList = node;
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
      return true
    } else if (data.children && data.children.length) {
      for (let item of data.children) {
        this.checkNodeChecked(item)
      }
    }
    return false
  }

}
