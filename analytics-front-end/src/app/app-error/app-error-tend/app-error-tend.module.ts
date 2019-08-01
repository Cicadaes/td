import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppErrorTendComponent } from './app-error-tend.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';
import { LoadingAndNoDataModule } from 'src/app/common/loading-and-no-data/loading-and-no-data.module';

@NgModule({
  imports: [CommonModule, NgZorroAntdModule, NgxEchartsModule, LoadingAndNoDataModule],
  declarations: [AppErrorTendComponent],
  exports: [AppErrorTendComponent]
})
export class AppErrorTendModule {}
