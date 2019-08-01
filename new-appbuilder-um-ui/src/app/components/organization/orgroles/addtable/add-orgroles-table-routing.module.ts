import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddOrgRolesTableComponent} from './add-orgroles-table.component';

const routes: Routes = [
    {
        path: '',
        component: AddOrgRolesTableComponent
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

export class AddOrgRolesTableRoutingModule { }