import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdditionalAppsTableComponent } from './additional-apps-table.component';

const routes: Routes = [
    {
        path: '',
        component: AdditionalAppsTableComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class AdditionalAppsTableRoutingModule { }