import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'upload-files',
    templateUrl: './upload-files.component.html',
    styleUrls: ['./upload-files.component.css']
})

export class UploadFilesComponent implements OnInit {
    @Input() uploadParam: any = {};
    @Output() onUpload = new EventEmitter<any>();
    fileList: any[] = [];
    previewImage = '';
    previewVisible = false;
    number: number = 1;
    actionUrl: string = '';

    constructor() {

    }

    handlePreview = (file: any) => {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
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
                //return item.response.status === 'success';
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
        // console.dir([this.fileList,file]);
        return true;
    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        this.uploadParam = changes.uploadParam.currentValue || {};
        this.fileList = this.uploadParam.list;
        this.number = this.uploadParam.number || 1;
        this.actionUrl = this.uploadParam.apiUrl || '';
        this.onUpload.emit(this.fileList);
    }
}