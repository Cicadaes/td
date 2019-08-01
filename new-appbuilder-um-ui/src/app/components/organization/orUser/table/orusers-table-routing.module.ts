import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrUsersTableComponent} from './orusers-table.component';

const routes: Routes = [
    {
        path: '',
        component: OrUsersTableComponent
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

export class OrUsersTableRoutingModule { }