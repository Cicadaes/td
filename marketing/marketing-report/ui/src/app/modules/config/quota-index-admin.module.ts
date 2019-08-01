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
import { QuotaIndexAdminRoutingModule } from "../../routers/config/quota-index-admin.routing";

//component引入开始
import { QuotaIndexAdminComponent } from "../../components/config/quota-index-admin/quota-index-admin.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        QuotaIndexAdminRoutingModule,
        DropdownModule,
        DialogModule,
        GrowlModule,
        ButtonModule,
        PaginatorxModule,
        ConfirmDialogModule
    ],
    declarations: [
        QuotaIndexAdminComponent
    ],
    providers: []
})

export class QuotaIndexAdminModule {}