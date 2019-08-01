import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../../config/shared/shared.module';

// import Components
import { OverviewContainerComponent } from './overview-container.component';

@NgModule({
    declarations: [
        OverviewContainerComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([{
            path: '',
            component: OverviewContainerComponent
        }])
    ],
    exports: [
        OverviewContainerComponent,
    ]
})
export class OverviewContainerModule { }
