import { Pipe, PipeTransform } from '@angular/core';

/**
 * 针对selectItem的，有局限性
 * @param tags 是 p-dropdown 的 options 格式为 [{ value: string }, ... ] 参考primeng的selectItem[]
 * @param filterTags p-dropdown 选中标签value的集合
 * @param index 当前过滤标签是第几个 因为不能过滤掉它自己
 */
@Pipe({
    name: 'filterTags',
    pure: false
})
export class FilterTagsPipe implements PipeTransform {
    transform(tags: any, filterTags: any, index: number): string {
        let tagsTmp: any = [];
        if(!tags || !filterTags) {
            return tags;
        }

        tagsTmp = tags.filter((tag: any) => {
            if(tag.value === filterTags[index]) {
                return true;
            }
            for(let t of filterTags) {
                if(tag.value === t) {
                    return false;
                }
            }
            return true;
        });

        return tagsTmp;
    }
}