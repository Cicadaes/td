import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AdvancedTransFunnelService } from '../../../advanced-trans-funnel.service';
import { Globals } from '../../../../../utils/globals';
import { BaseComponent } from '../../../../../common/base-component';

@Component({
  selector: 'app-advanced-trans-funnel-user-export-success',
  templateUrl: './advanced-trans-funnel-user-export-success.component.html',
  styleUrls: ['./advanced-trans-funnel-user-export-success.component.less']
})
export class AdvancedTransFunnelUserExportSuccessComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() isShow: boolean;
  @Output() onClose = new EventEmitter<any>();

  _isVisible = false;

  constructor(private service: AdvancedTransFunnelService, public globals: Globals, private injector: Injector) {
    super(injector);
  }

  showModal = () => {
    this._isVisible = true;
  };

  _hideDialog() {
    this._isVisible = false;
    this.onClose.emit(this._isVisible);
    this.globals.resetBodyStyle();
  }

  goPage(hash: string) {
    this.commonService.goPage(hash);
  }

  handleOk = (e: any) => {
    this._hideDialog();
  };

  handleCancel = (e: any) => {
    this.globals.resetBodyStyle();
    this._isVisible = false;
    this.onClose.emit(this._isVisible);
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isShow && changes.isShow.currentValue) {
      this._isVisible = changes.isShow.currentValue;
    }
    if (this._isVisible) {
      this.showModal();
    }
  }

  ngOnInit() {}
}
