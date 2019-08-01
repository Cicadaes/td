import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { MktProcessAdminComponent } from './../../components/config/mkt-process-admin/mkt-process-admin.component';


const routes: Routes = [
    {
        path: '',
        component: MktProcessAdminComponent
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

export class MktProcessAdminRoutingModule {}