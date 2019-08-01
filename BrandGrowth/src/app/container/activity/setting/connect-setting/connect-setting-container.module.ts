
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../../../config/shared/shared.module';

// import Components
import { ConnectSettingContainerComponent } from './connect-setting-container.component';

@NgModule({
    declarations: [
      ConnectSettingContainerComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([{
            path: '',
            component: ConnectSettingContainerComponent
        }])
    ],
    exports: [
      ConnectSettingContainerComponent
    ]
})
export class ConnectSettingContainerModule { }

