import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filterComponent } from './filter.component';
import { FormsModule } from '@angular/forms';
import { CosmosModule } from 'ng-cosmos-td-ui/src/cosmos.module';
@NgModule({
    declarations: [
        filterComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosModule,
    ],
    exports: [filterComponent]
})
export class filterModule { }