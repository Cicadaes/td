import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantsTableComponent } from './tenants-table.component';

const routes: Routes = [
    {
        path: '',
        component: TenantsTableComponent
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

export class TenantsTableRoutingModule { }
