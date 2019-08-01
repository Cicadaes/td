import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ApplyPushConfigComponent } from './../../components/config/apply-push-config/apply-push-config.component';

const routes: Routes = [
    {
        path: '',
        component: ApplyPushConfigComponent
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

export class ApplyPushConfigRoutingModule {}