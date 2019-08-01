import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {PaginatorxModule} from '../../common/paginator/paginator.module';
import {
    DropdownModule,
    DialogModule,
    GrowlModule,
    ButtonModule,
    ConfirmDialogModule
} from 'primeng/primeng';
//module引入开始
import { MktProcessAdminRoutingModule } from './../../routers/config/mkt-process-admin.routing';
import { DatePickerModule } from './../../common/datePicker/datePicker.module';

//component引入开始
import { MktProcessAdminComponent } from './../../components/config/mkt-process-admin/mkt-process-admin.component';
import { ProcessListComponent } from './../../components/config/mkt-process-admin/process-list.component';
import { OfflineListComponent } from './../../components/config/mkt-process-admin/offline-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MktProcessAdminRoutingModule,
        DropdownModule,
        DialogModule,
        GrowlModule,
        ButtonModule,
        PaginatorxModule,
        ConfirmDialogModule,
        DatePickerModule
    ],
    declarations: [
        MktProcessAdminComponent,
        ProcessListComponent,
        OfflineListComponent
    ],
    providers: []
})

export class MktProcessAdminModule {}