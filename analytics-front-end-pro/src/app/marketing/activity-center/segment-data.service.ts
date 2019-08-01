import {Injectable} from '@angular/core';

@Injectable()
export class SegmentDataService {

    segmentInfo = {};           // 投放信息

    isUpdate: number = 2;       // 判断是编辑还是查看还是新建 0是查看 1是编辑 2是新建

    constructor() {
    }

}
