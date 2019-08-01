import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DownloadPopoverComponent } from './download-popover.component';
import { DownloadPopoverService } from './download-popover.service';

@NgModule({
  declarations: [DownloadPopoverComponent],
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NgZorroAntdModule],
  providers: [DownloadPopoverService],
  exports: [DownloadPopoverComponent]
})
export class DownloadPopoverModule {}
