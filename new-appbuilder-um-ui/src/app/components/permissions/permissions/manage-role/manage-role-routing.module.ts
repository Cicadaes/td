import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { manageRoleComponent } from './manage-role.component';

const routes: Routes = [
    {
        path: '/:role',
        component: manageRoleComponent
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

export class manageRoleRoutingModule { }