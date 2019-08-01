import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddUgUsersTableComponent} from './add-ugusers-table.component';

const routes: Routes = [
    {
        path: '',
        component: AddUgUsersTableComponent
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

export class AddUgUsersTableRoutingModule { }
