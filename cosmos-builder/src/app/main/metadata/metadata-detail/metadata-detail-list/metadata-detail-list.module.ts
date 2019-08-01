import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetadataDetailListComponent } from './metadata-detail-list.component';


import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { TableModule } from 'ng-cosmos-td-ui/src/base/table/table.module';
@NgModule({
    declarations: [
        MetadataDetailListComponent
    ],
    imports: [
        TableModule,
        FormsModule,
        CommonModule
    ],
    exports: [MetadataDetailListComponent]
})
export class MetadataDetailListModule {

}