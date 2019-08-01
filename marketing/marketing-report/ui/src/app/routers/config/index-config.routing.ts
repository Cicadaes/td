import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { IndexConfigComponent } from './../../components/config/index-config/index-config.component';

const routes: Routes = [
    {
        path: '',
        component: IndexConfigComponent
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

export class IndexConfigRoutingModule {}