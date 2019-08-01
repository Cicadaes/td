package td.enterprise.wanalytics.etl.bean;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserLocalData {
  private List<LocationEntity> location;
  private String tdid;
  private String mac;
}
