import { NgModule } from '@angular/core';
import { ReportfolderService } from './reportfolder.service';
import { ReportfolderComponent } from './reportfolder.component';
import { FormsModule } from '@angular/forms';
import { ReportfolderlistModule } from './reportfolder-list/reportfolder-list.module';
import { ReportfolderoperateModule } from './reportfolder-operate/reportfolder-operate.module';
import { ReportfolderAdvancedSearchModule } from './reportfolder-advanced-search/reportfolder-advanced-search.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        ReportfolderComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReportfolderlistModule,
        ReportfolderoperateModule,
        ReportfolderAdvancedSearchModule
    ],
    providers: [ReportfolderService],
    exports: [ReportfolderComponent]
})
export class ReportfolderModule {

}
