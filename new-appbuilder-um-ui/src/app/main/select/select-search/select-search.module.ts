import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { SelectSearchComponent } from './select-search.component';
import { SelectSearchService } from './select-search.service';

@NgModule({
    declarations: [
        SelectSearchComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [SelectSearchService],
    exports: [SelectSearchComponent]
})
export class SelectSearchModule {

}
