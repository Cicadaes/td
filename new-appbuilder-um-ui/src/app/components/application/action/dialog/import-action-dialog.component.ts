import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ImportActionDialogService } from './import-action-dialog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'import-action-dialog',
    templateUrl: './import-action-dialog.component.html',
})
export class ImportActionDialogComponent implements OnInit, OnChanges {
    @Input() action: boolean;
    @Input() isShow = false;
    @Input() inport = false;
    @Input() cancelInport = false;
    @Output() close = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();
    fileList: any[] = [];
    isNeedSubmitAddActionFormData: boolean;
    isVisible = false;
    isConfirmLoading = false;
    msg: string;
    appIconFile: any = {
        list: [],
        number: 1,
        apiUrl: 'attachmentController/uploadImage'
    };

    //  3 --- 文件类型不正确
    //  2 --- 文件为空
    //  1 --- 后端返回的错误信息
    errorCode = -1;

    constructor(
        private service: ImportActionDialogService,
        private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.appIconFile.list = [];
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isShow && changes.isShow.currentValue) {
            this.isShow = changes.isShow.currentValue;
        } else {
            this.isShow = false;
        }
        if (this.isShow) {
            this.errorCode = -1;
            this.showModal();
        }
        if (changes.cancelInport && changes.cancelInport.currentValue) {
            this.handleCancel(event);
        }
        if (changes.inport && changes.inport.currentValue) {
            this.handleOk(event);
        }
    }

    submitAddActionForm(data: any) {
        this.isNeedSubmitAddActionFormData = false;
        if (data.status === 'VALID') {
            this.isConfirmLoading = true;
            /*this.service.addAction(data.value).subscribe((data: any) => {
                this.isVisible = false;
                this.isConfirmLoading = false;
                this.onClose.emit(this.isVisible);
            })*/
        }
    }

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
    }

    handleOk = (e: any) => {
        this.isNeedSubmitAddActionFormData = true;
        if (this.checkFile(this.fileList)) {
            const formData = new FormData();
            this.fileList.forEach((file: any) => {
                formData.append('files[]', file);
            });
            const appId = this.activatedRoute.snapshot.params['id'];
            this.service.handleUpload(formData, appId).subscribe((event: any) => {
                if (event.body.success) {
                    this.isVisible = false;
                    this.errorCode = 0;
                    this.fileList = [];
                    this.initappIconFile();
                    this.onSubmit.emit(this.isVisible);
                    this.close.emit();
                } else {
                    this.msg = event.body.msg;
                    this.errorCode = 1;
                }
            }, (err) => {
            });
        }
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.errorCode = 0;
        this.appIconFile = {
            list: [],
            number: 1,
            apiUrl: 'attachmentController/uploadImage'
        };
    }

    onUploadAppIconFile(files: any[]) {
        this.fileList = files;
        this.errorCode = 0;
        //  this.checkFile(this.fileList)
        //  if (files.length > 0) {
        //    this.fileList = files;
        //    this.errorCode = 0;
        //  }
    }

    /**
     * 上传时的校验出错的监听
     * @param  {number = -1}          errorCode [description]
     * @return {[type]}      [description]
     */
    onErrorFile(typeEror: boolean = false) {
        // typeEror && (this.errorCode = 3)
    }

    initappIconFile() {
        this.appIconFile = {
            list: [],
            number: 1,
            apiUrl: 'attachmentController/uploadImage'
        };
    }

    onChangeFile() {
        this.errorCode = -1;
    }

    //  校验
    /**
     * 校验文件
     * @return {[type]} [description]
     */
    private checkFile(file: any) {
        if (file && file.length) {
            if (this.checkFileFormat(file)) {   /** 文件类型不正确 */
                this.errorCode = 3;
                return false;
            }
        } else {   /** 文件为空 */
            this.errorCode = 2;
            return false;
        }
        return true;
    }

    /**
     * 校验文件格式是否正确
     * @param  {string = ''}          type [description]
     * @return {[type]}      [description]
     */
    private checkFileFormat(file: any) {
        const fileTYpe = file[0].type;
        if (fileTYpe) {
            return fileTYpe !== 'application/json';
        } else {
            const a = file[0].name.substr(file[0].name.lastIndexOf('.')).toLowerCase();
            if (a === '.json') {
                return false;
            } else {
                return true;
            }
        }
    }
}
