import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGroupsComponent } from './userGroups.component';

const routes: Routes = [
    {
        path: '',
        component: UserGroupsComponent
    }
    , {
        path: 'viewUserGroupDetail/:id',
        data: { title: '查看详情', innerMenu: true },
        loadChildren: './view/detail-userGroup-page.module#DetailUserGroupPageModule'
    }
    , {
        path: 'viewUserGroupDetail/:tenantId/:id',
        data: { title: '查看详情', innerMenu: true },
        loadChildren: './view/detail-userGroup-page.module#DetailUserGroupPageModule'
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

export class UserGroupsRoutingModule { }
