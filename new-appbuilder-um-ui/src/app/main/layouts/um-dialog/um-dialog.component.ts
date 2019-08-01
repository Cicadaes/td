import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
// import { LogoService } from "./logo.service";
//
// import { Router, NavigationEnd } from '@angular/router'

@Component({
  selector: 'um-dialog',
  templateUrl: './um-dialog.component.html',
  styleUrls: ['./um-dialog.component.css']
})


export class UmDialogComponent implements OnInit {


  @Input() dialogTil = '' ; /** 弹窗的表头 */
  @Input() isVisible  = false ; /** 是否显示弹窗 */
  @Input() dialogCb: any;
  @Output() cancel = new EventEmitter<any>();
  @Output() oking = new EventEmitter<any>();

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnInit(): void {

  }

  /**
   * 弹窗取消操作
   */
  private handleCancel(): void {
    this.isVisible = false;
    this.cancel.emit(false);
    // this.dialogCb && this.dialogCb.handleCancel && this.dialogCb.handleCancel()
  }

  /**
   * 弹窗确定操作
   */
  private handleOk(): void {
    this.isVisible = false;
    this.oking.emit(false);
  }

}
