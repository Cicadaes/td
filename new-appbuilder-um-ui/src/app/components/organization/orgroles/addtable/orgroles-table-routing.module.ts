import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrgRolesTableComponent} from './orgroles-table.component';

const routes: Routes = [
    {
        path: '',
        component: OrgRolesTableComponent
    }
];

@NgModule({
    imports: [
        //RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class OrgRolesTableRoutingModule { }