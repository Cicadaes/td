import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../../config/shared/shared.module';

// import Components
import { DetectionContainerComponent } from './detection-container.component';

@NgModule({
    declarations: [
        DetectionContainerComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([{
            path: '',
            component: DetectionContainerComponent
        }])
    ],
    exports: [
        DetectionContainerComponent
    ]
})
export class DetectionContainerModule { }
