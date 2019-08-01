package td.enterprise.wanalytics.etl.bean;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Created by Yan on 2017/4/17.
 */
@Getter
@Setter
@ToString
public class ServiceConf {
    private String service;
    private String token;
    private String appkey;
}
