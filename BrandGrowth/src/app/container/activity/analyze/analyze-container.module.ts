import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../../config/shared/shared.module';

// import Components
import { AnalyzeContainerComponent } from './analyze-container.component';

@NgModule({
    declarations: [
        AnalyzeContainerComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([{
            path: '',
            component: AnalyzeContainerComponent
        }])
    ],
    exports: [
        AnalyzeContainerComponent
    ]
})
export class AnalyzeContainerModule { }
