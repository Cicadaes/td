import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUgRolesTableComponent } from './add-ugroles-table.component';

const routes: Routes = [
    {
        path: '',
        component: AddUgRolesTableComponent
    }
];

@NgModule({
    imports: [
        // RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class AddUgRolesTableRoutingModule { }
