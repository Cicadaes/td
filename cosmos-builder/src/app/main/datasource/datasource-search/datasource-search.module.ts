import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DatasourceSearchService } from './datasource-search.service';
import { DatasourceSearchComponent } from './datasource-search.component';


import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';

@NgModule({
    declarations: [
        DatasourceSearchComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        InputModule,
        ButtonModule,
        FormModule,
        SelectModule
    ],
    providers: [DatasourceSearchService],
    exports: [DatasourceSearchComponent]
})
export class DatasourceSearchModule {

}
