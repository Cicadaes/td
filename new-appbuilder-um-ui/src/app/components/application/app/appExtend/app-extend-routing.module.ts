import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppExtendComponent } from './app-extend.component';

const routes: Routes = [
    {
        path: '',
        component: AppExtendComponent
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

export class AppExtendRoutingModule { }