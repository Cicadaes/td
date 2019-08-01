import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantsAppTableComponent } from './tenants-app-table.component';

const routes: Routes = [
    {
        path: '',
        component: TenantsAppTableComponent
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

export class TenantsAppTableRoutingModule { }