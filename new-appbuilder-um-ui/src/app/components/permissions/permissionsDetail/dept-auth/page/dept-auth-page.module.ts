import { deptAuthPageRoutingModule } from './dept-auth-page-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { deptAuthPageComponent } from './dept-auth-page.component';
import { deptAuthPageService } from './dept-auth-page.service';



@NgModule({
    declarations: [
        deptAuthPageComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        deptAuthPageRoutingModule,
        // AddActionFormModule,
        NgZorroAntdModule
    ],
    providers: [deptAuthPageService],
    exports: [deptAuthPageComponent]
})
export class deptAuthPageModule {

}
