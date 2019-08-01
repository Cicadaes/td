import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { QuotaIndexAdminComponent } from "../../components/config/quota-index-admin/quota-index-admin.component";


const routes: Routes = [
    {
        path: '',
        component: QuotaIndexAdminComponent
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

export class QuotaIndexAdminRoutingModule {}