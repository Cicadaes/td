import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'submit-upload-files',
  templateUrl: './submit-upload-files.component.html',
  styleUrls: ['./submit-upload-files.component.css']
})

export class SubmitUploadFilesComponent implements OnInit {
  @Input() uploadParam: any = {};
  @Output() onError = new EventEmitter<any>();
  @Output() onUpload = new EventEmitter<any>();
  @Output() onChangeFile = new EventEmitter<any>();

  fileList: any[] = [];
  previewImage = '';
  previewVisible = false;
  number: number = 1;
  actionUrl: string = '';
  uploading = false;
  nzdata: any;
  type: boolean = false;

  constructor() { }

  // beforeUpload = (file: any): boolean => {
  //   this.onChangeFile.emit()
  //   this.fileList.push(file);
  //   return false;
  // }

  handleUpload() {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    this.onUpload.emit(this.fileList);
    this.uploading = false;
  }

  beforeUpload = (file: File) => {
    this.fileList.push(file)
    this.onUpload.emit(this.fileList)
    return false
  }

  removeChange = (file: any) => {
    console.dir([this.fileList, file]);
    return true;
  }

  /**
   * 使用箭头函数才能拿到this（组件问题）
   * @param  {[type]} this.onChangeFile [description]
   * @return {[type]}                   [description]
   */
  onRemove = () => {
    this.onChangeFile.emit()
    return true;
  }

  ngOnInit() {
    this.nzdata = { aaa: 'bbb' };
  }

  ngOnChanges(changes: SimpleChanges) {
    this.uploadParam = changes.uploadParam.currentValue || {};
    this.fileList = this.uploadParam.list;
    this.number = this.uploadParam.number || 1;
    this.actionUrl = this.uploadParam.apiUrl || '';
    this.onUpload.emit(this.fileList);
  }

}
