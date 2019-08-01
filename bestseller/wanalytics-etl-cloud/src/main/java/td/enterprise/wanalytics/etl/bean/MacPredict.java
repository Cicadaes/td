package td.enterprise.wanalytics.etl.bean;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Mac
 */
@Getter
@Setter
@ToString
public class MacPredict {

    //进店时间mm.ss
   private String starttime;
   //离店时间mm.ss
   private String endtime;
   //停留时长
   private int station;
   //最强信号
   private int strongsignal;
   //最弱信号
   private int weaksignal;
   //波动次数，相同的信号强度不算
   private int times;
   //波动差值
   private int diff;

}
