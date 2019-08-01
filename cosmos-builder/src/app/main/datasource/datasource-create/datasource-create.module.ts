import { NgModule } from '@angular/core';
import { DatasourceCreateService } from './datasource-create.service';
import { DatasourceCreateComponent } from './datasource-create.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SwitchModule } from 'ng-cosmos-td-ui/src/base/switch/switch.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';

@NgModule({
    declarations: [
        DatasourceCreateComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule,
        SwitchModule,
        InputModule,
        ButtonModule,
        FormModule,
        SelectModule
    ],
    providers: [DatasourceCreateService],
    exports: [DatasourceCreateComponent]
})
export class DatasourceCreateModule {

}
