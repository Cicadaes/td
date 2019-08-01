import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { funcAuthPageComponent } from './func-auth-page.component';

const routes: Routes = [
    {
        path: '',
        component: funcAuthPageComponent
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

export class funcAuthPageRoutingModule { }