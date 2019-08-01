import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetadataStep3ListComponent } from './metadata-step3-list.component';
import { CommonModule } from '@angular/common';
import { MetadataStep3ListService } from './metadata-step3-list.service'


import { PaginationModule } from 'ng-cosmos-td-ui/src/base/pagination/pagination.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { TableModule } from 'ng-cosmos-td-ui/src/base/table/table.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';

@NgModule({
    declarations: [
        MetadataStep3ListComponent
    ],
    imports: [
        PaginationModule,
        SelectModule,
        CheckboxModule,
        InputModule,
        TableModule,
        FormsModule,
        CommonModule,
        ButtonModule
    ],
    providers:[MetadataStep3ListService],
    exports: [MetadataStep3ListComponent]
})
export class MetadataStep3ListModule {

}