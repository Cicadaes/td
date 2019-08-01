package td.enterprise.service.DTO;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;


/**
 * 根据指定值进行排序中间类
 *
 * @author junmin.li
 */
public class ProjectOrder implements Comparable<ProjectOrder> {
    private String id;
    private String name;
    private Double value;
    private Map map; // 可以做为扩展使用

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Map getMap() {
        return map;
    }

    public void setMap(Map map) {
        this.map = map;
    }

    @Override
    public int compareTo(ProjectOrder o) {
        return o.getValue().compareTo(this.value);
    }

}
