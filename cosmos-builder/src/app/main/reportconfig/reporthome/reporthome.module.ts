import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReporthomeService } from './reporthome.service';
import { ReporthomeComponent } from './reporthome.component';
import { FormsModule } from '@angular/forms';
import { ReportModule } from '../report/report.module';
import { ReportfolderModule } from '../reportfolder/reportfolder.module';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { TabsModule } from 'ng-cosmos-td-ui/src/base/tabs/tabs.module';
import { ReportHomeRoutingModule } from './reporthome-routing.module';

@NgModule({
    declarations: [
        ReporthomeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TabsModule,
        ReportModule,
        ReportfolderModule,
        ReportHomeRoutingModule
    ],
    providers: [ReporthomeService],
    exports: [ReporthomeComponent]
})
export class ReporthomeModule {

}
