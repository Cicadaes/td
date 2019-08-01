package td.enterprise.page.mapper;

import org.springframework.stereotype.Component;
import td.enterprise.entity.Sensor;
import td.enterprise.web.vm.SensorDetailVM;
import td.enterprise.web.vm.SensorInfoVM;

/**
 * Created by Yan on 2017/3/10.
 * Mapper for the entity Project and its Page ProjectPage.
 */
@Component
public class SensorMapper {

    public SensorDetailVM sensorToSensorDetailVM(Sensor sensor) {

        SensorDetailVM sensorVM = new SensorDetailVM();

        if (sensor == null) {
            return sensorVM;
        }

        sensorVM.setId(sensor.getId());
        sensorVM.setSensorCode(sensor.getSensorCode());
        sensorVM.setSensorName(sensor.getSensorName());
        sensorVM.setSensorMac(sensor.getSensorMac());
        sensorVM.setStatus(sensor.getStatus());
        sensorVM.setDescription(sensor.getDescription());
        sensorVM.setTenantId(sensor.getTenantId());
        sensorVM.setProjectId(sensor.getProjectId());
        sensorVM.setMinRssi(sensor.getMinRssi());
        sensorVM.setRoomId(sensor.getRoomId());
        sensorVM.setRoomName(sensor.getRoomName());
        sensorVM.setPositionDescription(sensor.getPositionDescription());
        sensorVM.setDistance(sensor.getDistance());
        sensorVM.setIsOutside(sensor.getIsOutside());
        sensorVM.setSumHours(sensor.getSumHours());
        sensorVM.setRawDataQuantity(sensor.getRawDataQuantity());
        sensorVM.setProcessedData(sensor.getProcessedData());
        sensorVM.setCompared(sensor.getCompared());
        sensorVM.setSensorVersion(sensor.getSensorVersion());
        sensorVM.setSensorType(sensor.getSensorType());

        return sensorVM;
    }

    public SensorInfoVM sensorToSensorVM(Sensor sensor) {

        SensorInfoVM sensorVM = new SensorInfoVM();

        if (sensor == null) {
            return sensorVM;
        }

        sensorVM.setId(sensor.getId());
        sensorVM.setSensorCode(sensor.getSensorCode());
        sensorVM.setSensorName(sensor.getSensorName());
        sensorVM.setSensorMac(sensor.getSensorMac());
        sensorVM.setStatus(sensor.getStatus());
        sensorVM.setDescription(sensor.getDescription());
        sensorVM.setTenantId(sensor.getTenantId());
        sensorVM.setProjectId(sensor.getProjectId());
        sensorVM.setMinRssi(sensor.getMinRssi());
        sensorVM.setRoomId(sensor.getRoomId());
        sensorVM.setRoomName(sensor.getRoomName());
        sensorVM.setPositionDescription(sensor.getPositionDescription());
        sensorVM.setDistance(sensor.getDistance());
        sensorVM.setIsOutside(sensor.getIsOutside());
        sensorVM.setSumHours(sensor.getSumHours());
        sensorVM.setRawDataQuantity(sensor.getRawDataQuantity());
        sensorVM.setProcessedData(sensor.getProcessedData());
        sensorVM.setCompared(sensor.getCompared());
        sensorVM.setSensorVersion(sensor.getSensorVersion());
        sensorVM.setSensorType(sensor.getSensorType());

        return sensorVM;
    }

    public Sensor sensorVMToSensor(SensorInfoVM sensorVM) {

        Sensor sensor = new Sensor();

        if (sensorVM == null) {
            return sensor;
        }

        sensor.setId(sensorVM.getId());
        sensor.setSensorCode(sensorVM.getSensorCode());
        sensor.setSensorName(sensorVM.getSensorName());
        sensor.setSensorMac(sensorVM.getSensorMac());
        sensor.setStatus(sensorVM.getStatus());
        sensor.setDescription(sensorVM.getDescription());
        sensor.setTenantId(sensorVM.getTenantId());
        sensor.setProjectId(sensorVM.getProjectId());
        sensor.setMinRssi(sensorVM.getMinRssi());
        sensor.setRoomId(sensorVM.getRoomId());
        sensor.setRoomName(sensorVM.getRoomName());
        sensor.setPositionDescription(sensorVM.getPositionDescription());
        sensor.setDistance(sensorVM.getDistance());
        sensor.setIsOutside(sensorVM.getIsOutside());
        sensor.setSumHours(sensorVM.getSumHours());
        sensor.setRawDataQuantity(sensorVM.getRawDataQuantity());
        sensor.setProcessedData(sensorVM.getProcessedData());
        sensor.setCompared(sensorVM.getCompared());
        sensor.setSensorVersion(sensorVM.getSensorVersion());
        sensor.setSensorType(sensorVM.getSensorType());

        return sensor;
    }


    // public SensorVM sensorDOToSensorVM(SensorDO sensorDO) {//原来的DO与VM一样，故都是用DO即可，VM改成添加了其他属性的对象
    //
    //     SensorVM sensorvVM = new SensorVM();
    //
    //     if (sensorDO == null) {
    //         return sensorvVM;
    //     }
    //
    //     sensorvVM.setId(sensorDO.getId());
    //     sensorvVM.setSensorCode(sensorDO.getSensorCode());
    //     sensorvVM.setSensorMac(sensorDO.getSensorMac());
    //     sensorvVM.setSensorName(sensorDO.getSensorName());
    //     sensorvVM.setStatus(sensorDO.getStatus());
    //     sensorvVM.setDescription(sensorDO.getDescription());
    //     sensorvVM.setTenantId(sensorDO.getTenantId());
    //     sensorvVM.setProjectId(sensorDO.getProjectId());
    //     sensorvVM.setMinRssi(sensorDO.getMinRssi());
    //     sensorvVM.setRoomId(sensorDO.getRoomId());
    //     sensorvVM.setRoomName(sensorDO.getRoomName());
    //     sensorvVM.setPositionDescription(sensorDO.getPositionDescription());
    //     sensorvVM.setIsOutside(sensorDO.getIsOutside());
    //     sensorvVM.setDistance(sensorDO.getDistance());
    //     sensorvVM.setDiargamId(sensorDO.getDiargamId());
    //     sensorvVM.setLatitude(sensorDO.getLatitude());
    //     sensorvVM.setLongitude(sensorDO.getLongitude());
    //     sensorvVM.setProjectPlaceId(sensorDO.getProjectPlaceId());
    //     sensorvVM.setProjectPlaceName(sensorDO.getProjectPlaceName());
    //     sensorvVM.setRawDataQuantity(sensorDO.getRawDataQuantity());
    //     sensorvVM.setSumHours(sensorDO.getSumHours());
    //     sensorvVM.setCompared(sensorDO.getCompared());
    //     sensorvVM.setProcessedData(sensorDO.getProcessedData());
    //     return sensorvVM;
    // }

}

