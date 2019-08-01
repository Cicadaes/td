import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportEmailComponent } from './report-email.component';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { ChartModule } from '../../../../common/chart/chart.module';
import { DateFormatPipeModule } from '../../../../../pipes/date-format-pipe';

@NgModule({
    imports: [
        CommonModule,
        NgZorroAntdModule,
        ChartModule,
        DateFormatPipeModule
    ],
    declarations: [
        ReportEmailComponent
    ],
    exports: [
        ReportEmailComponent
    ]
})
export class ReportEmailModule { }
