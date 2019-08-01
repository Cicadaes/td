import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {PaginatorxModule} from '../../common/paginator/paginator.module';
import {
    DropdownModule,
    GrowlModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule
} from 'primeng/primeng';
//module引入开始
import { AdminRoutingModule } from "../../routers/config/admin.routing";

//component引入开始
import { AdminComponent } from "../../components/config/admin/admin.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AdminRoutingModule,
        DropdownModule,
        GrowlModule,
        ButtonModule,
        DialogModule,
        ConfirmDialogModule,
        PaginatorxModule
    ],
    declarations: [
        AdminComponent
    ],
    providers: []
})

export class AdminModule {}