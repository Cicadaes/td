import { StageService } from './../stage.service';

export class ChartsPreviewService extends StageService {
    public StageBaseData:any;
    public pageTotal:string = "";
    initPreviewStage(config:any, cb:any) {
        if(config) {
            this.backUrl = config.data.backUrl || '/'
            cb(config.data.reportId)
        }
    }
}