import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuViewComponent } from './menuView.component';
import {FormsModule} from '@angular/forms';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        MenuViewComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule
    ],
    exports: [MenuViewComponent]
})
export class MenuViewModule { }
