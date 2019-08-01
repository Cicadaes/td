import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComMenuTreeComponent } from './cmMenuTree.component';
import { MenuViewModule } from './menuView/menuView.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        ComMenuTreeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        MenuViewModule
    ],
    exports: [ComMenuTreeComponent]
})
export class ComMenuTreeModule { }
