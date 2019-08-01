import {Directive, HostListener, Input} from '@angular/core';
import {NgModel} from '@angular/forms';

/**
 *
 * 默认为整数
 * 如果需要其他 添加 condition 属性
 * 不接收0给 acceptZero 传false
 * @class LimitNumberInputDirective
 */
@Directive({
    selector: 'input[tdLimitNumberInput]'
})
export class LimitNumberInputDirective {
    public static INTEGER: RegExp = /^-?\d{0,}$/; // 整数 I
    public static POSITIVE_INTEGER: RegExp = /^[1-9][0-9]*$/; // 正整数 PI
    public static NEGATIVE_INTEGER: RegExp = /^-[0-9]*[1-9][0-9]*$/; // 负整数 NI
    public static FLOATING_POINT: RegExp = /^(-?\d+)(\.\d+)?$/; // 浮点数 FP
    public static POSITIVE_FLOATING_POINT: RegExp = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([1-9][0-9]*))$/; // 正浮点数 PFP
    public static NEGATIVE_FLOATING_POINT: RegExp = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数 NFP
    public static UNUSEFUL_REGZEP: RegExp = /^.+$/; // 默认值

    // PI PFP I 已测试能够使用，其他的待测试

    private textTmp: string = ''; // 用来暂存输入框的值

    private pattern: RegExp = LimitNumberInputDirective.UNUSEFUL_REGZEP; // 正则表达式

    @Input() condition: string;
    @Input() acceptZero: boolean = true; // 如果是true，则可以为0，如果是false，则不能为0
    @Input() max: number = Infinity;
    @Input() min: number = -Infinity;

    @HostListener('keyup', ['$event'])
    onKeyup(event: any) {
        let that = this;
        let keyCode = event.keyCode;  // 0-9:48-57 -:189 .:190 delete:8
        let inputValue = event.target.value;
        // 判断是否为数字
        if ((keyCode >= 48 && keyCode <= 59) || keyCode === 189 || keyCode === 190 || keyCode === 8 || keyCode === 91 || keyCode === 86) {
            that.textTmp = inputValue;
        }
        event.target.value = that.textTmp;
        that.control.viewToModelUpdate(that.textTmp);
    }

    @HostListener('blur', ['$event'])
    onBlur(event: any) {
        let that = this;
        let inputValue: string = event.target.value;
        let pattern: RegExp = /[\.\-]$/;

        if (pattern.test(inputValue)) {
            inputValue = inputValue.slice(0, -1);
            event.target.value = inputValue;
            that.control.viewToModelUpdate(inputValue);
        }

    }

    @HostListener('input', ['$event'])
    onInput(event: any) {
        let that = this;
        let inputValue: string = event.target.value;
        let condition = that.condition ? that.condition.toUpperCase() : 'I'; // 条件
        let flag: boolean = true; // 用来判断正则是否匹配成功

        // 根据条件判断正则的值
        switch (condition) {
            case 'I':
                that.pattern = LimitNumberInputDirective.INTEGER;
                break;
            case 'PI':
                that.pattern = LimitNumberInputDirective.POSITIVE_INTEGER;
                break;
            case 'NI':
                that.pattern = LimitNumberInputDirective.NEGATIVE_INTEGER;
                break;
            case 'FP':
                that.pattern = LimitNumberInputDirective.FLOATING_POINT;
                break;
            case 'PFP':
                that.pattern = LimitNumberInputDirective.POSITIVE_FLOATING_POINT;
                break;
            case 'NFP':
                that.pattern = LimitNumberInputDirective.NEGATIVE_FLOATING_POINT;
                break;
            default:
                that.pattern = LimitNumberInputDirective.UNUSEFUL_REGZEP;
                break;
        }

        flag = that.pattern.test(inputValue);

        if (that.acceptZero && inputValue === '0') {
            event.target.value = inputValue;
            that.textTmp = inputValue;
            that.control.viewToModelUpdate(inputValue);
            return;
        }

        if (!flag) {
            inputValue = that.isNumberCheck(inputValue);

            event.target.value = inputValue;
            that.textTmp = inputValue;
            that.control.viewToModelUpdate(inputValue);
        }

        if (parseFloat(inputValue) > that.max) {
            event.target.value = that.max;
            that.textTmp = that.max + '';
            that.control.viewToModelUpdate(that.max);
        }

        if (parseFloat(inputValue) < that.min) {
            event.target.value = that.min;
            that.textTmp = that.min + '';
            that.control.viewToModelUpdate(that.min);
        }
    }

    isNumberCheck(value: string): string {
        let that = this;
        let condition = that.condition ? that.condition.toUpperCase() : 'I';
        let pattern1: RegExp = /^-?[1-9]{1,}[0-9]{0,}/;
        let pattern2: RegExp = /^-?(0{1}\.{1}[1-9]{0,})|([1-9]{1,}[0-9]{0,}\.?[0-9]{0,})/;
        let pattern: RegExp;

        if (condition === 'FP' || condition === 'PFP' || condition === 'NFP') {
            pattern = pattern2;
        } else {
            pattern = pattern1;
        }

        if (value.search(pattern) === 0) {
            return value.match(pattern)[0];
        } else {
            return '';
        }
    }

    constructor(private control: NgModel) {
//        let that = this;
    }
}