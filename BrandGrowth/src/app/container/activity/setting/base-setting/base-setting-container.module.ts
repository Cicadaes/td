import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../../../config/shared/shared.module';

// import Components
import { BaseSettingContainerComponent } from './base-setting-container.component';

@NgModule({
    declarations: [
      BaseSettingContainerComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([{
            path: '',
            component: BaseSettingContainerComponent
        }])
    ],
    exports: [
      BaseSettingContainerComponent
    ]
})
export class BaseSettingContainerModule { }
