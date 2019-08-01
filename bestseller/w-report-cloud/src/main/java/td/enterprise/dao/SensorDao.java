package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.dao.DO.SensorDO;
import td.enterprise.entity.Sensor;
import td.enterprise.page.SensorPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>探针 SensorDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface SensorDao extends BaseDao<Sensor> {


    List<SensorDO> queryInfoByList(SensorPage page);

    List<SensorDO> queryByUnion(SensorPage page);

    List<SensorDO> queryProjectByUnion(SensorPage page);

    List<Sensor> querySensorNoRoomByList(SensorPage page);


    List<Sensor> querySensorProjectList(SensorPage page);

    int getInfoByListCount(SensorPage page);

    void updateByMac(Sensor sensor);

    List<Sensor> querNoTypeInSensors(SensorPage page);

    int queryInfoByCount(SensorPage page);
}
