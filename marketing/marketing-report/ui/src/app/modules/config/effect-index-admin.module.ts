import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PaginatorxModule } from '../../common/paginator/paginator.module';
import {
    DropdownModule,
    DialogModule,
    GrowlModule,
    ButtonModule,
    ConfirmDialogModule
} from 'primeng/primeng';
//module引入开始
import { EffectIndexAdminRoutingModule } from "../../routers/config/effect-index-admin.routing";

//component引入开始
import { EffectIndexAdminComponent } from "../../components/config/effect-index-admin/effect-index-admin.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        EffectIndexAdminRoutingModule,
        DropdownModule,
        DialogModule,
        GrowlModule,
        ButtonModule,
        PaginatorxModule,
        ConfirmDialogModule
    ],
    declarations: [
        EffectIndexAdminComponent
    ],
    providers: []
})

export class EffectIndexAdminModule {}