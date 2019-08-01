import { Pipe, PipeTransform } from '@angular/core';

/**
 * 针对selectItem的，有局限性 性能不高
 * @param list 是 p-dropdown 的 options 格式为 [{ value: string }, ... ] 参考primeng的selectItem[]
 * @param eventlist 已经选中的事件列表 因为是给触发器使用这里对应 触发器的list
 * @param index 当前过滤标签是第几个 因为不能过滤掉它自己
 */

@Pipe({
    name: 'triggerEvent',
    pure: false
})
export class TriggerEventPipe implements PipeTransform {
    transform(list: any, eventlist: any, index: number): string {
        let tagsTmp: any = [];
        if (!list || !eventlist) {
            return list;
        }

        tagsTmp = list.filter((tag: any) => {
            if (tag.value === eventlist[index].code) {
                return true;
            }
            for (let t of eventlist) {
                if (tag.value === t.code) {
                    return false;
                }
            }
            return true;
        });

        return tagsTmp;
    }
}