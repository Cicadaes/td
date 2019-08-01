import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { TreeTableComponent } from './tree-table.component';
import {TreeTableService} from "./tree-table.service";

@NgModule({
    declarations: [
        TreeTableComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [TreeTableService],
    exports: [TreeTableComponent]
})
export class TreeTableModule {

}