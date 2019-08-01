package td.enterprise.entity;

import lombok.Builder;
import lombok.Data;

/**
 * FTP 行信息
 * @description 
 * @author sxk
 * @date 2017年10月12日
 */
@Data
@Builder
public class FTPLine {
    //终端MAC
    private String  stationMac;
    //信号强度
    private Integer signalStrength;
    //信道
    private Integer channel;
    //AP MAC地址
    private String  apMac;
    //扫描时间（设备扫描时间精确到秒）
    private Long    time;

    @Override
    public boolean equals(Object obj) {
        StringBuilder sb = new StringBuilder();
        sb.append(this.stationMac);
        sb.append(this.signalStrength);
        sb.append(this.channel);
        sb.append(this.apMac);
        sb.append(this.time);

        FTPLine line2Obj = (FTPLine) obj;
        StringBuilder sb2Obj = new StringBuilder();
        sb2Obj.append(line2Obj.stationMac);
        sb2Obj.append(line2Obj.signalStrength);
        sb2Obj.append(line2Obj.channel);
        sb2Obj.append(line2Obj.apMac);
        sb2Obj.append(line2Obj.time);

        return sb.toString().equals(sb2Obj.toString());
    }

    @Override
    public int hashCode() {
        StringBuilder sb = new StringBuilder();
        sb.append(this.stationMac);
        sb.append(this.signalStrength);
        sb.append(this.channel);
        sb.append(this.apMac);
        sb.append(this.time);
        return sb.toString().hashCode();
    }

}
