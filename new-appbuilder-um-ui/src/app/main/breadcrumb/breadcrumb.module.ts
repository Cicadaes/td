import { BreadcrumbRoutingModule } from './breadcrumb-routing.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { BreadcrumbComponent } from './breadcrumb.component';

@NgModule({
    declarations: [
        BreadcrumbComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        BreadcrumbRoutingModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [BreadcrumbComponent]
})
export class BreadcrumbModule {

}