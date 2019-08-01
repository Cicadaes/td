import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import Modules
import { SharedModule } from '../../../../config/shared/shared.module';

// import Components
import { ProtectDetailComponent } from './protect-detail.component';

@NgModule({
    declarations: [
      ProtectDetailComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([{
            path: '',
            component: ProtectDetailComponent
        }])
    ],
    exports: [
      ProtectDetailComponent
    ]
})
export class ProtectDetailModule { }
