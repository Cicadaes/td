import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CampaignComponent } from "../../components/campaign/index/campaign.component";
import { CampaignOverviewComponent } from './../../components/campaign/index/campaign-overview.component';


const routes: Routes = [
    {
        path: '',
        component: CampaignComponent
    }, {
        path: ':id',
        loadChildren: '../../modules/campaign/campaign-detail.module#CampaignDetailModule'
    }, {
        path: 'report/:id',
        loadChildren: '../../modules/campaign/campaign-report.module#CampaignReportModule'
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

export class CampaignRoutingModule {}