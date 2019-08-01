import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MetadataStep2ListComponent } from './metadata-step2-list.component';
import { MetadataStep2ListService } from './metadata-step2-list.service';
import { RouterModule } from '@angular/router';

import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { TableModule } from 'ng-cosmos-td-ui/src/base/table/table.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';

@NgModule({
    declarations: [
        MetadataStep2ListComponent
    ],
    imports: [
        FormModule,
        TableModule,
        RadioModule,
        InputModule,
        CheckboxModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        RouterModule
    ],
    providers:[MetadataStep2ListService],
    exports: [MetadataStep2ListComponent]
})
export class MetadataStep2ListModule {

}