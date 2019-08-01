import { ReportModule } from './../report/report.module';
import {PaginatorxModule} from '../../common/paginator/paginator.module';
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
	GrowlModule
} from 'primeng/primeng';
import { DateFromatPipeModule } from "../pipes/dateFormat-pipe.module";
import { CampaignReportRoutingModule } from './../../routers/campaign/campaign-report.routing';
import { AdsPromotionReportComponent } from "../../components/campaign/report/ads-promotion-report/ads-promotion-report.component";
import { GoalSelectComponent } from "../../components/campaign/report/goal-attainment/goal-select.component";

//service 引入
import { ErrorHandlingService } from "../../services/exceptional/error-handling.service";

@NgModule({
    imports: [
        CampaignReportRoutingModule,
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
        ReportModule
    ],
    declarations: [
        AdsPromotionReportComponent,
        GoalSelectComponent,
    ],
    providers:[
        ErrorHandlingService
    ]
})
export class CampaignReportModule {
    
}
