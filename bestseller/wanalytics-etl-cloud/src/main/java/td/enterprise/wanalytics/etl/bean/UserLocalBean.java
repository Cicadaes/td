package td.enterprise.wanalytics.etl.bean;


import java.io.IOException;
import java.util.List;

import lombok.Data;
import td.enterprise.wanalytics.etl.util.JacksonMapper;

/**
 * 夜间活跃区域查询服务返回结果类
 */
@Data
public class UserLocalBean {
  private String code;
  private String msg;
  private String seq;
  private UserLocalData data;

  public static void main(String[] args) throws IOException {
    String data = "{\n" +
        "\t\"code\": 2001,\n" +
        "\t\"msg\": \"ok\",\n" +
        "\t\"data\": {\n" +
        "\t\t\"location\": [\n" +
        "\t\t\t{\n" +
        "\t\t\t\t\"province\": \"辽宁省\",\n" +
        "\t\t\t\t\"city\": \"沈阳市\",\n" +
        "\t\t\t\t\"district\": \"大东区\",\n" +
        "\t\t\t\t\"residence\": \"尚品天城（南区）\"\n" +
        "\t\t\t},\n" +
        "\t\t\t{\n" +
        "\t\t\t\t\"province\": \"辽宁省\",\n" +
        "\t\t\t\t\"city\": \"沈阳市\",\n" +
        "\t\t\t\t\"district\": \"和平区\",\n" +
        "\t\t\t\t\"residence\": \"八一公园（三纬路）\"\n" +
        "\t\t\t},\n" +
        "\t\t\t{\n" +
        "\t\t\t\t\"province\": \"江苏省\",\n" +
        "\t\t\t\t\"city\": \"扬州市\",\n" +
        "\t\t\t\t\"district\": \"邗江区\",\n" +
        "\t\t\t\t\"residence\": \"骏和·玲珑湾\"\n" +
        "\t\t\t}\n" +
        "\t\t],\n" +
        "\t\t\"tdid\": \"3f64ad4fba1e00154592c65ae54e4a921\"\n" +
        "\t},\n" +
        "\t\"seq\": \"b6bea7a4645b45528d0034c3c1d010d2\"\n" +
        "}";
    UserLocalBean userLocalBean = JacksonMapper.getObjectMapper().readValue(data, UserLocalBean.class);
    List<LocationEntity> location = userLocalBean.getData().getLocation();
    System.out.println("-----" + location.size() + "--" + location.toString());
  }
}
