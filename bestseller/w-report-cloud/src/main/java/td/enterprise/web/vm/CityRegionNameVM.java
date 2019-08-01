package td.enterprise.web.vm;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class CityRegionNameVM {
    private String name;
    private List<String[]> list;
}
