import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { deptAuthTreeComponent } from './dept-auth-tree.component';

const routes: Routes = [
    {
        path: '',
        component: deptAuthTreeComponent
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

export class deptAuthTreeRoutingModule { }