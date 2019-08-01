package td.enterprise.wanalytics.etl.bean;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@SuppressWarnings("WeakerAccess")
@Getter
@Setter
@ToString
public class LocationEntity {
  private String province;
  private String city;
  private String district;
  private String residence;
}
