import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MetadataStep3InfoComponent } from './metadata-step3-info.component';


import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { SwitchModule } from 'ng-cosmos-td-ui/src/base/switch/switch.module';

@NgModule({
    declarations: [
        MetadataStep3InfoComponent
    ],
    imports: [
        FormModule,
        SelectModule,
        RadioModule,
        InputModule,
        SwitchModule,
        ReactiveFormsModule,
        CommonModule
    ],
    exports: [MetadataStep3InfoComponent]
})
export class MetadataStep3InfoModule {

}