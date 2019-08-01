import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuncAuthHomeComponent } from './func-auth-home.component';

const routes: Routes = [
    {
        path: '',
        component: FuncAuthHomeComponent
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

export class FuncAuthHomeRoutingModule { }