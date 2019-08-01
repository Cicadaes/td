import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminComponent } from "../../components/config/admin/admin.component";


const routes: Routes = [
    {
        path: '',
        component: AdminComponent
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

export class AdminRoutingModule {}