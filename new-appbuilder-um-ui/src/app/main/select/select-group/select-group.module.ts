import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { SelectGroupComponent } from './select-group.component';
import { SelectGroupService } from './select-group.service';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule
    ],
    declarations: [
        SelectGroupComponent
    ],
    exports: [ SelectGroupComponent ],
    providers: [ SelectGroupService ]
})
export class SelectGroupModule {
}
