import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { deptAuthPageComponent } from './dept-auth-page.component';

const routes: Routes = [
    {
        path: '',
        component: deptAuthPageComponent
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

export class deptAuthPageRoutingModule { }