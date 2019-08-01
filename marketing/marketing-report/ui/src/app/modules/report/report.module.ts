import {PaginatorxModule} from '../../common/paginator/paginator.module';
import { SelectChildCrowdCompoment } from './../../components/campaign/report/funnel/select-child-crowd.component';
import { FunnelTableComponent } from './../../components/campaign/report/funnel/funnel-table.component';
import { CommonChartsHandleComponent } from './../../components/campaign/report/common-charts-handle/common-charts-handle.component';
import { FunnelConpoment } from './../../components/campaign/report/funnel/funnel.component';
import { EffectComponent } from './../../components/campaign/report/effect/effect.component';
import { GoalSelectComponent } from './../../components/campaign/report/goal-attainment/goal-select.component';
import { GoalTableComponent } from './../../components/campaign/report/goal-attainment/goal-table.component';
import { CommonChartsComponent } from './../../components/campaign/report/common-charts/common-charts.component';
import { CommonSuccessDialogComponent } from './../../components/campaign/report/common-success-dialog/common-success-dialog.component';
import { AdsPromotionReportComponent } from './../../components/campaign/report/ads-promotion-report/ads-promotion-report.component';
import { PushPromotionReportComponent } from './../../components/campaign/report/push-promotion-report/push-promotion-report.component';
import { SmsPromotionReportComponent } from './../../components/campaign/report/sms-promotion-report/sms-promotion-report.component';
/**
 * Created by wangshouyun on 2017/2/27.
 */
import {NgModule}       from '@angular/core';
import {CommonModule}   from '@angular/common';
import {FormsModule}   from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
	SliderModule,
	ButtonModule,
	TabViewModule,
    CheckboxModule,
    DataTableModule,
    SharedModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    AutoCompleteModule,
    OverlayPanelModule,
	GrowlModule,
    ConfirmDialogModule
} from 'primeng/primeng';
import { DateFromatPipeModule } from "../pipes/dateFormat-pipe.module";
import { CampaignReportComponent } from './../../components/campaign/report/campaign-report.component';
import { AddFunnelComponent } from './../../components/campaign/report/funnel/add-funnel.component';
import {DatePickerModule} from "../../common/datePicker/datePicker.module";
import { FormatNumberPipeModule } from "../pipes/formatNumber.pipe.module";
import { EdmPromotionReportComponent } from '../../components/campaign/report/edm-promotion-report/edm-promotion-report.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SliderModule,
        ButtonModule,
        DataTableModule,
        SharedModule,
        HttpModule,
        TabViewModule,
        CheckboxModule,
        DialogModule,
        DropdownModule,
        InputTextModule,
        AutoCompleteModule,
        OverlayPanelModule,
	    GrowlModule,
        DateFromatPipeModule,
        PaginatorxModule,
        DatePickerModule,
        FormatNumberPipeModule,
        ConfirmDialogModule
    ],
    declarations: [
        SmsPromotionReportComponent,
        PushPromotionReportComponent,
        EdmPromotionReportComponent,
        CommonChartsComponent,
        CommonSuccessDialogComponent,
        CommonChartsHandleComponent,
        GoalTableComponent,
        FunnelConpoment,
        EffectComponent,
        FunnelTableComponent,
        SelectChildCrowdCompoment,
        CampaignReportComponent,
        AddFunnelComponent
    ],
    providers:[],
    exports:[
        CampaignReportComponent,
        SmsPromotionReportComponent,
        PushPromotionReportComponent,
        CommonChartsComponent,
        CommonSuccessDialogComponent,
        GoalTableComponent,
        FunnelConpoment,
        FunnelTableComponent,
        EffectComponent,
        SelectChildCrowdCompoment,
        CommonChartsHandleComponent,
        AddFunnelComponent
    ]
})
export class ReportModule {
    
}
