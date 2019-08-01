import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicencesTableComponent } from './licences-table.component';

const routes: Routes = [
    {
        path: '',
        component: LicencesTableComponent
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

export class LicencesTableRoutingModule { }