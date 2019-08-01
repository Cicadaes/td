import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { PreviewIndexComponent }  from './preview.component';

import { PreviewModule } from './../smart-reports/preview/preview.module';

@NgModule({
    imports:      [ CommonModule, FormsModule, PreviewModule ],
    declarations: [ PreviewIndexComponent ]

})
export class PreviewIndexModule {  }