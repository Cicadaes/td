import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { FunnelIndexAdminComponent } from "../../components/config/funnel-index-admin/funnel-index-admin.component";


const routes: Routes = [
    {
        path: '',
        component: FunnelIndexAdminComponent
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

export class FunnelIndexAdminRoutingModule {}