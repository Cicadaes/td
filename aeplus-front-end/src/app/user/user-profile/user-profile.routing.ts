import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserProfileComponent} from './user-profile.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'user-profile',
        pathMatch: 'full'
    },
    {
        path: 'user-profile',
        component: UserProfileComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class UserProfileRoutingModule {

}
