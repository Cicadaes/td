import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MetadataListComponent } from './metadata-list.component';
import { PipeModule } from '../../../pipes/pipe.module';

import { TableModule } from 'ng-cosmos-td-ui/src/base/table/table.module';
@NgModule({
    declarations: [
        MetadataListComponent
    ],
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        RouterModule,
        PipeModule
    ],
    exports: [MetadataListComponent]
})
export class MetadataListModule {

}