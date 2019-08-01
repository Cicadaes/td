import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MetadataOperateComponent } from './metadata-operate.component';

import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
@NgModule({
    declarations: [
        MetadataOperateComponent
    ],
    imports: [
        FormsModule,
        RouterModule,
        ButtonModule
    ],
    exports: [MetadataOperateComponent]
})
export class MetadataOperateModule {

}