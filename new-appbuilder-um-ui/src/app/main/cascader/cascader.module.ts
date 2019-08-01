import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzInputModule } from 'ng-cosmos-ui';
import {NzCascaderModule} from 'ng-cosmos-ui';

import { CascaderComponent } from './cascader.component';

@NgModule({
    declarations: [
        CascaderComponent
    ],
    imports: [
        // NzCascaderModule,
        CommonModule,
        FormsModule,
        OverlayModule,
        NzInputModule
    ],
    exports: [CascaderComponent]
})
export class CascaderModule { }
