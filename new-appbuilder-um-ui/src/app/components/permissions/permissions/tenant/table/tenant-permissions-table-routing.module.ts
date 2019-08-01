import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantPermissionsTableComponent } from './tenant-permissions-table.component';


const routes: Routes = [
    {
        path: '',
        component: TenantPermissionsTableComponent
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

export class TenantPermissionsTableRoutingModule { }