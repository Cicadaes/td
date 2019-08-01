import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ProductCenterService } from '../../product-center.service';
import { Globals } from '../../../utils/globals';

@Component({
  selector: 'app-product-add-dialog',
  templateUrl: './product-add-dialog.component.html',
  styleUrls: ['./product-add-dialog.component.less'],
  providers: [ProductCenterService]
})
export class ProductAddDialogComponent implements OnInit, OnChanges {
  @Input() isVisible: string;
  @Input() data: any;
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

  constructor(public globals: Globals, private service: ProductCenterService) {}

  showModal(): void {
    this._isVisible = true;
  }

  hideModal(): void {
    this._isVisible = false;
    this.globals.resetBodyStyle();
    this.onHide.emit(this._isVisible);
  }

  _addProduct(data: any) {
    this.service.addProducts(data).subscribe((response: any) => {
      this._resetComponentStatus(response);
    });
  }

  _updateProduct(data: any) {
    this.service.updateProducts(data).subscribe((response: any) => {
      this._resetComponentStatus(response);
    });
  }

  _resetComponentStatus(response) {
    this._resetFormStatus();
    if (response) {
      if (response.success) {
        this.hideModal();
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
    if (data.id) {
      this._updateProduct(data);
    } else {
      this._addProduct(data);
    }
  }

  _onBackForm(data: any) {
    this._validateForm = data;
    if (!data.invalid && data.status !== 'PENDING') {
      this._isCanSubmitForm = true;
    } else {
      this._isCanSubmitForm = false;
    }
  }

  checkWeChatAppInfo(data: any) {
    this.service.checkWeChatAppInfo(data).subscribe((response: any) => {
      if (response.code === 200) {
        this._saveProduct(data);
      } else {
        this._resetFormStatus();
        this._systemError = {
          error: true,
          msg: response.message
        };
      }
    });
  }

  _onSubmitForm(data: any) {
    if (!data.invalid) {
      this._isConfirmLoading = true;
      if (data && data.value && data.value.miniprogramAppid && data.value.miniprogramSecret) {
        //                this.checkWeChatAppInfo(data.value);
        this._saveProduct(data.value);
      } else {
        this._saveProduct(data.value);
      }
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
    setTimeout(() => {
      this._isSubmitForm = false;
    }, 100);
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
  }

  ngOnInit() {}
}
