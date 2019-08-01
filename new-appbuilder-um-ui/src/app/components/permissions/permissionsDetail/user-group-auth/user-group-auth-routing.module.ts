import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGroupAuthComponent } from './user-group-auth.component';

const routes: Routes = [
    {
        path: '/:role',
        component: UserGroupAuthComponent
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

export class UserGroupAuthRoutingModule { }