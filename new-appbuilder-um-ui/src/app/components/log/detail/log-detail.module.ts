import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { LogDetailService } from './log-detail.service';
import { LogDetailComponent } from './log-detail.component';
import { LogDetailRoutingModule } from './log-detail-routing.module';
import { DateFormatPipeModule } from '../../../pipes/dateFormat-pipe';

@NgModule({
    declarations: [
        LogDetailComponent
    ],
    imports: [
        ReactiveFormsModule,
        DateFormatPipeModule,
        FormsModule,
        CommonModule,
        LogDetailRoutingModule,
        NgZorroAntdModule
    ],
    providers: [LogDetailService],
    exports: [LogDetailComponent]
})
export class LogDetailModule {

}
