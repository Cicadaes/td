import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TrainComponent} from './train/train.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'train',
        pathMatch: 'full'
    }, {
        path: 'train',
        component: TrainComponent,
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
export class NautilusRoutingModule {

}
