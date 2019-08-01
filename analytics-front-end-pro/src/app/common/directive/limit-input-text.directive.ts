import { Directive, HostListener, Input } from '@angular/core';
import { NgModel } from '@angular/forms';

/**
 * 默认为中文和英文和数字
 * 如果需要其他 添加 condition 属性
 * type 为all 时匹配所有字段
 * @class LimitInputTextDirective
 */
@Directive({
	selector: 'input[tdLimitInputText]'
})
export class LimitInputTextDirective {
    public static CN_EN_NUMBER: RegExp = /^[A-Za-z0-9\u4E00-\u9FA5\'\‘]+$/;  // 中文英文和数字
    public static TRIGGER_INPUT: RegExp = /^[A-Za-z0-9\u4e00-\u9fa5_-]+$/;  // 触发器正则校验 中文、数字、字母、下划线和横杠
    public static ALL: RegExp = /^[/s/S]*/;     // 匹配任意字符

    private pattern: RegExp = LimitInputTextDirective.CN_EN_NUMBER; // 正则表达式
    
    cpLock: boolean = false;        // 是否是“虚拟文本”状态（拼音）

    @Input() max: number = Infinity;
    @Input() iType: string = 'ch_en_number';

    @HostListener('compositionstart', ['$event'])
    compositionstart(event: any) {
        this.cpLock = true;
    }

    @HostListener('compositionend', ['$event'])
    compositionend(event: any) {
        this.cpLock = false;
    }

    @HostListener('input', ['$event'])
    onInput(event: any) {
        let that = this;
        if(that.cpLock){    // 输入法是词语时，会有'   例如：bai'du  这个时候属于虚拟文本，不做校验。
            return ;
        }
        let inputValue: string = event.target.value;
        let flag: boolean = true; // 用来判断正则是否匹配成功
        let length = inputValue.length;
        if (that.iType === 'all') {
            that.pattern = LimitInputTextDirective.ALL;
        }
        if (that.iType === 'triggerInput') {
            that.pattern = LimitInputTextDirective.TRIGGER_INPUT;
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
        // let pattern = /^[A-Za-z0-9\u4E00-\u9FA5\'\‘]+/;
        // if(value.search(pattern) <= 0) {
        //     return value.match(pattern) && value.match(pattern)[0];
        // }else {
        //     return '';
        // }
        const that = this;
        let pattern;
        if (that.iType === 'triggerInput') {
            pattern = /[^A-Za-z0-9\u4E00-\u9FA5_-]+/;
        } else {
            pattern = /[^A-Za-z0-9\u4E00-\u9FA5\'\‘]+/;
        }
        return value.replace(pattern, '');
    }

    constructor(private control: NgModel) {
//        let that = this;
	}
}