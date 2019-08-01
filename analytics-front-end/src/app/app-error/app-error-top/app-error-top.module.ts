import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppErrorTopComponent } from './app-error-top.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingAndNoDataModule } from 'src/app/common/loading-and-no-data/loading-and-no-data.module';

@NgModule({
  // tslint:disable-next-line:max-line-length
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    LoadingAndNoDataModule
  ],
  declarations: [AppErrorTopComponent],
  exports: [AppErrorTopComponent]
})
export class AppErrorTopModule {}
