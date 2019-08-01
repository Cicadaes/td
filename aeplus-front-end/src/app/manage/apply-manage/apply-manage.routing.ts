import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplyManageComponent } from './apply-manage.component';
import { AppPushComponent } from './app-push/app-push.component';
import { SmsEdmComponent } from './sms-edm/sms-edm.component';


const appRoutes: Routes = [
    {
        path: '',
        component: ApplyManageComponent,
        children: [
            {
                path: '',
                redirectTo: 'app-push',
                pathMatch: 'full'
            },
            {
                path: 'app-push',
                component: AppPushComponent
            },
            {
                path: 'sms-edm',
                component: SmsEdmComponent
            }
        ]
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

export class ApplyManageRoutingModule {

}
