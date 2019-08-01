import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core'
import { AbstractControl, FormControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms'


/**
 * 正则校验的方法生成器(只对字符串)
 * @param  {AbstractControl} control [description]
 * @return {[type]}                  [description]
 */
const CheckRegExp = (nameRe: RegExp): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } => {
    let forbidden: boolean = true
    let str: string = control.value && control.value.trim && control.value.trim()
    str ? (forbidden = nameRe.test(str)) : (forbidden = true)

    return !forbidden ? { 'forbiddenName': { value: control.value } } : null
  }
}
/**
 * 正则校验的方法生成器(只对字符串)
 * @param  {AbstractControl} control [description]
 * @return {[type]}                  [description]
 */
const CheckRegExpppassword = (nameRe: RegExp): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } => {
    let forbidden: boolean = true;

    let valueRe = /^[\d]+$/;
    let str: string = control.value
    str ? (nameRe.test(str) ? (forbidden = !valueRe.test(str)) : (forbidden = false)) : (forbidden = nameRe.test(str))
    return !forbidden ? { 'forbiddenName': { value: control.value } } : null
  }
}
export {
  CheckRegExp,
  CheckRegExpppassword
}
