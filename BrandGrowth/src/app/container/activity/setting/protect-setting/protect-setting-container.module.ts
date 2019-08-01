import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../../../config/shared/shared.module';

// import Components
import { ProtectSettingContainerComponent } from './protect-setting-container.component';

@NgModule({
    declarations: [
      ProtectSettingContainerComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([{
            path: '',
            component: ProtectSettingContainerComponent
        }])
    ],
    exports: [
      ProtectSettingContainerComponent
    ]
})
export class ProtectSettingContainerModule { }
