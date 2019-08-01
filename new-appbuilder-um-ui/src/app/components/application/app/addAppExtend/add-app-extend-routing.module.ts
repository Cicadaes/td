import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAppExtendCompontent } from './add-app-extend.component';

const routes: Routes = [
    {
        path: '',
        component: AddAppExtendCompontent
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

export class AddAppExtendRoutingModule { }