package td.enterprise.wanalytics.etl.common.position;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.entity.DmkLog;
import td.enterprise.service.DmkLogService;
import td.enterprise.wanalytics.etl.bean.*;
import td.enterprise.wanalytics.etl.common.tags.TagsCallable;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.DMKUtils;
import td.enterprise.wanalytics.etl.util.JacksonMapper;
import td.enterprise.wanalytics.etl.util.PositionUtil;

import java.util.*;
import java.util.concurrent.Callable;

/**
 * Created by junmin.li on 2017/6/21.
 * 先批量查询查询数据库，然后再批量调用接口
 */
public class PositionCallable implements Callable<List<DmkPosition>> {
    public static Logger logger = Logger.getLogger(PositionCallable.class);
    private List<String> idList;
    private String month;
    private final String positionsSeparator = ";";
    private final String hourSeparator = ":";
    private final String latLngAndCountsSeparator = "_";
    private final int latLngCountColumnSize = 3;
    private DmkInputTypeEnum inputType;

    public final String separator = ",";//同一时段多个位置

    public PositionCallable(List<String> idList,String month ,DmkInputTypeEnum inputType) {
        this.idList = idList;
        this.month = month;
        this.inputType = inputType;
    }

    public List<DmkPosition> call() throws Exception {
       return  getPositionById(idList,month);
    }

    private List<DmkPosition> getPositionById(List<String> idList,String month) throws Exception{
        if(idList == null){
            return null;
        }
        List<DmkPosition> list = new ArrayList<>();
        logger.info("===================list 大小是=" + idList.size());
        Set<String> idSet = new HashSet<String>();
        idSet.addAll(idList);

        //数据库里没有查询到，进行接口查询
        //返回数据 无论失败或者成功，只调用一次
        List<DmkLog>  dmkLogList = DmkLogService.getLogDataForPosition(inputType,idList,month,DmkEnum.POSITION_DEVICE);
        //查询出来没有没有调用的
        Set<String> containSet = new HashSet<>(); //查询到的id 集合mac 或者tdid
        if(null != dmkLogList){
            if(DmkInputTypeEnum.TDID.getCode().equals(inputType.getCode())){
                for(DmkLog dmkLog : dmkLogList){
                    containSet.add(dmkLog.getTdid());
                }
            }else if(DmkInputTypeEnum.MAC.getCode().equals(inputType.getCode())){
                for(DmkLog dmkLog : dmkLogList){
                    containSet.add(dmkLog.getMac());
                }
            }
        }

        //计算出来差集，获取没有调用dmk 接口的部分，然后进行逐个调用
        idSet.removeAll(containSet);
        logger.info("===============================调用接口大小是:" + idSet.size());

        List<DmkResponse> responseList = new ArrayList<>();
        List<String> callBackIdList = new ArrayList<>();

        //进行接口批量调用
        for(String id : idSet ){
            logger.info("数据库不存在，调用接口请求位置信息");
            DmkResponse response =  null ;
            DmkLog dmkLog = new DmkLog();
            long start = System.currentTimeMillis();
            try{
                if(DmkInputTypeEnum.TDID.getCode().equals(inputType.getCode())){
                    response = DMKUtils.queryPositionByTDID(id,month);
                    dmkLog.setTdid(id);
                }else if(DmkInputTypeEnum.MAC.getCode().equals(inputType.getCode())){
                    response = DMKUtils.queryPositionByMac(id,month);
                    dmkLog.setMac(id);
                }
            }catch (Exception e){
                logger.info("查询位置信息错误：id=" + id  + " month=" +  month);
            }
            long end = System.currentTimeMillis();
            if(null != response){
                responseList.add(response);
                callBackIdList.add(id);
                dmkLog.setData(response.getData());
                dmkLog.setHttpStatus(response.getHttpStatus()  +"");
                dmkLogList.add(dmkLog);
            }
        }

        //进行批量保存
        DmkLogService.insertPositionData(inputType,DmkEnum.POSITION_DEVICE,month,responseList,callBackIdList);

        //数据库里没有查询到，进行接口查询
        if(null != dmkLogList ){
            for(DmkLog dmkLog : dmkLogList){
                String data = dmkLog.getData();
                if(StringUtils.isNotBlank(data)){
                    PositionBean bean = JacksonMapper.getObjectMapper().readValue(data, PositionBean.class);
                    if(bean.getData() != null && bean.getData() != null){
                        PositionData positionData = bean.getData();
                        DmkPosition tmp = new DmkPosition();
                        tmp.setSyncDate(new Date());
                        tmp.setDmkCode(bean.getCode() + "");
                        tmp.setDmkMsg(bean.getMsg());
                        tmp.setDmkSeq(bean.getSeq());
                        tmp.setMac(dmkLog.getMac());
                        tmp.setTdid(bean.getData().getTdid());
                        tmp.setLatlng(positionData.getLatlng());
                        String latlngGps84 = batchConvertGcj02_Gps84(positionData.getLatlng());
                        tmp.setLatlngGps84(latlngGps84);
                        tmp.setMonth(month);
                        list.add(tmp);
                    }
                }
            }
        }
        return  list;
    }

    public  String batchConvertGcj02_Gps84(String latLng){
        StringBuffer buffer = new StringBuffer("");
        if(StringUtils.isNotBlank(latLng)) {
            String[] workDayOrNot =  latLng.split("\\|");
            String workLatLng = null;
            String weekLatLng = null;
            if (workDayOrNot != null && workDayOrNot.length <= 2 && workDayOrNot.length >= 1){
                workLatLng = workDayOrNot[0];
                if(workDayOrNot.length == 2 && !StringUtils.isBlank(workDayOrNot[1]) ){
                    weekLatLng =  workDayOrNot[1];
                }
            }
            String workLatLngGPS84 =  batchConvert (workLatLng);
            String weekLatLngGPS84 =  batchConvert (weekLatLng);
            if(StringUtils.isNotBlank(workLatLngGPS84)){
                buffer.append(workLatLngGPS84);
            }
            buffer.append("|");
            if(StringUtils.isNotBlank(weekLatLngGPS84)){
                buffer.append(weekLatLngGPS84);
            }
        }
        return buffer.toString();
    }



    /**
     * 把Gcj02 坐标转化为Gps84 坐标
     * @param latLng
     * @return
     */
    private String batchConvert(String latLng){
        if(null == latLng){
            return "";
        }
        StringBuffer  buffer =  new StringBuffer ("");
        String[] positions = latLng.split(positionsSeparator);//分割时段
        int i = 0;
        int size = positions.length;
        for (String position : positions) {
            String[] hourLatLng = position.split(hourSeparator);
            if (hourLatLng != null && hourLatLng.length == 2) {
                String hour = hourLatLng[0];
                //同一个时段，可能有多个位置
                String latLngStr  = hourLatLng[1];
                buffer.append(hour).append(hourSeparator);
                String [] latLngArry = latLngStr.split(separator);
                int tempSize = latLngArry.length;
                int j = 0;
                for(String temp : latLngArry){
                    String[] latLngCount = temp.split(latLngAndCountsSeparator);
                    if (latLngCount != null && latLngCount.length == latLngCountColumnSize) {
                        String  lat = latLngCount[0];
                        String  lng = latLngCount[1];
                        PositionUtil.Gps gps = PositionUtil.gcj_To_Gps84(Double.parseDouble(lat), Double.parseDouble(lng));
                        //需要格式化，进行保留最后几位小数
                        String lat84 = gps.getWgLat() + "";
                        String lng84 = gps.getWgLon() + "";
                        if(tempSize == 1){
                            buffer.append(lat84).append(latLngAndCountsSeparator).append(lng84).append(latLngAndCountsSeparator).append(latLngCount[2]);
                        }else if (j != tempSize -1){
                            buffer.append(lat84).append(latLngAndCountsSeparator).append(lng84).append(latLngAndCountsSeparator).append(latLngCount[2]);
                            buffer.append(separator);
                        }else if (j == tempSize - 1){
                            buffer.append(lat84).append(latLngAndCountsSeparator).append(lng84).append(latLngAndCountsSeparator).append(latLngCount[2]);
                        }
                    }
                    j ++;
                }
                if(size > 1 && i != size - 1){
                    buffer.append(positionsSeparator);
                }
            }
            i ++;
        }
        return buffer.toString();
    }


}
