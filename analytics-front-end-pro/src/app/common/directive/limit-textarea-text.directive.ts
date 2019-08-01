import { Directive, HostListener, Input } from '@angular/core';
import { NgModel } from '@angular/forms';

/**
 * 默认为中文和英文和数字
 * 如果需要其他 添加 condition 属性
 * type 为all 时匹配所有字段
 * @class LimitTextareaTextDirective
 */
@Directive({
	selector: 'textarea[tdLimitTextareaText]'
})
export class LimitTextareaTextDirective {
    public static CN_EN_NUMBER: RegExp = /^[A-Za-z0-9\u4E00-\u9FA5\'\‘]+$/;  //中文英文和数字
    public static ALL: RegExp = /^[/s/S]*/;     // 匹配任意字符

    private pattern: RegExp = LimitTextareaTextDirective.CN_EN_NUMBER; // 正则表达式

    @Input() max: number = Infinity;
    @Input() iType: string = 'ch_en_number';

    @HostListener('input', ['$event'])
    onInput(event: any) {
        let that = this;
        let inputValue: string = event.target.value;
        let flag: boolean = true; // 用来判断正则是否匹配成功
        let length = inputValue.length;
        if (that.iType === 'all') {
            that.pattern = LimitTextareaTextDirective.ALL;
        }
        flag = that.pattern.test(inputValue);

        if(!flag) {
            inputValue = that.check(inputValue);
            event.target.value = inputValue;
            that.control.viewToModelUpdate(inputValue);
        }

        if (length > that.max) {
            inputValue = inputValue.substring(0, that.max);
            event.target.value = inputValue;
            that.control.viewToModelUpdate(inputValue);
        }
    }

    check(value: string): string {
//        let that = this;
        let pattern = /^[A-Za-z0-9\u4E00-\u9FA5\'\‘]+/;
        if(value.search(pattern) === 0) {
            return value.match(pattern)[0];
        }else {
            return '';
        }
    }

    constructor(private control: NgModel) {
//        let that = this;
	}
}