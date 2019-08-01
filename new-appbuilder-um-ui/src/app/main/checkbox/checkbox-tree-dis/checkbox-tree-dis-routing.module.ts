import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckboxTreeDisComponent } from './checkbox-tree-dis.component';

const routes: Routes = [
    {
        path: '',
        component: CheckboxTreeDisComponent
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

export class CheckboxTreeDisRoutingModule { }