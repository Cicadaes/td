import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CrowdDimensionConfigComponent } from "../../components/config/crowd-dimension-config/crowd-dimension-config.component";

const routes: Routes = [
    {
        path: '',
        component: CrowdDimensionConfigComponent
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

export class CrowdDimensionConfigRoutingModule {}