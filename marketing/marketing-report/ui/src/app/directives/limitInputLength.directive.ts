import { Directive, HostListener, Input } from '@angular/core';
import { NgModel } from '@angular/forms';

/**
 * 限制输入，限制输入长度
 * @export
 * @class LimitInputLengthDirective
 */
@Directive({
	selector: '[tdLimitInputLength]'
})
export class LimitInputLengthDirective {
	@Input() max: number = Infinity;

	@HostListener('input', ['$event'])
	onInput(event: any) {
		let that = this;
		let inputValue: string = event.target.value;
		event.target.value = event.target.value.slice(0, that.max);
		that.control.viewToModelUpdate(event.target.value);
	}

	constructor(private control: NgModel) {
		let that = this;
	}
}