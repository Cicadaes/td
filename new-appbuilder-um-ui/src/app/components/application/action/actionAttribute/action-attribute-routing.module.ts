import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionAttributeComponent } from './action-attribute.component';

const routes: Routes = [
    {
        path: '',
        component: ActionAttributeComponent
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

export class ActionAttributeRoutingModule { }