import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTenantPageComponent } from './add-tenant-page.component';

const routes: Routes = [
    {
        path: '',
        component: AddTenantPageComponent
    }, {
        path: 'tenants',
        data: { title: '租户列表', url: '/tenants' },
        loadChildren: '../table/tenants-table.module#TenantsTableModule'
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

export class AddTenantPageRoutingModule { }
