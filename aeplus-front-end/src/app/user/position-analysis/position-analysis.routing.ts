import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PositionAnalysisComponent} from './position-analysis.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'position',
        pathMatch: 'full'
    },
    {
        path: 'position',
        component: PositionAnalysisComponent
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
export class PositionAnalysisRoutingModule {

}
