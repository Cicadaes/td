import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MetadataStep2InfoComponent } from './metadata-step2-info.component';

import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';

@NgModule({
    declarations: [
        MetadataStep2InfoComponent
    ],
    imports: [
        FormModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule
    ],
    exports: [MetadataStep2InfoComponent]
})
export class MetadataStep2InfoModule {

}