import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthLicencesTableComponent} from './auth-licences-table.component';

const routes: Routes = [
    {
        path: '',
        component: AuthLicencesTableComponent
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

export class AuthLicencesTableRoutingModule { }