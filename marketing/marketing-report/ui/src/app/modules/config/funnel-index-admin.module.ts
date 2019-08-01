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
import { FunnelIndexAdminRoutingModule } from "../../routers/config/funnel-index-admin.routing";

//component引入开始
import { FunnelIndexAdminComponent } from "../../components/config/funnel-index-admin/funnel-index-admin.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FunnelIndexAdminRoutingModule,
        DropdownModule,
        DialogModule,
        GrowlModule,
        ButtonModule,
        PaginatorxModule,
        ConfirmDialogModule
    ],
    declarations: [
        FunnelIndexAdminComponent
    ],
    providers: []
})

export class FunnelIndexAdminModule {}