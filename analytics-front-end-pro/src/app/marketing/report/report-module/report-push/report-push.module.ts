import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportPushComponent } from './report-push.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ChartModule } from '../../../../common/chart/chart.module';
import { DateFormatPipeModule } from '../../../../../pipes/date-format-pipe';

@NgModule({
    imports: [
        CommonModule,
        NgZorroAntdModule,
        DateFormatPipeModule,
        ChartModule
    ],
    declarations: [
        ReportPushComponent
    ],
    exports: [
        ReportPushComponent
    ]
})
export class ReportPushModule { }
