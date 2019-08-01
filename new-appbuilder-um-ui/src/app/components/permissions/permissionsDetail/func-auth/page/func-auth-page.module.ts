import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { funcAuthPageComponent } from './func-auth-page.component';
import { funcAuthPageRoutingModule } from './func-auth-page-routing.module';
import { funcAuthPageService } from './func-auth-page.service';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
@NgModule({
    declarations: [
        funcAuthPageComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        funcAuthPageRoutingModule,
        NgZorroAntdModule
    ],
    providers: [funcAuthPageService],
    exports: [funcAuthPageComponent]
})
export class funcAuthPageModule {

}
