import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddOrgUsersTableComponent} from './add-orgusers-table.component';

const routes: Routes = [
    {
        path: '',
        component: AddOrgUsersTableComponent
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

export class AddOrgUsersTableRoutingModule { }