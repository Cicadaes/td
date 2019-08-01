import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DialogModule} from 'primeng/primeng';
import {GrowlModule}    from 'primeng/primeng';

import { DialogComponent } from './dialog.component';


@NgModule({
    imports: [CommonModule, FormsModule, DialogModule,GrowlModule],
    declarations: [DialogComponent],
    exports:[DialogComponent],
    providers: []
})
export class DialogDataModule {  }