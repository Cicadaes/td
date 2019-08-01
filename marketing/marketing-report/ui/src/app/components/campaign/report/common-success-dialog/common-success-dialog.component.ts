import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
	
} from 'primeng/primeng';

@Component({
	selector: 'common-success-dialog',
	templateUrl: 'common-success-dialog.component.html',
	styleUrls: ['common-success-dialog.component.css'],
	providers: []
})

export class CommonSuccessDialogComponent {
	dialogShow:boolean = false;
	//@Output() onChart = new EventEmitter<boolean>();
	
	@Input()
		set showSuccess(bl: boolean) {
			let that = this;
			that.dialogShow = bl;
			setTimeout(function(){
				that.dialogShow  = false;
			},1500);
		}
	
	constructor(

	){

	};
	ngOnInit() {
        
        
	};
	closeDialog (){
		this.dialogShow = false;
	}
	
}