import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CampaignReportComponent } from './../../components/campaign/report/campaign-report.component';


const routes: Routes = [
    {
        path: '',
        component: CampaignReportComponent
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

export class CampaignReportRoutingModule {}