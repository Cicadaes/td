import { Injectable } from '@angular/core'

@Injectable()
export class HighterFunc {
  constructor() {
  }
  /**
   * 一个比较简单的柯里化通用式
   * @param  {any}    func [description]
   * @param  {any =    []}          args [description]
   * @return {any}         [description]
   */
  public createCurry(func: any, args: any = []): any {
    const arity = func.length
    const _this = this

    return function() {
      let _args = [].slice.call(arguments)
      _args.push(...args)
      if (_args.length < arity) {
        return _this.createCurry(func, _args)
      }
      return func(..._args)
    }
  }

}
