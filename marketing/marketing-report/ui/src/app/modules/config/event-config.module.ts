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
import { EventConfigRoutingModule } from './../../routers/config/event-config.routing';

//component引入开始
import { EventConfigComponent } from './../../components/config/event-config/event-config.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        EventConfigRoutingModule,
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
        EventConfigComponent
    ],
    providers: []
})

export class EventConfigModule {}