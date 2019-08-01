import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, TemplateRef, ViewChild, HostListener, Renderer2, ElementRef, ViewContainerRef } from '@angular/core';
import { NzModalComponent } from 'ng-cosmos-ui';
import { UploadFile } from 'ng-cosmos-ui';

@Component({
    selector: 'upload-images',
    templateUrl: './upload-images.component.html',
    styleUrls: ['./upload-images.component.css']
})

export class UploadImagesComponent implements OnInit {
    cont: any; // 提示信息
    sizes: any; // 文件大小
    private _uploadParam: any;
    // http://172.23.5.202/console-api/attachmentController/uploadImage
    actionUrl: any = `${document.location.origin}/console-api/attachmentController/uploadImage`
    @Input() set uploadParam(uploadParam: any) {
        this._uploadParam = uploadParam;
        // console.log('13231',this._uploadParam);
    }
    @Output() onUpload = new EventEmitter<any>();
    @Output() onRemove = new EventEmitter<any>();
    @Output() onError = new EventEmitter<any>();
    fileList: any[] = [];
    previewImage = '';
    previewVisible = false;
    number = 1;
    // actionUrl = '';
    type = false;

    @ViewChild('uploadModal') uploadModalComp: NzModalComponent;
    @ViewChild('uploadModal', { read: ViewContainerRef }) uploadModalWrapRef: ViewContainerRef;
    @ViewChild('uploadwh') uploadwh: any;

    constructor(private renderer: Renderer2) {
    }

    // handlePreview = (file: UploadFile) => {
    //     this.previewImage = file.url || file.thumbUrl;
    //     this.uploadModalComp.open();
    //     const antModalMask = this.uploadModalWrapRef.element.nativeElement.querySelector("upload-images .ant-modal-wrap");
    //     this.renderer.listen(antModalMask, 'click', (ev: Event) => {
    //         ev.stopPropagation();
    //         this.close();
    //     });
    // }
    handlePreview = (file: UploadFile) => {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
        this.uploadModalComp.open();
    }

    aaa(e: any) {
        event.stopPropagation();
        this.previewVisible = false;
    }
    @Input() set size(cube: any) {
        if (cube) {
            this.sizes = cube;
        } else {
            this.sizes = 10000;
        }
    }
    beforeUpload = (file: File) => {
        const isJPG = file.type;
        if (isJPG === 'image/jpeg' || isJPG === 'image/jpg' || isJPG === 'image/png') {
            this.type = false;
        } else {
            this.type = true;
            this.cont = '上传的图片格式不正确,只支持jpg/png 格式图片.';
            this.onError.emit(this.type);
            return !this.type;
        }
        const isSize = file.size;
        this.sizes = this.sizes ? this.sizes : 1000;
        if (isSize < this.sizes * 1000) {
            this.type = false;
        } else {
            this.type = true;
            this.cont = '上传的图片超过' + this.sizes + 'k,只支持上传不超过' + this.sizes + 'k的图片.';
            this.onError.emit(this.type);
            return !this.type;
        }

    }

    uploadChange(info: any) {
        const fileList = info.fileList;
        // 2. read from response and show file link
        if (info.file.response) {
            info.file.url = info.file.response.url;
        }
        // 3. filter successfully uploaded files according to response from server
        this.fileList = fileList.filter((item: any) => {
            if (item.response) {
                // return item.response.status === 'success';
            }
            return true;
        });
        this.callback();
    }

    callback() {
        // console.dir([this.fileList]);
        this.onUpload.emit(this.fileList);
    }

    removeChange = (file: any) => {
        this.onRemove.emit(this.fileList);
        return true;
    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        this._uploadParam = changes.uploadParam.currentValue || {};
        this.fileList = this._uploadParam.list;
        this.number = this._uploadParam.number || 1;
        // this.actionUrl = this._uploadParam.apiUrl || '';
        this.onUpload.emit(this.fileList);
    }

    close() {
        this.uploadModalComp.close();
    }
}
