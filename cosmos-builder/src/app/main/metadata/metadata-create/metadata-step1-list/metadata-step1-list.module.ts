import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetadataStep1ListComponent } from './metadata-step1-list.component';
import { MetadataStep1ListService } from './metadata-step1-list.service';

import { TableModule } from 'ng-cosmos-td-ui/src/base/table/table.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';

@NgModule({
    declarations: [
        MetadataStep1ListComponent
    ],
    imports: [
        TableModule,
        RadioModule,
        FormsModule,
        CommonModule
    ],
    providers:[
        MetadataStep1ListService,
    ],
    exports: [MetadataStep1ListComponent]
})
export class MetadataStep1ListModule {

}