package td.enterprise.wanalytics.etl.common.tdid;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.entity.DmkIdmapping;
import td.enterprise.service.DmkIdmappingService;
import td.enterprise.wanalytics.etl.bean.DmkResponse;
import td.enterprise.wanalytics.etl.bean.IDMapping;
import td.enterprise.wanalytics.etl.bean.IDMappingBean;
import td.enterprise.wanalytics.etl.common.position.PositionCallable;
import td.enterprise.wanalytics.etl.util.DMKUtils;
import td.enterprise.wanalytics.etl.util.JacksonMapper;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.util.Map;
import java.util.concurrent.Callable;

/**
 * Created by junmin.li on 2017/6/21.
 */
public class TDIDCallable implements Callable<IDMappingBean> {

    public static Logger logger = Logger.getLogger(TDIDCallable.class);

    private String mac;

    TDIDCallable(String mac) {
        this.mac = mac;
    }

    /**
     * 添加缓存
     * @return
     * @throws Exception
     */
    public IDMappingBean call() throws Exception {
        DmkIdmapping dmkIdmapping = DmkIdmappingService.getByMac(mac);
        IDMappingBean bean =  null ;
        if(dmkIdmapping == null ){
            logger.info("数据库不存在，mac tdid 调用接口");
            DmkResponse response =  DMKUtils.queryIDMappingByMac(mac);
            if(StringUtils.isNotBlank(response.getData())) {
                bean = JacksonMapper.getObjectMapper().readValue(response.getData(), IDMappingBean.class);
            }
            //把结果保存下来
            IDMapping idMapping = bean == null ? null :   bean.getData();
            DmkIdmappingService.insert(mac,idMapping == null ? null : idMapping.getTdid(),response.getHttpStatus(),bean == null ? null : bean.getCode() + "");
        }else {
            logger.info("mac,tdid从数据库获取");
            if(null != dmkIdmapping.getTdid() && StringUtils.isNotBlank(dmkIdmapping.getTdid())){
                IDMapping idMapping = new IDMapping();
                idMapping.setMac(mac);
                idMapping.setTdid(dmkIdmapping.getTdid());
                bean = new IDMappingBean ();
                bean.setData(idMapping);
            }
        }
        return   bean;
    }
}
