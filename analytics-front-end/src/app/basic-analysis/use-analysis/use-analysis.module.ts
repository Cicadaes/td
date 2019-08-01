import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseAnalysisComponent } from './use-analysis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { LengthOfUseComponent } from './length-of-use/length-of-use.component';
import { UsageFrequencyComponent } from './usage-frequency/usage-frequency.component';
import { AccessDepthComponent } from './access-depth/access-depth.component';
import { DateFormatPipeModule } from 'src/pipes/date-format-pipe';
import { UseAnalysisService } from './use-analysis.service';
import { LoadingAndNoDataModule } from 'src/app/common/loading-and-no-data/loading-and-no-data.module';
import { DateModule } from 'src/app/common/date/date.module';
import { NumberToThousandsPipeModule } from 'src/pipes/number-to-thousands-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    NgZorroAntdModule,
    DateFormatPipeModule,
    LoadingAndNoDataModule,
    DateModule,
    NumberToThousandsPipeModule
  ],
  declarations: [UseAnalysisComponent, LengthOfUseComponent, UsageFrequencyComponent, AccessDepthComponent],
  providers: [UseAnalysisService]
})
export class UseAnalysisModule {}
