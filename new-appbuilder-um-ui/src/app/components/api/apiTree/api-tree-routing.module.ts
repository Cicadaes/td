import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiTreeComponent } from './api-tree.component';

const routes: Routes = [
    {
        path: '',
        component: ApiTreeComponent
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

export class ApiTreeRoutingModule { }
