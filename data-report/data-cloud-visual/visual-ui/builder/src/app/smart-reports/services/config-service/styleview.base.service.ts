
export class StyleviewBaseService {
    StyleViewMetadata: Array<any>;
    StyleViewCurrent:any;
    StyleViewData: any;

    getStyleviewDataByType(type: any): any {
        let sd = this.StyleViewMetadata, _sd;
        if (!sd) {
            return !console.warn('no cache') && []
        }
        if (Array.isArray(sd) && sd.length) {
            _sd = sd.filter(item => item.type == type);
            if (_sd.length) {
                return JSON.parse(JSON.stringify(_sd[0]))
            } else {
                console.warn('no type');
                return {}
            }
        }
    }

}