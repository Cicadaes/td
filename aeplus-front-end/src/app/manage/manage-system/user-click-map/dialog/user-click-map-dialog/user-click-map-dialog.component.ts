import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {UserClickMapService} from '../../user-click-map.service';
import {Globals} from '../../../../../utils/globals';

@Component({
    selector: 'app-user-click-map-dialog',
    templateUrl: './user-click-map-dialog.component.html',
    styleUrls: ['./user-click-map-dialog.component.less']
})
export class UserClickMapDialogComponent implements OnInit, OnChanges {
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

    constructor(private service: UserClickMapService,private golbals: Globals) {
    }

    showModal(): void {
        this._isVisible = true;
    }

    hideModal(): void {
        this._isVisible = false;
        this.golbals.resetBodyStyle();
        this.onHide.emit(this._isVisible);
    }

    _add(data: any) {
        this.service.add(data).subscribe((response: any) => {
            this._resetComponentStatus(response);
        });
    }

    _update(data: any) {
        this.service.update(data).subscribe((response: any) => {
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
    }

    _onSubmitForm(data: any) {
        if (!data.invalid) {
            this._isConfirmLoading = true;
            this._save(data.value);
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
    }

    handleCancel(): void {
        this._isVisible = false;
        this.golbals.resetBodyStyle();
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

    ngOnInit() {
    }

}
