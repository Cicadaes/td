package td.enterprise.wanalytics.etl.bean;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * DMK 返回结果
 */
@Getter
@Setter
@ToString
public class DmkResponse {

    private String data;
    private int httpStatus; //dmk 接口返回状态

}
