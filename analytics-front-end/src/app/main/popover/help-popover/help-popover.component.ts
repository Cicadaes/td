import { Component, Injector, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { HelpPopoverService } from './help-popover.service';
import { BaseComponent } from '../../../common/base-component';

@Component({
  selector: 'app-help-popover',
  templateUrl: './help-popover.component.html',
  styleUrls: ['./help-popover.component.less']
})
export class HelpPopoverComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() list: any[];
  @Input() width: any;
  @Input() paddingLeft: any;
  _width: any = {
    width: '70px'
  };
  _paddingLeft: any = {
    'padding-left': '70px'
  };
  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.width) {
      this._width = changes.width.currentValue;
    }
    if (changes.paddingLeft) {
      this._paddingLeft = changes.paddingLeft.currentValue;
    }
  }
}
