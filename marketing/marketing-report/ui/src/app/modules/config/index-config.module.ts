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
import { IndexConfigRoutingModule } from './../../routers/config/index-config.routing';

//component引入开始
import { IndexConfigComponent } from './../../components/config/index-config/index-config.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IndexConfigRoutingModule,
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
        IndexConfigComponent
    ],
    providers: []
})

export class IndexConfigModule {}