import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ActivityCenterComponent} from './activity-center.component';

const appRoutes: Routes = [
    {
        path: '',
        component: ActivityCenterComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ActivityCenterRoutingModule {

}
