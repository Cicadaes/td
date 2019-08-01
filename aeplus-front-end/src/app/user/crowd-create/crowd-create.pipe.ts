import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'crowdCreate'
})
export class CrowdCreatePipe implements PipeTransform {

    mustMap: any = {
        'false': '发生行为',
        'true': '未发生行为',
        'and': '并且',
        'or': '或者',
    };

    transform(value: any, args?: any): any {
        return this.mustMap[value] || value;
    }

}
