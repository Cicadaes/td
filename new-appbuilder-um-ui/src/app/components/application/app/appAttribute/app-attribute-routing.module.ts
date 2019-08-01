import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppAttributeComponent } from './app-attribute.component';

const routes: Routes = [
    {
        path: '',
        component: AppAttributeComponent
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

export class AppAttributeRoutingModule { }