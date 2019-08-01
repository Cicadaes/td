import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { InnerMenuService } from './inner-menu.service';
import { InnerMenuComponent } from './inner-menu.component';
import { LogoModule } from '../logo/logo.module';

@NgModule({
    declarations: [
        InnerMenuComponent
    ],
    imports: [
        RouterModule,
        FormsModule,
        CommonModule,
        LogoModule,
        NgZorroAntdModule
    ],
    providers: [InnerMenuService],
    exports: [InnerMenuComponent]
})
export class InnerMenuModule { }
