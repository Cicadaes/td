import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataObjectDetailComponent } from './data-object-detail.component';
import { DataObjectDetailRoutingModule } from './data-object-detail-routing.module';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { DataObjectInstanceOperateComponent } from './data-object-instance-operate/data-object-instance-operate.component';
import { DataObjectOperateComponent } from './data-object-operate/data-object-operate.component';
import { DateFormatPipeModule } from 'src/app/pipes/dateFormat-pipe';
import { DataObjectDetailService } from './data-object-detail.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DataObjectDetailRoutingModule,
        NgZorroAntdModule,
        DateFormatPipeModule
    ],
    declarations: [
        DataObjectDetailComponent,
        DataObjectInstanceOperateComponent,
        DataObjectOperateComponent,
    ],
    providers: [
        DataObjectDetailService
    ]
})
export class DataObjectDetailModule { }
