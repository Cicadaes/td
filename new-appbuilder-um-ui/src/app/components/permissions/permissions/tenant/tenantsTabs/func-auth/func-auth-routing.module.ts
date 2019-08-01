import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuncAuthComponent } from './func-auth.component';

const routes: Routes = [
    {
        path: '',
        component: FuncAuthComponent
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

export class FuncAuthRoutingModule { }