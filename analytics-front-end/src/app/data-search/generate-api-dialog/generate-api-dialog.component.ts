import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DataSearchService } from '../data-search.service';
import { Globals } from '../../utils/globals';

@Component({
  selector: 'app-generate-api-dialog',
  templateUrl: './generate-api-dialog.component.html',
  styleUrls: ['./generate-api-dialog.component.less'],
  providers: [DataSearchService]
})
export class GenerateApiDialogComponent implements OnInit, OnChanges {
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

  constructor(public globals: Globals, private service: DataSearchService) {}

  showModal(): void {
    this._isVisible = true;
  }

  hideModal(): void {
    this._isVisible = false;
    this.globals.resetBodyStyle();
    this.onHide.emit(this._isVisible);
  }

  _generateApi(data: any) {
    this.service.generateApi(data).subscribe((response: any) => {
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

  _onBackForm(data: any) {
    this._validateForm = data;
    if (!data.invalid && data.status !== 'PENDING') {
      this._isCanSubmitForm = true;
    } else {
      this._isCanSubmitForm = false;
    }
  }

  _onSubmitForm(data: any) {
    if (!data.invalid) {
      this._isConfirmLoading = true;
      this._generateApi(data.value);
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
