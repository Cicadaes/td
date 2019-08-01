import {NgModule} from '@angular/core';
import {
    RouterModule, Routes
} from '@angular/router';
import {DownloadDataComponent} from './download-data.component';

const appRoutes: Routes = [
    {
        path: '',
        component: DownloadDataComponent
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
export class DownloadDataRoutingModule {

}
