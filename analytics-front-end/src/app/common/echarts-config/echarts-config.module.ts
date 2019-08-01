import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EchartsConfigComponent } from './echarts-config.component';
import { LoadingAndNoDataModule } from 'src/app/common/loading-and-no-data/loading-and-no-data.module';
@NgModule({
  declarations: [EchartsConfigComponent],
  imports: [CommonModule, LoadingAndNoDataModule, NgxEchartsModule],
  exports: [EchartsConfigComponent]
})
export class EchartsConfigModule {}
