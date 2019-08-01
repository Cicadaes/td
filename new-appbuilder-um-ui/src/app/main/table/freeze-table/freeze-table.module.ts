import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { FreezeTableComponent } from './freeze-table.component';
import {FreezeTableService} from "./freeze-table.service";

@NgModule({
    declarations: [
        FreezeTableComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [FreezeTableService],
    exports: [FreezeTableComponent]
})
export class FreezTableModule {

}