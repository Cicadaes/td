import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { FunctionTableComponent } from './function-table.component';
import {FunctionTableService} from "./function-table.service";
import {FunctionTableRoutingModule} from "./function-table-routing.module";

@NgModule({
    declarations: [
        FunctionTableComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        FunctionTableRoutingModule,
        NgZorroAntdModule
    ],
    providers: [FunctionTableService],
    exports: [FunctionTableComponent]
})
export class FunctionTableModule {

}