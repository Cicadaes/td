import {
  Component,
  OnInit,
  Input,
  ContentChild,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'option-card',
  templateUrl: './option-card.component.html',
  styleUrls: ['./option-card.component.less']
})
export class OptionCardComponent implements OnInit {
  @ContentChild('optionImage') optionImage: TemplateRef<void>;

  @Input() isChecked: boolean = false; // 是否为选中状态 默认为未选中 false
  @Input() optionTitle: string = ''; // 标题
  @Input() optionInfo: string = ''; // 内容描述

  // 设置文字内容模块的高 默认104px
  private _height: any = 104;
  @Input() 
  set height(value: any) {
    this._height = value;
  }
  get height() {
    return this._height;
  }


  constructor() { }

  ngOnInit() {
  }

}
