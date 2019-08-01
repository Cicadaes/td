import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DetailTenantUserPageComponent} from './detail-tenantuser-page.component';

const routes: Routes = [
    {
        path: '',
        component: DetailTenantUserPageComponent
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

export class DetailTenantUserPageRoutingModule { 
    constructor() {
        console.log('=====DetailTenantUserPageRoutingModule');
    }
}
