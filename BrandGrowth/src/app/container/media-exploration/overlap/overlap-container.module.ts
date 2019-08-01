import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../../config/shared/shared.module';

// import Components
import { OverlapContainerComponent } from './overlap-container.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
      OverlapContainerComponent,
    ],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild([{
            path: '',
            component: OverlapContainerComponent
        }])
    ],
    exports: [
      OverlapContainerComponent,
    ]
})
export class OverlapContainerModule { }
