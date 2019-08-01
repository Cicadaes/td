import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { SmartIndexComponent }  from './index.component';

import { SmartModule } from './../smart-reports/smart.module';
import { PreviewModule } from './../smart-reports/preview/preview.module';

@NgModule({
    imports:      [ CommonModule, FormsModule, SmartModule, PreviewModule ],
    declarations: [ SmartIndexComponent ]

})
export class SmartIndexModule {  }