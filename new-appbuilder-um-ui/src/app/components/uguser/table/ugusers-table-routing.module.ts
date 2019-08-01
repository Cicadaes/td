import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UgUsersTableComponent} from './ugusers-table.component';

const routes: Routes = [
    {
        path: '',
        component: UgUsersTableComponent
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

export class UgUsersTableRoutingModule { }