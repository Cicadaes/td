import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UgRolesTableComponent } from './ugroles-table.component';

const routes: Routes = [
    {
        path: '',
        component: UgRolesTableComponent
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

export class UgRolesTableRoutingModule { }
