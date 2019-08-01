import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CampaignDetailComponent } from "../../components/campaign/detail/campaign-detail.component";
import { PushPromotionReportComponent } from './../../components/campaign/report/push-promotion-report/push-promotion-report.component';
import { SmsPromotionReportComponent } from './../../components/campaign/report/sms-promotion-report/sms-promotion-report.component';
import { CrowdPortraitComponent } from "../../components/campaign/detail/launch-unit/unit/sub-crowd-list/crowd-portrait.component";
import { PersonasComponent } from "../../components/campaign/detail/launch-unit/unit/personas.component";
import { EdmPromotionReportComponent } from "../../components/campaign/report/edm-promotion-report/edm-promotion-report.component";


const routes: Routes = [
    {
        path: '',
        component: CampaignDetailComponent
    },
    {
        path: 'smsreport/:id',
        component: SmsPromotionReportComponent
    },
    {
        path: 'pushreport/:id',
        component: PushPromotionReportComponent
    },
    {
        path: 'edmreport/:id',
        component: EdmPromotionReportComponent
    },
    {
        path: 'childPortrait',
        component: CrowdPortraitComponent
    },
    {
        path: 'personas',
        component: PersonasComponent
    },
    {
        path: 'automation/:pipeLineId',
        loadChildren: '../../modules/campaign/automation.module#AutoMationModule'
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class CampaignDetailRoutingModule {}