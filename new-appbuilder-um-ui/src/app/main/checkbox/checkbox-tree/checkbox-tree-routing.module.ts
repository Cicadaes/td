import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckboxTreeComponent } from './checkbox-tree.component';

const routes: Routes = [
    {
        path: '',
        component: CheckboxTreeComponent
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

export class CheckboxTreeRoutingModule { }