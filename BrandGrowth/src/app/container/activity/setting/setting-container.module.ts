import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../../config/shared/shared.module';

// import Components
import { SettingContainerComponent } from './setting-container.component';
import { BaseSettingContainerComponent } from './base-setting/base-setting-container.component'
import { ProtectSettingContainerComponent } from './protect-setting/protect-setting-container.component'
import { ConnectSettingContainerComponent } from './connect-setting/connect-setting-container.component'

// import Services
import { ShowBreadService } from '../../../services/guard/show-bread.service';
import { HideBreadService } from '../../../services/guard/hide-bread.service';
import { ShowFilterService } from '../../../services/guard/show-filter.service';
import { HideFilterService } from '../../../services/guard/hide-filter.service';
import { ShowNavService } from '../../../services/guard/show-nav.service';
import { HideNavService } from '../../../services/guard/hide-nav.service';
import { ShowTimeService } from '../../../services/guard/show-time.service';
import { HideTimeService } from '../../../services/guard/hide-time.service';
import { ShowCampService } from '../../../services/guard/show-camp.service';
import { HideCampService } from '../../../services/guard/hide-camp.service';

@NgModule({
    declarations: [
        SettingContainerComponent,
        BaseSettingContainerComponent,
        ProtectSettingContainerComponent,
        ConnectSettingContainerComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([{
            path: '',
            component: SettingContainerComponent,
            canActivate: [ShowNavService, ShowFilterService, ShowTimeService, ShowCampService],
            canDeactivate: [HideNavService, HideFilterService, HideTimeService, HideCampService],
            children: [{
                path: 'base-setting',
                component: BaseSettingContainerComponent,
            },
            {
                path: 'protect-setting',
                component: ProtectSettingContainerComponent,
            },
            {
                path: 'connect-setting',
                component: ConnectSettingContainerComponent,
            }]
        }, {
            path: 'connect-setting/create-connect/:name',
            loadChildren: './create-connect/create-connect.module#CreateConnectModule',
            canActivate: [ShowBreadService],
            canDeactivate: [HideBreadService]
        },
        {
            path: 'connect-setting/create-connect/:name/:id',
            loadChildren: './create-connect/create-connect.module#CreateConnectModule',
            canActivate: [ShowBreadService],
            canDeactivate: [HideBreadService]
        }])
    ],
    exports: [
        SettingContainerComponent
    ]
})
export class SettingContainerModule { }
