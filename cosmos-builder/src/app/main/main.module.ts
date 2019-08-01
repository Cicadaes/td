import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainService } from './main.service';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { DropdownModule } from 'ng-cosmos-td-ui/src/base/dropdown/dropdown.module';
import { BreadcrumbModule } from 'ng-cosmos-td-ui/src/base/breadcrumb/breadcrumb.module';
import { LeftModule } from './left/left.module';
import { ReportconfigModule } from './reportconfig/reportconfig.module';

@NgModule({
    declarations: [
        MainComponent
    ],
    imports: [
        CommonModule,
        DropdownModule,
        BreadcrumbModule,
        LeftModule,
        ReportconfigModule,
        MainRoutingModule
    ],
    providers: [MainService],
    exports: [MainComponent]
})
export class MainModule {

}