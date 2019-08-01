import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {PaginatorxModule} from '../../common/paginator/paginator.module';
import {
    DropdownModule,
    DialogModule,
    GrowlModule,
    ButtonModule,
    ConfirmDialogModule,
    CheckboxModule
} from 'primeng/primeng';
//module引入开始
import { DatePickerModule } from './../../common/datePicker/datePicker.module';
import { ApplyPushConfigRoutingModule } from './../../routers/config/apply-push-config.routing';

//component引入开始
import { ApplyPushConfigComponent } from './../../components/config/apply-push-config/apply-push-config.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ApplyPushConfigRoutingModule,
        DropdownModule,
        DialogModule,
        GrowlModule,
        ButtonModule,
        PaginatorxModule,
        ConfirmDialogModule,
        DatePickerModule,
        CheckboxModule
    ],
    declarations: [
        ApplyPushConfigComponent
    ],
    providers: []
})

export class ApplyPushConfigModule {}