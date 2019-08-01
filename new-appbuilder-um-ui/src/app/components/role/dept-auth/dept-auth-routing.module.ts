import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeptAuthComponent } from './dept-auth.component';

const routes: Routes = [
    {
        path: '',
        component: DeptAuthComponent
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

export class DeptAuthRoutingModule { }