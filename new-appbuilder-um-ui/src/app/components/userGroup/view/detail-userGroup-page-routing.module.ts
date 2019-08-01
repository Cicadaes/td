import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailUserGroupPageComponent } from './detail-userGroup-page.component';

const routes: Routes = [
    {
        path: '',
        component: DetailUserGroupPageComponent
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

export class DetailUserGroupPageRoutingModule { }
