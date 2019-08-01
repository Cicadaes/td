import {NgModule}       from '@angular/core';
import {CommonModule}   from '@angular/common';
import {FormsModule} from '@angular/forms';
import { CalendarModule, GrowlModule } from 'primeng/primeng';
import { DatePickerComponent } from './datePicker.component';
import { PdateComponent } from './pdate/pdate.component';
import { PinputComponent } from './pinput/pinput.component';


@NgModule({
    imports:[CommonModule, FormsModule, CalendarModule, GrowlModule],
    declarations:[DatePickerComponent, PinputComponent, PdateComponent],
    exports:[DatePickerComponent],
    providers:[]
})

export class DatePickerModule {

}