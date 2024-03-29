import { Component, Output, EventEmitter, SimpleChanges, Injector } from '@angular/core';
import { AdvancedTransFunnelService } from '../../advanced-trans-funnel.service';
import { BaseComponent } from '../../../../common/base-component';

@Component({
  selector: 'app-advanced-trans-funnel-add-page',
  templateUrl: './advanced-trans-funnel-add-page.component.html',
  styleUrls: ['./advanced-trans-funnel-add-page.component.less']
})
export class AdvancedTransFunnelAddPageComponent extends BaseComponent {
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
  _funnelId: any;
  _cardTitle: any;
  tagName: any;
  sdkId: any;
  isVisitor: boolean;

  constructor(private service: AdvancedTransFunnelService, private injector: Injector) {
    super(injector);
    this._queryFunnelById();
  }

  _queryFunnelById() {
    this._funnelId = this.route.snapshot.params['id'];
    this.tagName = this.route.snapshot.params['tag'] || '';
    this.sdkId = this.route.snapshot.params['sdkId'] || '';
    this.isVisitor = this.route.snapshot.params['isVisitor'] == 'true' ? true : false;

    if (this._funnelId) {
      this._cardTitle = this.tagName
        ? this.tagName == 'miniprogram'
          ? '编辑小程序漏斗'
          : `编辑${this.tagName}漏斗`
        : '编辑漏斗';

      this.service.getById(this._funnelId).subscribe((response: any) => {
        console.dir([response]);
        if (response) {
          this._data = response.list || {};
        }
      });
    } else {
      if (
        this.isVisitor &&
        this.tagName != 'App' &&
        this.tagName != 'H5' &&
        this.tagName != 'miniprogram' &&
        this.tagName != 'Web'
      ) {
        this.commonService.goInto({
          name: '高级转化漏斗',
          url: `/scene-insight/advanced-trans-funnel/advanced-trans-funnel-app`
        });
      }
      this._cardTitle = this.tagName
        ? this.tagName == 'miniprogram'
          ? '添加小程序漏斗'
          : `添加${this.tagName}漏斗`
        : '添加漏斗';
    }
  }

  _add(data: any) {
    this.service.add(data).subscribe((response: any) => {
      this._resetComponentStatus(response);
      if (response.success) {
        this.message.create('success', response.msg);
        this.commonService.goBack();
      } else {
        this.message.create('error', response.msg);
      }
    });
  }

  _update(data: any) {
    this.service.update(data).subscribe((response: any) => {
      this._resetComponentStatus(response);
      if (response.success) {
        this.commonService.goBack();
        this.message.create('success', response.msg);
      } else {
        this.message.create('error', response.msg);
      }
    });
  }

  _resetComponentStatus(response) {
    this._resetFormStatus();
    if (response) {
      if (response.success) {
        this.onSubmit.emit(true);
      } else {
        this._systemError = {
          error: true,
          msg: response.msg
        };
      }
    }
  }

  _saveProduct(data: any) {
    const newData = data;
    newData.dateRange = `${this.globals.dateFormatNumber(data.dateRange[0], '')}~${this.globals.dateFormatNumber(
      data.dateRange[1],
      ''
    )}`;
    if (newData.id) {
      this._update(newData);
    } else {
      this._add(newData);
    }
  }

  _onBackForm(data: any) {
    this._validateForm = data;
    if (data.valid) {
      this._isCanSubmitForm = true;
    } else {
      this._isCanSubmitForm = false;
    }
  }

  _onSubmitForm(data: any) {
    if (!this.sdkId && this.isVisitor) {
      this.message.create('warning', '缺少sdkId参数');
      this.commonService.goInto({
        name: '高级转化漏斗',
        url: `/scene-insight/advanced-trans-funnel`
      });
      return;
    }
    if (data.valid) {
      this._isConfirmLoading = true;
      data.value.sdkId = this.sdkId;
      this._saveProduct(data.value);
    } else {
      this._resetFormStatus();
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
    this._isVisible = false;
    this.globals.resetBodyStyle();
    this.onHide.emit(this._isVisible);
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit() {}

  _cancel() {
    this.commonService.goBack();
  }
}
