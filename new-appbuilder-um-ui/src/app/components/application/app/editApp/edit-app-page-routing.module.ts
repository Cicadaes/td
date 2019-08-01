import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditAppPageComponent } from './edit-app-page.component';

const routes: Routes = [
    {
        path: '',
        component: EditAppPageComponent
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

export class EditAppPageRoutingModule { }