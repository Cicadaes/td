import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfigsComponent } from './configs.component';

import { TconfigInputComponent } from './dynamic-charts-config/tconfig-components/tconfig-input/tconfig-input.component';
import { TconfigAutoCompleteComponent } from './dynamic-charts-config/tconfig-components/tconfig-autocomplete/tconfig-autocomplete.component';
import { TconfigTextareaComponent } from './dynamic-charts-config/tconfig-components/tconfig-textarea/tconfig-textarea.component';
import { TconfigSelectComponent } from './dynamic-charts-config/tconfig-components/tconfig-select/tconfig-select.component';
import { TconfigSelectListComponent } from './dynamic-charts-config/tconfig-components/tconfig-select-list/tconfig-select-list.component';
import { TconfigRadioListComponent } from './dynamic-charts-config/tconfig-components/tconfig-radio-list/tconfig-radio-list.component';
import { TconfigCheckboxListComponent } from './dynamic-charts-config/tconfig-components/tconfig-checkbox-list/tconfig-checkbox-list.component';
import { TconfigRadioComponent } from './dynamic-charts-config/tconfig-components/tconfig-radio/tconfig-radio.component';
import { TconfigCheckboxComponent } from './dynamic-charts-config/tconfig-components/tconfig-checkbox/tconfig-checkbox.component';
import { TconfigColorBlockComponent } from './dynamic-charts-config/tconfig-components/tconfig-color-block/tconfig-color-block.component';
import { TconfigColorPickerComponent } from './dynamic-charts-config/tconfig-components/tconfig-color-picker/tconfig-color-picker.component';
import { TconfigDragRangeComponent } from './dynamic-charts-config/tconfig-components/tconfig-drag-range/tconfig-drag-range.component';
import { TconfigDatasourceSelectComponent } from './dynamic-charts-config/tconfig-components/tconfig-datasource-select/tconfig-datasource-select.component';
import { TconfigDatePickerComponent } from './dynamic-charts-config/tconfig-components/tconfig-date-picker/tconfig-date-picker.component';
import { TfilterDatePickerComponent } from './dynamic-charts-config/tconfig-components/tfilter-date-picker/tfilter-date-picker.component';
import { TconfigAutoCompleteListComponent } from './dynamic-charts-config/tconfig-components/tconfig-autocomplete-list/tconfig-autocomplete-list.component';
import { TconfigDatatypeSelectComponent } from './dynamic-charts-config/tconfig-components/tconfig-datatype-select/tconfig-datatype-select.component';
import { TconfigDataListSelectComponent } from './dynamic-charts-config/tconfig-components/tconfig-datalist-select/tconfig-datalist-select.component';
import { TconfigTextareaSelectComponent } from './dynamic-charts-config/tconfig-components/tconfig-textarea-select/tconfig-textarea-select.component';
import { TconfigCheckboxInputComponent } from './dynamic-charts-config/tconfig-components/tconfig-checkbox-input/tconfig-checkbox-input.component';


import { ChartstyleConfigComponent } from './chartstyle-config/chartstyle-config.component';
import { DatasourceConfigComponent } from './datasource-config/datasource-config.component';
import { FormatConfigComponent } from './format-config/format-config.component';
// import { ThemeConfigComponent } from './theme-config/theme-config.component';
import { ChartsConfigService } from './../services/config.service';

import {
    TabViewModule, InputTextModule, DropdownModule, GrowlModule,
    FileUploadModule, InputTextareaModule, AutoCompleteModule, RadioButtonModule, CheckboxModule, SliderModule
} from 'primeng/primeng';
import { DatePickerModule } from './../support/common/datePicker/datePicker.module';

import { ColorPickerModule } from 'angular2-dw-color-picker';

@NgModule({
    imports: [
        CommonModule, 
        FormsModule, 
        TabViewModule, 
        InputTextModule, 
        DropdownModule, 
        GrowlModule,
        FileUploadModule, 
        InputTextareaModule, 
        AutoCompleteModule, 
        RadioButtonModule, 
        CheckboxModule,
        ColorPickerModule,
        SliderModule,
        DatePickerModule
    ],
    declarations: [
        ConfigsComponent, 
        DatasourceConfigComponent, 
        ChartstyleConfigComponent,
        FormatConfigComponent,
        // ThemeConfigComponent,
        TconfigAutoCompleteComponent, 
        TconfigInputComponent,
        TconfigSelectComponent, 
        TconfigDatasourceSelectComponent,
        TconfigTextareaComponent, 
        TconfigDragRangeComponent, 
        TconfigCheckboxListComponent, 
        TconfigRadioListComponent,
        TconfigSelectListComponent, 
        TconfigColorPickerComponent, 
        TconfigColorBlockComponent, 
        TconfigRadioComponent, 
        TconfigCheckboxComponent,
        TconfigDatePickerComponent,
        TfilterDatePickerComponent,
        TconfigAutoCompleteListComponent,
        TconfigDatatypeSelectComponent,
        TconfigDataListSelectComponent,
        TconfigTextareaSelectComponent,
        TconfigCheckboxInputComponent
    ],
    exports: [ConfigsComponent],
    providers: [ChartsConfigService]
})
export class ConfigsModule { }