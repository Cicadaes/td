import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemSecurityConfigComponent } from './system-security-config.component';

const routes: Routes = [
    {
        path: '',
        component: SystemSecurityConfigComponent
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

export class SystemSecurityConfigRoutingModule { }