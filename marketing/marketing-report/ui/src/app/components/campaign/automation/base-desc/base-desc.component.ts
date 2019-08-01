import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'base-desc',
    templateUrl: 'base-desc.component.html',
    styleUrls: [ 'base-desc.component.scss' ],
})
export class BaseDescComponent {
    @Input() textTitle: string;
    @Input() descTitle: string;
    @Input() textRequired: boolean = false;
    @Input() descRequired: boolean = false;

    textValue: string;
    @Output() textChange = new EventEmitter();
   
    @Input()
    get text() {
      	return this.textValue;
    }
    set text(val) {
		this.textValue = val && val.trim();
		this.textChange.emit(this.textValue);
    }


    descValue: string;
    @Output() descChange = new EventEmitter();
   
    @Input()
    get desc() {
      	return this.descValue;
    }
    set desc(val) {
		this.descValue = val && val.trim();
		this.descChange.emit(this.descValue);
    }
	
	@Input() editFlag: boolean;
}