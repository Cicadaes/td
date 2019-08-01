import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MetadataDetailInfoComponent } from './metadata-detail-info.component';

import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
@NgModule({
    declarations: [
        MetadataDetailInfoComponent
    ],
    imports: [
        ButtonModule,
        FormModule,
        RouterModule,
        FormsModule,
        CommonModule
    ],
    exports: [MetadataDetailInfoComponent]
})
export class MetadataDetailInfoModule {

}