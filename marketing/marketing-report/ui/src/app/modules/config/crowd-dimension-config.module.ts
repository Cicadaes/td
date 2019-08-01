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
import { CrowdDimensionConfigRoutingModule } from "../../routers/config/crowd-dimension-config.routing";
//component引入开始
import { CrowdDimensionConfigComponent } from "../../components/config/crowd-dimension-config/crowd-dimension-config.component"; 

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CrowdDimensionConfigRoutingModule,
        DropdownModule,
        DialogModule,
        GrowlModule,
        ButtonModule,
        PaginatorxModule,
        ConfirmDialogModule
    ],
    declarations: [
        CrowdDimensionConfigComponent
    ],
    providers: []
})

export class CrowdDimensionConfigModule {}