import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'positionAnalysis'
})
export class PositionAnalysisPipe implements PipeTransform {

    mustMap: any = {
        'world': '世界地图',
        'china': '中国地图',
        'Year': '同比',
        'Ring': '环比',
    };

    transform(value: any, args?: any): any {
        return this.mustMap[value] || value;
    }

}
