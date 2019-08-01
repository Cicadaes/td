package td.enterprise.entity.type;

import lombok.AllArgsConstructor;

/**
 * Created by xianbin.yang on 2018/1/22.
 */
@AllArgsConstructor
public enum ShopSizeEnum {

  L("L", "default.large.rssi"),
  M("M", "default.middle.rssi"),
  S("S", "default.small.rssi");

  private String code;
  private String paramKey;

  public String getCode() {
    return this.code;
  }

  public String getParamKey() {
    return this.paramKey;
  }

  public static ShopSizeEnum of(String code) {
    for (ShopSizeEnum v : values()) {
      if (v.getCode().equalsIgnoreCase(code)) {
        return v;
      }
    }
    throw new IllegalArgumentException();
  }

}
