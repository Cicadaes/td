import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AdvancedTransFunnelService } from '../../../advanced-trans-funnel.service';
import { BaseComponent } from '../../../../../common/base-component';

@Component({
  selector: 'app-advanced-trans-funnel-user-save',
  templateUrl: './advanced-trans-funnel-user-save.component.html',
  styleUrls: ['./advanced-trans-funnel-user-save.component.less']
})
export class AdvancedTransFunnelUserSaveComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() isVisible: string;
  @Input() data: any;
  @Input() pageSource: any;
  @Input() queryParam: any;
  @Input() detailKey: any;
  @Output() onHide = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  _isVisible = false;
  _isConfirmLoading = false;
  _data: any;
  _isSubmitForm: boolean;
  _isCanSubmitForm: boolean;
  _validateForm: any = {};
  _systemError: any = {
    error: false,
    msg: ''
  };
  _queryParam: any;
  _detailKey: any;
  _pageSource: any;

  constructor(private service: AdvancedTransFunnelService, private injector: Injector) {
    super(injector);
    this._pageSource = this.route.snapshot.params['pageSource'];
  }

  showModal(): void {
    this._isVisible = true;
  }

  hideModal(): void {
    this._isVisible = false;
    this.onHide.emit(this._isVisible);
    this.globals.resetBodyStyle();
  }

  _add(data: any) {
    const param = Object.assign({}, this._queryParam);
    if (this._pageSource === 'advanced-trans-funnel') {
      param.detailKey = this._detailKey || '';
    }
    param.crowdName = data.crowdName;
    param.crowdDesc = data.crowdDesc;
    this.service.saveCrowd(param, this._pageSource).subscribe((response: any) => {
      this._resetComponentStatus(response);
    });
  }

  _update(data: any) {
    const param = this._queryParam;
    if (this._pageSource === 'advanced-trans-funnel') {
      param.detailKey = this._detailKey || '';
    }
    param.crowdName = data.crowdName;
    param.crowdDesc = data.crowdDesc;
    this.service.saveCrowd(param, this._pageSource).subscribe((response: any) => {
      this._resetComponentStatus(response);
    });
  }

  _resetComponentStatus(response) {
    this._resetFormStatus();
    if (response) {
      if (response.success) {
        this.hideModal();
        this.onSubmit.emit(true);
        this.message.create('success', response.msg);
      } else {
        //                this.message.create('warning', response.msg);
        this._systemError = {
          error: true,
          msg: response.msg
        };
      }
    }
  }

  _save(data: any) {
    if (data.id == null) {
      this._add(data);
    } else {
      this._update(data);
    }
  }

  _onBackForm(data: any) {
    this._validateForm = data;
    if (!data.invalid && data.status !== 'PENDING') {
      this._isCanSubmitForm = true;
    } else {
      this._isCanSubmitForm = false;
    }
    this._resetFormStatus();
  }

  _onSubmitForm(data: any) {
    if (data.valid) {
      this._isConfirmLoading = true;
      this._save(data.value);
    } else {
      setTimeout(() => {
        this._resetFormStatus();
      }, 100);
    }
  }

  _resetFormStatus() {
    this._isConfirmLoading = false;
    this._isSubmitForm = false;
  }

  handleOk(): void {
    this._isSubmitForm = true;
    this.globals.resetBodyStyle();
  }

  handleCancel(): void {
    this.globals.resetBodyStyle();
    this._isVisible = false;
    this.onHide.emit(this._isVisible);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isVisible) {
      this._isVisible = changes.isVisible.currentValue;
    }
    if (changes.data) {
      this._data = changes.data.currentValue;
    }
    if (changes.pageSource) {
      this._pageSource = changes.pageSource.currentValue;
    }
    if (changes.queryParam) {
      this._queryParam = changes.queryParam.currentValue;
    }
    if (changes.detailKey) {
      this._detailKey = changes.detailKey.currentValue;
    }
  }

  ngOnInit() {}
}
