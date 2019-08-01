import { Injectable } from "@angular/core";

@Injectable()
export class ReportModelService {
  exportName: string;
  startTime: string;
  endTime: string;
  monitorLinks: string;
  metric: string;
  reportType: number;
  timeDimension?: string;
  peopleDimension?: string;
  deviceDimension?: string;
  regionDimension?: string;
  reportPPT?: string;
}
